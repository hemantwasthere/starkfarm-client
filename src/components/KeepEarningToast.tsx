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
            maxW="400px"
            backdropFilter="blur(10px)"
            style={{
              background:
                'linear-gradient(81.81deg, #9069F0 -90.44%, #212121 61.87%)',
            }}
          >
            <Flex align="center" gap={4}>
              <Image
                src={stackedCoinsLogo.src}
                width={20}
                height={20}
                alt="Stacked coins"
              />
              <Box flex={1}>
                <Text fontSize="18px" fontWeight="bold" color="white" mb={1}>
                  Smart move!
                </Text>
                <Text fontSize="14px" color="#4ADE80" fontWeight="500">
                  Your yield is compounding safely.
                </Text>
              </Box>
              <IconButton
                aria-label="Close"
                icon={
                  <Image
                    src={closeButtonLogo.src}
                    width={4}
                    height={4}
                    alt="Close"
                  />
                }
                size="sm"
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
