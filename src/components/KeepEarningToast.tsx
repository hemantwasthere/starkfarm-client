'use client';

import React from 'react';
import { Box, Flex, Image, Text, useToast, IconButton } from '@chakra-ui/react';
import stackedCoinsLogo from '@/assets/stacked-coins.svg';
import closeButtonLogo from '@/assets/close-button.svg';

interface KeepEarningToastProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeepEarningToast({
  isOpen,
  onClose,
}: KeepEarningToastProps) {
  const toast = useToast();

  React.useEffect(() => {
    if (isOpen) {
      toast({
        position: 'bottom-right',
        duration: 4000,
        isClosable: true,
        render: ({ onClose }) => (
          <Box
            borderRadius="12px"
            padding={'16px'}
            maxW="1000px"
            backdropFilter="blur(10px)"
            style={{
              background:
                'linear-gradient(81.81deg, #9069F0 -90.44%, #212121 61.87%)',
            }}
          >
            <Flex align="center" justify="space-between" gap="16px">
              <Flex align="center" gap="8px">
                <Image
                  src={stackedCoinsLogo.src}
                  width={{ base: 12, md: 20 }}
                  height={{ base: 12, md: 20 }}
                  alt="Stacked coins"
                />
                <Box flex={1}>
                  <Text
                    fontSize={{ base: '14px', md: '18px' }}
                    fontWeight="bold"
                    color="white"
                    mb={1}
                  >
                    Smart move!
                  </Text>
                  <Text
                    fontSize={{ base: '8px', md: '14px' }}
                    color="#4ADE80"
                    fontWeight="500"
                  >
                    Your yield is compounding safely.
                  </Text>
                </Box>
              </Flex>

              <IconButton
                aria-label="Close"
                icon={
                  <Image
                    src={closeButtonLogo.src}
                    width={4}
                    height={4}
                    padding={0}
                    alt="Close"
                  />
                }
                size={{ base: 'sm', md: 'md' }}
                padding={0}
                variant="ghost"
                onClick={onClose}
                _hover={{ bg: 'transparent' }}
              />
            </Flex>
          </Box>
        ),
      });
      onClose();
    }
  }, [isOpen, toast, onClose]);

  return null;
}
