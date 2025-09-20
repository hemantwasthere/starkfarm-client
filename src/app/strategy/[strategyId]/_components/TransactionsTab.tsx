import {
  Avatar,
  Box,
  Flex,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAccount } from '@starknet-react/core';

import {
  capitalize,
  getTokenInfoFromAddr,
  shortAddress,
  timeAgo,
} from '@/utils';
import MyNumber from '@/utils/MyNumber';
import { StrategyInfo } from '@/store/strategies.atoms';
import CONSTANTS from '@/constants';

interface ITransaction {
  amount: string;
  timestamp: number;
  type: string;
  tx_hash: string;
  asset: string;
  __typename: 'Investment_flows';
  // Additional fields for Ekubo transactions
  token0?: string;
  token1?: string;
  amount0?: string;
  amount1?: string;
  liquidity_delta?: string;
}
interface TransactionsTabProps {
  strategy: StrategyInfo<any>;
  // txHistoryResult: AtomWithQueryResult<TxHistory, Error>;
  txHistory: {
    findManyInvestment_flows: ITransaction[];
  };
  isMobile?: boolean;
}

function getTransactionIcon(type: string) {
  if (type == 'deposit') {
    return (
      <Flex alignItems={'center'} gap={'8px'}>
        <Box
          bg={'light_green'}
          padding={'4px'}
          borderRadius={'50%'}
          width={'24px'}
          height={'24px'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <ArrowDownIcon color={'black'} />
        </Box>
        <Text>{capitalize(type)}</Text>
      </Flex>
    );
  }

  const bgColor = type == 'withdraw' || type == 'claim' ? 'red_2' : 'yellow_2';
  let text = 'Withdrawn';
  if (type == 'redeem') {
    text = 'Withdraw in progress';
  } else if (type == 'claim' || type == 'withdraw') {
    text = 'Withdrawn';
  } else {
    throw new Error(`Unknown transaction type: ${type}`);
  }
  return (
    <Flex alignItems={'center'} gap={'8px'}>
      <Box
        bg={bgColor}
        padding={'4px'}
        borderRadius={'50%'}
        width={'24px'}
        height={'24px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <ArrowUpIcon color={'black'} />
      </Box>
      <Text>{text}</Text>
    </Flex>
  );
}

function DesktopTransactionHistory(props: { transactions: ITransaction[] }) {
  const { transactions } = props;
  return (
    transactions.length !== 0 && (
      <>
        <TableContainer width={'100%'}>
          <Table
            variant="simple"
            sx={{
              overflow: 'hidden',
              'border-collapse': 'separate',
              'border-spacing': '0px 3px',
            }}
          >
            <Thead
              display={{ base: 'none', md: 'table-header-group' }}
              bg={'mycard_light'}
            >
              <Tr>
                <Th
                  width={'50px'}
                  color={'white'}
                  fontSize={'14px'}
                  fontWeight={'600'}
                  textTransform={'capitalize'}
                  borderTopLeftRadius={'lg'}
                >
                  #
                </Th>
                <Th
                  color={'white'}
                  fontSize={'14px'}
                  fontWeight={'600'}
                  textTransform={'capitalize'}
                >
                  Amount
                </Th>
                <Th
                  color={'white'}
                  fontSize={'14px'}
                  fontWeight={'600'}
                  textTransform={'capitalize'}
                >
                  Transaction type
                </Th>
                <Th
                  color={'white'}
                  fontSize={'14px'}
                  fontWeight={'600'}
                  textTransform={'capitalize'}
                >
                  Transaction hash
                </Th>
                <Th
                  color={'white'}
                  fontSize={'14px'}
                  fontWeight={'600'}
                  textTransform={'capitalize'}
                  borderTopRightRadius={'lg'}
                >
                  Time
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((tx, index) => {
                const token = getTokenInfoFromAddr(tx.asset);
                const decimals = token?.decimals;

                return (
                  <Tr key={index} border={'none'} bg={'mycard_dark'}>
                    <Td color={'text_secondary'} fontSize={'14px'}>
                      {index + 1}.
                    </Td>
                    <Td color={'text_secondary'} fontSize={'14px'}>
                      <Flex alignItems="center" gap={2} flexWrap="wrap">
                        <Flex alignItems="center" gap={1}>
                          <Avatar
                            size="xs"
                            src={token?.logo}
                            name={token?.name}
                          />
                          <Text>
                            {Math.abs(
                              Number(
                                new MyNumber(
                                  tx.amount,
                                  decimals!,
                                ).toEtherToFixedDecimals(token.displayDecimals),
                              ),
                            )}{' '}
                            {token?.name}
                          </Text>
                        </Flex>
                        {/* Show additional Ekubo info if available */}
                        {tx.amount1 && tx.token1 && (
                          <Flex alignItems="center" gap={1}>
                            <Avatar
                              size="xs"
                              src={getTokenInfoFromAddr(tx.token1)?.logo}
                              name={getTokenInfoFromAddr(tx.token1)?.name}
                            />
                            <Text fontSize={'12px'} color={'text_secondary'}>
                              {Math.abs(
                                Number(
                                  new MyNumber(
                                    tx.amount1,
                                    getTokenInfoFromAddr(tx.token1).decimals,
                                  ).toEtherToFixedDecimals(
                                    getTokenInfoFromAddr(tx.token1)
                                      .displayDecimals,
                                  ),
                                ),
                              )}{' '}
                              {getTokenInfoFromAddr(tx.token1).name}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    </Td>
                    <Td color={'text_secondary'} fontSize={'14px'}>
                      {getTransactionIcon(tx.type)}
                    </Td>
                    <Td color={'text_secondary'} fontSize={'14px'}>
                      <Text
                        width={'100%'}
                        fontWeight={'600'}
                        color={'text_secondary'}
                      >
                        <Link
                          href={`${CONSTANTS.BLOCK_EXPLORER}/tx/${tx.tx_hash}`}
                          target="_blank"
                        >
                          {shortAddress(tx.tx_hash)} <ExternalLinkIcon />
                        </Link>
                      </Text>
                    </Td>
                    <Td color={'text_secondary'} fontSize={'14px'}>
                      <Text width={'100%'}>
                        {timeAgo(new Date(tx.timestamp * 1000))}
                      </Text>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    )
  );
}

function MobileTransactionHistory(props: { transactions: ITransaction[] }) {
  const { transactions: transactions } = props;

  return (
    <>
      {transactions.map((tx, index) => {
        const token = getTokenInfoFromAddr(tx.asset);
        const decimals = token?.decimals;
        const isDeposit = tx.type === 'deposit';
        let displayText = 'Deposit';
        let iconColor = 'light_green';
        switch (tx.type) {
          case 'deposit':
            displayText = 'Deposited';
            break;
          case 'withdraw':
            displayText = 'Withdrawn';
            iconColor = 'red_2';
            break;
          case 'redeem':
            iconColor = 'yellow_2';
            displayText = 'Withdraw in progress';
            break;
          case 'claim':
            iconColor = 'red_2';
            displayText = 'Withdrawn';
            break;
          default:
            throw new Error(`Unknown transaction type: ${tx.type}`);
        }

        return (
          <Box
            key={index}
            borderRadius="lg"
            bg="bg_2"
            display="flex"
            flexDirection="column"
            gap={1}
            padding={'16px'}
          >
            <Flex alignItems="center" gap={2} mb={1}>
              <Box
                bg={iconColor}
                padding="4px"
                borderRadius="50%"
                width="24px"
                height="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {isDeposit ? (
                  <ArrowDownIcon color={'black'} />
                ) : (
                  <ArrowUpIcon color={'black'} />
                )}
              </Box>
              <Text fontWeight="bold" color={iconColor} fontSize="15px">
                {displayText}
              </Text>
            </Flex>
            <Flex alignItems="center" flexWrap="wrap" gap={1} mb={1}>
              <Text color="white" fontSize="15px">
                Amount:
              </Text>
              <Flex alignItems="center" gap={1}>
                <Avatar size="xs" src={token?.logo} name={token?.name} />
                <Text color="white" fontSize="15px">
                  {Math.abs(
                    Number(
                      new MyNumber(tx.amount, decimals!).toEtherToFixedDecimals(
                        token.displayDecimals,
                      ),
                    ),
                  ).toLocaleString()}{' '}
                  {token?.name}
                </Text>
              </Flex>
              {tx.amount1 && tx.token1 && (
                <Flex alignItems="center" gap={1}>
                  <Avatar
                    size="xs"
                    src={getTokenInfoFromAddr(tx.token1)?.logo}
                    name={getTokenInfoFromAddr(tx.token1)?.name}
                  />
                  <Text fontSize={'13px'} color={'text_secondary'}>
                    {Math.abs(
                      Number(
                        new MyNumber(
                          tx.amount1,
                          getTokenInfoFromAddr(tx.token1)?.decimals,
                        ).toEtherToFixedDecimals(
                          getTokenInfoFromAddr(tx.token1)?.displayDecimals,
                        ),
                      ),
                    ).toLocaleString()}{' '}
                    {getTokenInfoFromAddr(tx.token1)?.name || 'Token'}
                  </Text>
                </Flex>
              )}
            </Flex>
            <Text color="white" fontSize="13px">
              Tx Hash:{' '}
              <Link
                href={`${CONSTANTS.BLOCK_EXPLORER}/tx/${tx.tx_hash}`}
                target="_blank"
                color="color_7"
              >
                {shortAddress(tx.tx_hash)}
              </Link>
            </Text>
            <Text color="text_secondary" fontSize="13px">
              {timeAgo(new Date(tx.timestamp * 1000))}
            </Text>
          </Box>
        );
      })}
    </>
  );
}

export function TransactionsTab(props: TransactionsTabProps) {
  const { address } = useAccount();
  const { strategy, txHistory, isMobile } = props;

  return (
    <Flex flexDirection="column" gap="16px" width="100%" padding={'16px'}>
      <Box>
        <Text fontSize="18px" color="white" fontWeight="600" mb={1}>
          Transaction history
        </Text>
        {!strategy.settings.isTransactionHistDisabled && (
          <Text fontSize="14px" color="border_light" mb={2}>
            There may be delays in fetching data. If your transaction isn&apos;t
            found, try again later.
          </Text>
        )}
      </Box>
      {address ? (
        strategy.settings.isTransactionHistDisabled ? (
          <Text
            fontSize={'14px'}
            textAlign={'center'}
            color="text_secondary"
            marginTop={'20px'}
            padding="16px"
            bg="mycard"
            borderRadius={'lg'}
          >
            Transaction history is not available for this strategy yet. If
            enabled in future, will include the entire history.
          </Text>
        ) : txHistory.findManyInvestment_flows.length !== 0 ? (
          isMobile ? (
            <MobileTransactionHistory
              transactions={txHistory.findManyInvestment_flows}
            />
          ) : (
            <DesktopTransactionHistory
              transactions={txHistory.findManyInvestment_flows}
            />
          )
        ) : (
          <Text fontSize={'14px'} textAlign={'center'} color="text_secondary">
            No transactions found
          </Text>
        )
      ) : (
        <Text
          fontSize={'14px'}
          textAlign={'center'}
          color="text_secondary"
          padding="16px"
          bg="mycard"
          borderRadius={'lg'}
        >
          Connect your wallet to view transaction history
        </Text>
      )}
    </Flex>
  );
}
