import { provider, TokenName } from '@/constants';
import { DeltaNeutralMM } from './delta_neutral_mm';
import {
  AmountsInfo,
  IStrategySettings,
  Step,
  StrategyAction,
  StrategyLiveStatus,
  StrategyStatus,
  TokenInfo,
} from './IStrategy';
import MyNumber from '@/utils/MyNumber';
import {
  convertToV2TokenInfo,
  getEndpoint,
  getTokenInfoFromName,
  ZeroAmountsInfo,
} from '@/utils';
import { vesu } from '@/store/vesu.store';
import { endur } from '@/store/endur.store';
import { getDefaultPoolInfo, PoolInfo } from '@/store/pools';
import { Contract } from 'starknet';
import { fetchQuotes, QuoteRequest } from '@avnu/avnu-sdk';
import { Web3Number } from '@strkfarm/sdk';

export class DeltaNeutralMMVesuEndur extends DeltaNeutralMM {
  vesuPoolName = 'Re7 xSTRK';
  fee_factor: number = 0.2;
  constructor(
    token: TokenInfo,
    name: string,
    description: string,
    secondaryTokenName: TokenName,
    strategyAddress: string,
    stepAmountFactors: number[],
    liveStatus: StrategyLiveStatus,
    settings: IStrategySettings,
  ) {
    super(
      token,
      name,
      description,
      secondaryTokenName,
      strategyAddress,
      stepAmountFactors,
      liveStatus,
      settings,
      endur,
      vesu,
    );

    this.metadata.points = [
      {
        multiplier: 3,
        toolTip:
          'Earn ~3x Endur points on this leveraged strategy. Points can be found on endur.fi.',
        logo: 'https://endur.fi/favicon.ico',
      },
    ];
    this.metadata.risk.netRisk = 0.75;
    const risks = [this.risks[0], this.risks[2]];
    if (this.settings.alerts && this.settings.alerts.length > 0) {
      risks.push(
        'If xSTRK price on DEXes deviates from expected price, you may lose money or may have to wait for the price to recover.',
      );
    }
    risks.push(...this.risks.slice(3));
    this.risks = risks;
  }

  filterMainToken(
    pools: PoolInfo[],
    amount: string,
    prevActions: StrategyAction[],
  ) {
    const dapp = prevActions.length == 0 ? this.protocol1 : this.protocol2;
    const tokenName =
      prevActions.length == 0
        ? this.token.name
        : `${this.token.name} (${this.vesuPoolName})`;
    return pools.filter(
      (p) => p.pool.name == tokenName && p.protocol.name == dapp?.name,
    );
  }

  filtetVesuToken(
    pools: PoolInfo[],
    amount: string,
    prevActions: StrategyAction[],
    tokenName: string,
  ) {
    const dapp = this.protocol2;
    return pools.filter(
      (p) =>
        p.pool.name == `${tokenName} (${this.vesuPoolName})` &&
        p.protocol.name == dapp?.name,
    );
  }

  optimizer(
    eligiblePools: PoolInfo[],
    amount: string,
    actions: StrategyAction[],
  ): StrategyAction[] {
    return []; // @deprecated
  }

  getSteps(): Step[] {
    if (!this.protocol1 || !this.protocol2) {
      return [];
    }
    return [
      {
        name: `Stake ${this.token.name} to ${this.protocol1.name}`,
        optimizer: this.optimizer,
        filter: [this.filterMainToken],
      },
      {
        name: `Supply's your ${this.secondaryToken} to ${this.protocol2.name}`,
        optimizer: this.optimizer,
        filter: [
          (...args) => {
            return this.filtetVesuToken(...args, this.secondaryToken);
          },
        ],
      },
      {
        name: `Borrow ${this.token.name} from ${this.protocol2.name}`,
        optimizer: this.optimizer,
        filter: [
          (...args) => {
            return this.filtetVesuToken(...args, this.token.name);
          },
        ],
      },
      {
        name: `Loop back to step 1, repeat 3 more times`,
        optimizer: this.getLookRepeatYieldAmount,
        filter: [this.filterMainToken],
      },
      {
        name: `Re-invest your STRK Rewards every 7 days (Compound)`,
        optimizer: this.compounder,
        filter: [this.filterTokenByProtocol('STRK', this.protocol1)],
      },
    ];
  }

  getLookRepeatYieldAmount(
    eligiblePools: PoolInfo[],
    amount: string,
    actions: StrategyAction[],
  ) {
    return []; // @deprecated
  }

