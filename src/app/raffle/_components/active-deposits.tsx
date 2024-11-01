'use client';

import { Spinner } from '@chakra-ui/react';
import { useAccount } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

const ActiveDeposits = () => {
  const { address } = useAccount();

  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);
  const [isActiveDeposits, setIsActiveDeposits] = React.useState(false);

  const handleActiveDeposits = async () => {
    setLoading(true);

    try {
      const res = await axios.post('/api/raffle', {
        address,
        type: 'ACTIVE_DEPOSITS',
      });

      if (res?.data?.success) {
        setIsActiveDeposits(true);
        toast.success('Successfully completed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!address) return;
    setInitialLoading(true);

    (async () => {
      try {
        const res = await axios.get(`/api/tnc/getUser/${address}`, {
          params: { type: 'RAFFLE' },
        });

        if (res?.data?.success && res?.data?.user?.activeDeposits) {
          setIsActiveDeposits(true);
        } else setIsActiveDeposits(false);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [address]);

  return (
    <div className="rounded-md bg-gradient-to-r from-[#322663] to-[#306652] p-0.5">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#1c1b32] to-[#1e3031] h-full rounded-md px-4 hover:from-[#60fcad] transition-all  hover:to-[#60fcad] group">
        <div className="flex items-center gap-3">
          <Image
            src="/strkfarm-white.svg"
            width={64}
            height={64}
            alt="STRKFarm"
          />
          <p className="text-[#61FCAE] group-hover:text-black text-xl font-medium">
            Claim your ticket if you have a active deposit
          </p>
        </div>

        <button
          className="border border-[#36E780] group-hover:border-black group-hover:text-black text-white px-4 py-1 text-sm font-bold rounded-[20px] transition-all active:scale-90"
          onClick={
            !isActiveDeposits && !initialLoading
              ? handleActiveDeposits
              : () => {}
          }
        >
          {loading && !isActiveDeposits && (
            <Spinner color="#61FCAE" mr={2} size="xs" />
          )}
          {initialLoading && 'loading...'}
          {isActiveDeposits && 'completed'}
          {!isActiveDeposits && !initialLoading && '1 ticket'}
        </button>
      </div>
    </div>
  );
};

export default ActiveDeposits;
