'use client';

import { Spinner } from '@chakra-ui/react';
import { useAccount } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';

const ShareOnX = () => {
  const { address } = useAccount();

  const [loading, setLoading] = React.useState(false);
  const [isSharedOnX, setIsSharedOnX] = React.useState(false);

  const handleShare = async () => {
    setLoading(true);

    try {
      const res = await axios.post('/api/raffle/sharedOnX', {
        address,
      });

      if (res?.data?.success) {
        await new Promise((resolve) => setTimeout(resolve, 8000));
        setIsSharedOnX(true);
        toast.success('Shared !');
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

    (async () => {
      try {
        const res = await axios.get(`/api/raffle/getUser/${address}`);

        if (res?.data?.success && res?.data?.user?.sharedOnX) {
          setIsSharedOnX(true);
        } else setIsSharedOnX(false);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    })();
  }, [address]);

  return (
    <div className="rounded-md bg-gradient-to-r from-[#322663] to-[#306652] p-0.5">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#1c1b32] to-[#1e3031] h-full rounded-md px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/strkfarm-white.svg"
            width={64}
            height={64}
            alt="STRKFarm"
          />
          <p className="text-[#61FCAE] text-xl font-medium">Share on X</p>
        </div>

        <Link
          href="https://hemant.lol"
          target="_blank"
          className="border border-[#36E780] text-white px-4 py-1 text-sm font-bold rounded-[20px] transition-all active:scale-90"
          onClick={!isSharedOnX ? handleShare : () => {}}
        >
          {loading && !isSharedOnX && (
            <Spinner color="#61FCAE" mr={2} size="xs" />
          )}
          {isSharedOnX ? 'Shared !' : 'Share'}
        </Link>
      </div>
    </div>
  );
};

export default ShareOnX;