  async solve(pools: PoolInfo[], amount: string) {
    const netYield = 0;
    this.status = StrategyStatus.SOLVING;
    const re7PoolID =
      '2345856225134458665876812536882617294246962319062565703131100435311373119841';
    const xSTRKPool = pools.find((p) => p.pool.id == `Vesu_${re7PoolID}_xSTRK`);
    const STRKPool = pools.find((p) => p.pool.id == `Vesu_${re7PoolID}_STRK`);
    const endurXSTRK = pools.find((p) => p.pool.id == 'endur_strk');

    this.actions = this.getSteps().map((step) => {
      return {
        name: step.name,
        amount: '0',
        isDeposit: step.name.includes('Borrow') ? false : true,
        pool: getDefaultPoolInfo(),
      };
    });

    const fee = this.fee_factor;
    let STRKRewardsAPR =
      xSTRKPool?.aprSplits.find((a) => a.title == 'STRK rewards')?.apr || 0;
    STRKRewardsAPR = STRKRewardsAPR == 'Err' ? 0 : STRKRewardsAPR;
    const collateralAPY = (xSTRKPool?.apr || 0) + (endurXSTRK?.apr || 0);
    const feeAdjustedColAPY = collateralAPY - STRKRewardsAPR * this.fee_factor;
    const borrowAPY = STRKPool?.borrow.apr || 0;

    const {
      collateralXSTRK,
      collateralUSDValue,
      debtSTRK,
      debtUSDValue,
      xSTRKPrice,
    } = await this.getPositionInfo();

    const PAYOFF =
      Number(collateralUSDValue.toEtherToFixedDecimals(6)) * feeAdjustedColAPY -
      Number(debtUSDValue.toEtherStr()) * borrowAPY;
    const investment =
      Number(collateralUSDValue.toEtherToFixedDecimals(6)) -
      Number(debtUSDValue.toEtherStr());
    this.netYield = investment == 0 ? 0 : PAYOFF / investment;
  }

  async getPositionInfo() {
    const resp = await fetch(
      `${getEndpoint()}/vesu/positions?walletAddress=${this.strategyAddress}`,
    );
    const data = await resp.json();
    if (!data.data || data.data.length == 0) {
      throw new Error('No positions found');
    }

    const collateralXSTRK = new MyNumber(
      data.data[0].collateral.value,
      data.data[0].collateral.decimals,
    );
    const collateralUSDValue = new MyNumber(
      data.data[0].collateral.usdPrice.value,
      data.data[0].collateral.usdPrice.decimals,
    );
    const debtSTRK = new MyNumber(
      data.data[0].debt.value,
      data.data[0].debt.decimals,
    );
    const debtUSDValue = new MyNumber(
      data.data[0].debt.usdPrice.value,
      data.data[0].debt.usdPrice.decimals,
    );

    const xSTRKPrice = await this.getXSTRKPrice();
    const collateralInSTRK =
      Number(collateralXSTRK.toEtherToFixedDecimals(6)) * xSTRKPrice;
    const STRKUSDPrice =
      Number(debtUSDValue.toEtherToFixedDecimals(6)) /
      Number(debtSTRK.toEtherToFixedDecimals(6));
    const actualCollateralUSDValue = collateralInSTRK * STRKUSDPrice;

    return {
      collateralXSTRK,
      collateralUSDValue: MyNumber.fromEther(
        actualCollateralUSDValue.toFixed(6),
        collateralUSDValue.decimals,
      ),
      debtSTRK,
      debtUSDValue,
      xSTRKPrice,
      collateralInSTRK,
    };
  }

  getTVL = async (): Promise<AmountsInfo> => {
    if (!this.isLive()) return ZeroAmountsInfo([this.token]);

    try {
      const {
        collateralXSTRK,
        collateralUSDValue,
        debtSTRK,
        debtUSDValue,
        xSTRKPrice,
        collateralInSTRK,
      } = await this.getPositionInfo();

      const usdValue =
        Number(collateralUSDValue.toEtherToFixedDecimals(6)) -
        Number(debtUSDValue.toEtherStr());

      return {
        usdValue,
        amounts: [
          {
            amount: new Web3Number(
              (
                collateralInSTRK - Number(debtSTRK.toEtherToFixedDecimals(6))
              ).toFixed(6),
              collateralXSTRK.decimals,
            ),
            usdValue,
            tokenInfo: convertToV2TokenInfo(this.token),
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching TVL:', error);
      return ZeroAmountsInfo([this.token]);
    }
  };

  async getXSTRKPrice(retry = 0): Promise<number> {
    const params: QuoteRequest = {
      sellTokenAddress: getTokenInfoFromName(this.secondaryToken).token || '',
      buyTokenAddress: this.token.token,
      sellAmount: BigInt(Number(MyNumber.fromEther('1', 18).toString())),
      takerAddress: this.token.token,
    };
    console.log('getXSTRKPrice', params);
    const quotes = await fetchQuotes(params);
    console.log('fetchQuotes', quotes);
    if (quotes.length == 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.getXSTRKPrice(retry + 1);
    }

    const firstQuore = quotes[0];
    const price = Number(
      new MyNumber(firstQuore.buyAmount.toString(), 18).toEtherToFixedDecimals(
        6,
      ),
    );
    console.log('getXSTRKPrice', price);
    return price;
  }

  getSettings = async () => {
    const cls = await provider.getClassAt(this.strategyAddress);
    const contract = new Contract(cls.abi, this.strategyAddress, provider);
    const settings = await contract.call('get_settings', []);
    console.log('getSettings', settings);
  };
}
