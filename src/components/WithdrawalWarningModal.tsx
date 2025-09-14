'use client';

import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import mixpanel from 'mixpanel-browser';
import smileysLogo from '@/assets/smileys.svg';
import endurExtendedLogo from '@/assets/endur-extended.svg';
import btcfiLogo from '@/assets/btc-fi.svg';
import riskYieldLogo from '@/assets/risk-yield.svg';
import KeepEarningToast from './KeepEarningToast';

interface WithdrawalWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueWithdrawal: () => void;
  onKeepEarning: () => void;
  userAddress?: string;
  strategyId?: string;
  withdrawalAmount?: string;
  totalHoldings?: string;
}

export default function WithdrawalWarningModal({
  isOpen,
  onClose,
  onContinueWithdrawal,
  onKeepEarning,
  userAddress,
  strategyId,
  withdrawalAmount,
  totalHoldings,
}: WithdrawalWarningModalProps) {
  const [showToast, setShowToast] = useState(false);

  const handleKeepEarningClick = () => {
    mixpanel.track('Withdrawal Warning Modal - Keep Earning Clicked', {
      userAddress,
      strategyId,
      withdrawalAmount: withdrawalAmount || '0',
      totalHoldings: totalHoldings || '0',
      action: 'keep_earning',
      timestamp: new Date().toISOString(),
    });
    setShowToast(true);
    onKeepEarning();
  };

  const handleWithdrawAnywayClick = () => {
    mixpanel.track('Withdrawal Warning Modal - Withdraw Anyway Clicked', {
      userAddress,
      strategyId,
      withdrawalAmount: withdrawalAmount || '0',
      totalHoldings: totalHoldings || '0',
      action: 'withdraw_anyway',
      timestamp: new Date().toISOString(),
    });
    onContinueWithdrawal();
  };

  return (
    <>
      <KeepEarningToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{ base: 'sm', md: 'lg' }}
      >
        <ModalOverlay bg="#212121B2" backdropFilter="blur(8px)" />
        <ModalContent
          bg="black"
          borderRadius={{ base: '12px', md: '16px' }}
          maxW={{ base: '90vw', md: '500px' }}
          mx={4}
          position="relative"
          padding={{ base: '44px 4px 16px 4px', md: '64px 16px 32px 16px' }}
        >
          <Box
            position="absolute"
            top={{ base: '-60px', md: '-100px' }}
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
          >
            <Flex justify="center" align="center" gap={4}>
              <Image
                src={smileysLogo.src}
                width={{ base: 150, md: 215 }}
                height={{ base: 100, md: 140 }}
                alt="Smileys"
              />
            </Flex>
          </Box>

          <ModalBody>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              <Text
                fontSize={{ base: '20px', md: '24px' }}
                fontWeight="bold"
                color="white"
                textAlign="center"
                lineHeight="1.2"
              >
                Wait! You&apos;re about to miss something big
              </Text>

              <Text
                fontSize={{ base: '10px', md: '14px' }}
                color="#BCBCBC"
                textAlign="center"
                lineHeight="1.5"
              >
                Stop actively managing. Evergreen vaults are designed to
                automatically give you the best yield and there&apos;s a lot
                more coming.
              </Text>

              <VStack spacing={{ base: 3, md: 2 }}>
                <HStack justify="center" spacing={'30px'} width="100%">
                  <Image
                    src={endurExtendedLogo.src}
                    width={{ base: 12, md: 20 }}
                    height={{ base: 12, md: 20 }}
                    alt="Endur and Extended app support"
                  />

                  <Image
                    src={btcfiLogo.src}
                    width={{ base: 12, md: 20 }}
                    height={{ base: 12, md: 20 }}
                    alt="BTCFI incentives"
                  />
                  <Image
                    src={riskYieldLogo.src}
                    width={{ base: 12, md: 20 }}
                    height={{ base: 12, md: 20 }}
                    alt="Risk diversified and best possible yield"
                  />
                </HStack>

                <HStack
                  align="top"
                  justify="center"
                  spacing={{ base: '5px', md: '30px' }}
                  width="100%"
                >
                  <Text
                    fontSize={{ base: '10px', md: '12px' }}
                    color="#B8B8B8"
                    textAlign="center"
                    maxWidth={'90px'}
                  >
                    Endur and Extended app support
                  </Text>
                  <Text
                    fontSize={{ base: '10px', md: '12px' }}
                    color="#B8B8B8"
                    textAlign="center"
                    maxWidth={'90px'}
                  >
                    BTCFI incentives
                  </Text>
                  <Text
                    fontSize={{ base: '10px', md: '12px' }}
                    color="#B8B8B8"
                    textAlign="center"
                    maxWidth={'90px'}
                  >
                    Risk diversified and best possible yield
                  </Text>
                </HStack>
              </VStack>

              <Text
                fontSize={{ base: '12px', md: '12px' }}
                fontWeight="bold"
                color="#F8F8F8"
                textAlign="center"
                lineHeight="1.5"
              >
                Let us do all the work so that you can touch some grass
              </Text>

              <VStack spacing={{ base: 2, md: '20px' }}>
                <Button
                  bg="#9069F0"
                  color="black"
                  size={{ base: 'md', md: 'lg' }}
                  width="100%"
                  height={{ base: '44px', md: '50px' }}
                  fontSize={{ base: '14px', md: '16px' }}
                  fontWeight="bold"
                  borderRadius="8px"
                  _hover={{
                    bg: 'purple.600',
                  }}
                  _active={{
                    bg: 'purple.700',
                  }}
                  onClick={handleKeepEarningClick}
                >
                  Keep earning my yield
                </Button>

                <Button
                  variant="ghost"
                  color="#909090"
                  size="sm"
                  fontSize={{ base: '11px', md: '12px' }}
                  _hover={{
                    bg: 'transparent',
                  }}
                  onClick={handleWithdrawAnywayClick}
                >
                  Withdraw anyway
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
