'use client';

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import smileysLogo from '@/assets/smileys.svg';
import endurExtendedLogo from '@/assets/endur-extended.svg';
import btcfiLogo from '@/assets/btc-fi.svg';
import riskYieldLogo from '@/assets/risk-yield.svg';

interface WithdrawalWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueWithdrawal: () => void;
  onKeepEarning: () => void;
}

export default function WithdrawalWarningModal({
  isOpen,
  onClose,
  onContinueWithdrawal,
  onKeepEarning,
}: WithdrawalWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="#212121B2" />
      <ModalContent
        bg="black"
        borderRadius="16px"
        maxW="500px"
        mx={4}
        position="relative"
      >
        <Box
          position="absolute"
          top="-100px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={10}
        >
          <Flex justify="center" align="center" gap={4}>
            <Image
              src={smileysLogo.src}
              width={215}
              height={140}
              alt="Smileys"
            />
          </Flex>
        </Box>

        <ModalBody pt={16}>
          <VStack spacing={6} align="stretch">
            <Text
              fontSize="24px"
              fontWeight="bold"
              color="#FFE9B1"
              textAlign="center"
              lineHeight="1.2"
            >
              Wait! You&apos;re about to miss something big
            </Text>

            <Text
              fontSize="16px"
              color="#B8B8B8"
              textAlign="center"
              lineHeight="1.5"
            >
              Stop active managing your funds. Evergreen vaults are designed to
              automatically give you the best yield and there&apos;s a lot more
              coming.
            </Text>

            <VStack spacing={2}>
              <HStack justify="space-around" spacing={2} width="100%">
                <Image
                  src={endurExtendedLogo.src}
                  width={64}
                  height={64}
                  alt="Endur and Extended app support"
                />
                <Image
                  src={btcfiLogo.src}
                  width={64}
                  height={64}
                  alt="BTCFI incentives"
                />
                <Image
                  src={riskYieldLogo.src}
                  width={64}
                  height={64}
                  alt="Risk diversified and best possible yield"
                />
              </HStack>

              <HStack
                align="top"
                justify="space-around"
                spacing={4}
                width="100%"
              >
                <Text
                  fontSize="12px"
                  color="#B8B8B8"
                  textAlign="center"
                  maxWidth="100px"
                >
                  Endur and Extended app support
                </Text>
                <Text
                  fontSize="12px"
                  color="#B8B8B8"
                  textAlign="center"
                  maxWidth="100px"
                >
                  BTCFI incentives
                </Text>
                <Text
                  fontSize="12px"
                  color="#B8B8B8"
                  textAlign="center"
                  maxWidth="100px"
                >
                  Risk diversified and best possible yield
                </Text>
              </HStack>
            </VStack>

            <Text
              fontSize="16px"
              fontWeight="bold"
              color="#F8F8F8"
              textAlign="center"
              lineHeight="1.5"
            >
              Let us do all the work and you should continue to chill
            </Text>

            <VStack spacing={3}>
              <Button
                bg="#9069F0"
                color="black"
                size="lg"
                width="100%"
                height="50px"
                fontSize="16px"
                fontWeight="bold"
                borderRadius="12px"
                _hover={{
                  bg: 'purple.600',
                }}
                _active={{
                  bg: 'purple.700',
                }}
                onClick={onKeepEarning}
              >
                Keep earning my yield
              </Button>

              <Button
                variant="ghost"
                color="#909090"
                size="sm"
                fontSize="12px"
                _hover={{
                  bg: 'transparent',
                }}
                onClick={onContinueWithdrawal}
              >
                Withdraw anyway
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
