import {
  ContractAddr,
  IStrategyMetadata,
  UniversalLstMultiplierStrategy,
  UniversalStrategySettings,
  Web3Number,
} from '@strkfarm/sdk';
import { UniversalStrategyClass } from './universal.strat';
import { ReactNode } from 'react';
import {
  DepositActionInputs,
  IStrategySettings,
  StrategyLiveStatus,
  TokenInfo,
} from './IStrategy';
import { buildStrategyActionHook, DummyStrategyActionHook } from '@/utils';

export class HyperLSTStrategy extends UniversalStrategyClass<
  typeof UniversalLstMultiplierStrategy
> {
  constructor(
    id: string,
    token: TokenInfo,
    name: string,
    description: string | ReactNode,
    strategy: IStrategyMetadata<UniversalStrategySettings>,
    liveStatus: StrategyLiveStatus,
    settings: IStrategySettings,
  ) {
    super(
      id,
      token,
      name,
      description,
      strategy,
      liveStatus,
      settings,
      UniversalLstMultiplierStrategy,
    );
  }

  depositMethods = async (inputs: DepositActionInputs) => {
    const { amount, address, provider } = inputs;
    const lstUnderlying = this.universalStrategy.getLSTUnderlyingTokenInfo();
    if (!address || address == '0x0') {
      return [
        DummyStrategyActionHook([this.asset]),
        // DummyStrategyActionHook([lstUnderlying]),
      ];
    }

    if (amount.isZero()) {
      return [
        buildStrategyActionHook([], [this.asset]),
        // buildStrategyActionHook([], [lstUnderlying]),
      ];
    }

    // compute calls of direct LST deposit
    const amt = Web3Number.fromWei(amount.toString(), amount.decimals);
    const calls = await this.universalStrategy.depositCall(
      {
        tokenInfo: this.universalStrategy.asset(),
        amount: amt,
      },
      ContractAddr.from(address),
    );

    // let swapCalls: BuildSwapTransaction | null = null;
    // try {
    //   const avnuWrapper = new AvnuWrapper();
    //   const quotes = await fetchQuotes({
    //     sellTokenAddress: lstUnderlying.address.address,
    //     buyTokenAddress: this.universalStrategy.asset().address.address,
    //     sellAmount: BigInt(amt.toWei()),
    //     takerAddress: address,
    //   });

    //   if (quotes.length == 0) {
    //     return [buildStrategyActionHook(calls, [this.asset])];
    //   }
    //   swapCalls = await fetchBuildExecuteTransaction(
    //     quotes[0].quoteId,
    //     address,
    //     0.01,
    //     true,
    //   );
    // } catch (error) {
    //   console.error('Error fetching quotes', error);
    //   return [buildStrategyActionHook(calls, [this.asset])];
    // }

    return [
      buildStrategyActionHook(calls, [this.asset]),
      // buildStrategyActionHook([...swapCalls.calls, ...calls], [lstUnderlying]),
    ];
  };
}
