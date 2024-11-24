import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';

import fetchWithRetry from '@/utils/fetchWithRetry';

import { IDapp } from './IDapp.store';
import { PoolInfo } from './pools';

interface PoolData {
  tvl: number;
  apr: {
    percentage: number;
    apr_cl: number;
    apr: number;
    incentive_apr: number;
  };
}

interface IndexedPoolData {
  [key: string]: PoolData[];
}

export class Endur extends IDapp<IndexedPoolData> {
  name = 'Endur';
  link = 'https://endur.fi';
  logo = 'https://endur.fi/favicon.ico';
  incentiveDataKey: string = 'Endur';
}

export const endur = new Endur();

const EndurAtoms = {
  endurStats: atomWithQuery((_get) => ({
    queryKey: ['Endur_APY'],
    queryFn: async ({ queryKey: _ }) => {
      const url = 'https://testnet.endur.fi/api/stats';
      const response = await fetchWithRetry(url);

      if (!response) return null;

      const data = await response.json();

      return data;
    },
  })),
  pools: atom((_get) => {
    const empty: PoolInfo[] = [];
    return empty;
  }),
};

export default EndurAtoms;
