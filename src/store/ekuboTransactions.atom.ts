import { atomWithQuery } from 'jotai-tanstack-query';
import { gql } from '@apollo/client';
import ekuboApolloClient from '@/utils/ekuboApolloClient';
import { standariseAddress } from '@/utils';

export interface EkuboVaultFlow {
  type: string;
  txHash: string;
  block_number: number;
  txIndex: number;
  eventIndex: number;
  token0: string;
  token1: string;
  amount0: string;
  amount1: string;
  liquidity_delta: string;
  timestamp: number;
}

export interface EkuboTxHistory {
  ekuboVaultFlows: EkuboVaultFlow[];
}

export interface EkuboTransaction {
  amount: string;
  timestamp: number;
  type: string;
  txHash: string;
  asset: string;
  block_number: number;
  txIndex: number;
  eventIndex: number;
  __typename: 'Investment_flows';
  // Additional fields for Ekubo
  token0?: string;
  token1?: string;
  amount0?: string;
  amount1?: string;
  liquidity_delta?: string;
}

async function getEkuboTxHistory(
  vaultContract: string,
  userAddress: string,
): Promise<{ findManyInvestment_flows: EkuboTransaction[] }> {
  try {
    const vaultContractFormatted = standariseAddress(vaultContract);
    const userAddressFormatted = standariseAddress(userAddress);

    const { data } = await ekuboApolloClient.query({
      query: gql`
        query ContractFeeEarnings(
          $timeframe: String!
          $contract: String!
          $userAddress: String!
          $vaultContract: String!
        ) {
          contractFeeEarnings(timeframe: $timeframe, contract: $contract) {
            contract
            dailyEarnings {
              date
              tokenAddress
              amount
            }
            totalCollections
          }
          ekuboVaultFlows(
            user_address: $userAddress
            vault_contract: $vaultContract
          ) {
            type
            txHash
            block_number
            txIndex
            eventIndex
            token0
            token1
            amount0
            amount1
            liquidity_delta
            timestamp
          }
        }
      `,
      variables: {
        timeframe: '7d',
        contract: vaultContractFormatted,
        userAddress: userAddressFormatted,
        vaultContract: vaultContractFormatted,
      },
      fetchPolicy: 'no-cache',
    });

    // Transform Ekubo vault flows to match the expected transaction format
    const transformedTransactions: EkuboTransaction[] =
      data.ekuboVaultFlows.map((flow: EkuboVaultFlow) => {
        // Determine the primary token and amount based on the flow type
        // For deposits, we show the total value in STRK terms
        // For withdrawals, we show the total value in STRK terms
        const primaryToken = flow.token0; // Assuming token0 is the primary token (STRK)
        const primaryAmount = flow.amount0;

        return {
          amount: primaryAmount, // Use primary token amount
          timestamp: flow.timestamp,
          type: flow.type,
          txHash: flow.txHash,
          asset: primaryToken,
          block_number: flow.block_number,
          txIndex: flow.txIndex,
          eventIndex: flow.eventIndex,
          __typename: 'Investment_flows',
          // Store additional Ekubo-specific data
          token0: flow.token0,
          token1: flow.token1,
          amount0: flow.amount0,
          amount1: flow.amount1,
          liquidity_delta: flow.liquidity_delta,
        };
      });

    // Sort by timestamp (newest first)
    transformedTransactions.sort((a, b) => b.timestamp - a.timestamp);

    return { findManyInvestment_flows: transformedTransactions };
  } catch (error) {
    console.error('Ekubo GraphQL Error:', error);
    throw error;
  }
}

export const EkuboTxHistoryAtom = (
  vaultContract: string,
  userAddress: string,
) =>
  atomWithQuery((get) => ({
    queryKey: ['ekubo_tx_history', vaultContract, userAddress],
    queryFn: async (): Promise<{
      findManyInvestment_flows: EkuboTransaction[];
    }> => {
      const res = await getEkuboTxHistory(vaultContract, userAddress);
      console.log('EkuboTxHistoryAtom res', res, {
        vaultContract,
        userAddress,
      });
      return res;
    },
  }));

// Helper function to calculate net earnings in STRK terms
export function calculateNetEarnings(transactions: EkuboTransaction[]): number {
  if (!transactions.length) return 0;

  let netDeposits = 0;
  let netWithdrawals = 0;

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount);
    if (tx.type === 'deposit') {
      netDeposits += amount;
    } else if (tx.type === 'withdraw') {
      netWithdrawals += amount;
    }
  });

  // Net earnings = total withdrawals - total deposits
  // Positive means profit, negative means loss
  return netWithdrawals - netDeposits;
}
