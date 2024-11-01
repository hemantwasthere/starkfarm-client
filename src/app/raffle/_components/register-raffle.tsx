'use client';

import { Spinner } from '@chakra-ui/react';
import { useAccount } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

const RegisterRaffle: React.FC = () => {
  const { address } = useAccount();

  const [isUserRegistered, setIsUserRegistered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);

  const handleRegister = async () => {
    setLoading(true);

    if (isUserRegistered) return;

    try {
      const res = await axios.post('/api/raffle', {
        address,
        type: 'REGISTER',
      });
      if (res?.data?.success) {
        setIsUserRegistered(true);
        toast.success('Successfully completed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (!address) return;

    setInitialLoading(true);

    (async () => {
      try {
        const res = await axios.get(`/api/tnc/getUser/${address}`, {
          params: { type: 'RAFFLE' },
        });

        if (res?.data?.success && res?.data?.user?.isRaffleParticipant) {
          setIsUserRegistered(true);
        } else setIsUserRegistered(false);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [address]);

  return isUserRegistered ? (
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
            Register on our website if you are coming to Devcon and get one
            ticket.
          </p>
        </div>

        <button className="border border-[#36E780] text-white group-hover:border-black group-hover:text-black px-4 py-1 text-sm font-bold rounded-[20px] transition-all active:scale-90">
          completed
        </button>
      </div>
    </div>
  ) : (
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
            Register on our website if you are coming to Devcon and get one
            ticket.
          </p>
        </div>

        <button
          onClick={
            !isUserRegistered && !initialLoading ? handleRegister : () => {}
          }
          className="border border-[#36E780] text-white group-hover:border-black group-hover:text-black px-4 py-1 text-sm font-bold rounded-[20px] transition-all active:scale-90"
        >
          {loading && <Spinner color="#61FCAE" mr={2} size="xs" />}
          {initialLoading && 'loading...'}
          {isUserRegistered && 'completed'}
          {!isUserRegistered && !initialLoading && '1 ticket'}
        </button>
      </div>
    </div>
  );
};

export default RegisterRaffle;
