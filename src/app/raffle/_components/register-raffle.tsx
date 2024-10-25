'use client';

import { Spinner } from '@chakra-ui/react';
import { useAccount } from '@starknet-react/core';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';

const RegisterRaffle: React.FC = () => {
  const { address } = useAccount();
  const [isUserRegistered, setIsUserRegistered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    setLoading(true);

    if (isUserRegistered) return;

    try {
      const res = await axios.post('/api/raffle/registerUser', {
        address,
      });
      if (res?.data?.success) {
        setIsUserRegistered(true);
        toast.success('Successfully registered for the raffle!');
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

    (async () => {
      try {
        const res = await axios.get(`/api/raffle/getUser/${address}`);

        if (res?.data?.success && res?.data?.user?.isRaffleParticipant) {
          setIsUserRegistered(true);
        } else setIsUserRegistered(false);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    })();
  }, [address]);

  return isUserRegistered ? (
    <button
      disabled={isUserRegistered}
      className="bg-gradient-to-r from-[#6F4FF2] to-[#61FCAE] rounded-md p-px group active:scale-90 transition-all cursor-not-allowed"
    >
      <p className="px-4 bg-[#111119] h-10 rounded-md flex items-center justify-center">
        <span className="bg-gradient-to-r from-[#6F4FF2] to-[#61FCAE] bg-clip-text text-transparent text-sm font-bold">
          Registered !
        </span>
      </p>
    </button>
  ) : (
    <button
      onClick={handleRegister}
      className="bg-gradient-to-r from-[#6F4FF2] to-[#61FCAE] rounded-md p-px group active:scale-90 transition-all"
    >
      <p className="px-4 bg-[#111119] h-10 rounded-md flex items-center justify-center">
        <span className="bg-gradient-to-r from-[#6F4FF2] to-[#61FCAE] bg-clip-text text-transparent text-sm font-bold">
          {loading && <Spinner color="#61FCAE" mr={2} size="xs" />}
          Register
        </span>
      </p>
    </button>
  );
};

export default RegisterRaffle;
