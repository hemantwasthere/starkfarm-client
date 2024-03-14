'use client'

import * as React from 'react';

import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  useNetwork,
  useAccount,
  useConnect,
  nethermindProvider,
  jsonRpcProvider,
} from "@starknet-react/core";
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  extendTheme,
  Flex,
  Icon,
  HStack,
  Center,
  Box,
  Container,
} from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import * as LogoSvg from '@public/logo.svg';
import * as HomeSvg from '@public/home.svg';
import * as PlaySvg from '@public/play.svg';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { RpcProvider, RpcProviderOptions, constants } from 'starknet';

const theme = extendTheme({
  colors: {
    transparent: 'rgba(0, 0, 0, 0)',
    opacity_50p: 'rgba(0, 0, 0, 0.5)',
    color1: 'rgba(86, 118, 254, 1)',
    color1_50p: 'rgba(86, 118, 254, 0.5)',
    color2: 'rgba(104, 51, 205, 1)',
    color2_50p: 'rgba(104, 51, 205, 0.5)',
    highlight: '#272932', // light grey
    light_grey: '#9d9d9d',
    purple: '#6F4FF2',
    cyan: '#22F3DF',
    bg: '#1A1C26', // dark blue
  },
  fontSizes: {
    large: '50px'
  },
  space: {
    large: '50px'
  },
  sizes: {
    prose: '100%'
  },
  components: {
    Button: {
      variants: {
        purple: {
          bg: 'purple',
          color: 'white'
        },
        _disabled: {
          color: 'light_grey',
        },
        _hover: {
          bg: 'light_grey', // slightly darket purple
        }
      }
    }
  },
  fonts: {
    heading: `'Courier New', Courier, monospace`,
    body: `'Courier New', Courier, monospace`,
  },
})

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

export default function Template({ children }: { children: React.ReactNode }) {
    const chains = [sepolia];
    const provider = jsonRpcProvider({
      rpc: (chain) => {
        let args: RpcProviderOptions = {nodeUrl: 'http://localhost:3000/rpc-api', chainId: constants.StarknetChainId.SN_SEPOLIA };
        return args;
      }
    });
    const { connectors } = useInjectedConnectors({
      // Show these connectors if the user has no connector installed.
      recommended: [
        braavos(),
        argent(),
      ],
      // Hide recommended connectors if the user has any connector installed.
      includeRecommended: "onlyIfNoConnectors",
      // Randomize the order of the connectors.
      order: "random"
    });

    function getIconNode(icon: typeof import("*.svg"), alt: string) {
      return <Center className='my-menu-button' width='100%' marginLeft={'-20px'}><Image src={icon} alt={alt}/></Center>
    }

    return <JotaiProvider>
      <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
        <ChakraBaseProvider theme={theme}>
          <Flex minHeight={'100vh'} bgColor={'bg'}>
            {/* <Sidebar collapsed={true} backgroundColor='var(--chakra-colors-highlight)' style={{"border": '0px'}} collapsedWidth={'150px'}>
              <Center width='100%' marginTop='20px'><Image src={LogoSvg} alt='Logo' height={'50px'}/></Center>
              <Menu style={{"marginTop": '100px', "backgroundColor": '#eecef9'}}
              >
                <MenuItem>
                  <Box>{getIconNode(HomeSvg, 'home')}</Box>
                </MenuItem>
                <MenuItem active={true}>
                  <Box>{getIconNode(PlaySvg, 'play')}</Box>
                </MenuItem>
                <MenuItem>
                  <Box>{getIconNode(HomeSvg, 'home')}</Box>
                </MenuItem>
              </Menu>
            </Sidebar>
           */}
            <Container  width={'100%'}>
              <Navbar></Navbar>
              {children}
            </Container>
          </Flex>
        </ChakraBaseProvider>
      </StarknetConfig>
    </JotaiProvider>
}