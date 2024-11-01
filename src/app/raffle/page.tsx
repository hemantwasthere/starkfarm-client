import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

import ActiveDeposits from './_components/active-deposits';
import RegisterRaffle from './_components/register-raffle';
import ShareOnX from './_components/share-on-x';

const Raffle: NextPage = () => {
  return (
    <div className="px-5 w-full max-w-[1350px] mx-auto pb-5">
      <div className="flex w-full items-center justify-between mt-12 bg-gradient-to-r from-[#6F4FF2] to-[#E86277] rounded-md px-8 py-2">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-[#FFFFFF] text-5xl font-bold">Devcon raffle</h1>
          <p className="text-white text-base">
            Each day, we shall select 3 winners who will receive <br />{' '}
            exclusive merch during Starkspace (Devcon, Bangkok)
          </p>

          <button className="border-white border px-4 py-2.5 rounded-md text-white text-sm font-bold transition-all active:scale-90 mt-3">
            Know More
          </button>
        </div>

        <Image
          src="/raffle-hero.svg"
          width={519}
          height={288}
          alt="Raffle Hero Image"
        />
      </div>

      <div className="mt-12 rounded-md bg-gradient-to-r from-[#2f285c] to-[#2b5d4a] p-0.5">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#181d29] to-[#172428] h-full rounded-md px-6 py-3">
          <p className="text-[#95F3BD] font-semibold text-xl">
            Earn Raffle tickets for every task and get chances to win
          </p>

          <div className="flex flex-col items-center gap-2 text-white mr-14">
            <p className="text-base text-transparent bg-clip-text font-medium bg-gradient-to-r from-[#61FCAE] to-[#B0F6FF]">
              Raffle end&apos;s in
            </p>
            <div className="flex items-center gap-7">
              <div className="flex flex-col items-center text-white text-2xl font-semibold gap-0">
                18
                <span className="text-[8.1px] text-[#768E7A] leading-[8.1px]">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center text-white text-2xl font-semibold gap-0">
                18
                <span className="text-[8.1px] text-[#768E7A] leading-[8.1px]">
                  Hrs
                </span>
              </div>
              <div className="flex flex-col items-center text-white text-2xl font-semibold gap-0">
                05
                <span className="text-[8.1px] text-[#768E7A] leading-[8.1px]">
                  Mins
                </span>
              </div>
              <div className="flex flex-col items-center text-white text-2xl font-semibold gap-0">
                1
                <span className="text-[8.1px] text-[#768E7A] leading-[8.1px]">
                  Sec
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9 rounded-md bg-gradient-to-r from-[#2e265c] to-[#2c5e4b] p-0.5">
        <div className="bg-gradient-to-r from-[#171726] to-[#192428] h-full rounded-md px-5 py-6">
          <h4 className="text-white text-2xl font-bold">Tasks</h4>
          <p className="mt-1 text-white text-lg">
            Participate and
            <span className="text-[#61FCAE] font-semibold">
              {' '}
              get Raffle tickets
            </span>
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <RegisterRaffle />

            <ActiveDeposits />

            <ShareOnX />
          </div>
        </div>
      </div>

      <div className="mt-9">
        <h5 className="text-white text-xl font-bold mb-0.5">Rules:</h5>
        <p className="ml-2 text-white text-base">
          1. 3 unique winners will be selected each day
        </p>
        <p className="ml-2 text-white text-base">
          2. You just have to register once and you will be part of each round
          automatically
        </p>
        <p className="ml-2 text-white text-base">
          3. You have to register if you want to participate. This mean you or
          anyone on your behalf will be available t to collect the merch.{' '}
        </p>
        <p className="ml-2 text-white text-base">
          4. The rewards will be in the form of exclusive merch reserved for you
        </p>
        <p className="ml-2 text-white text-base">
          5. Selected winners can collect their merch on 13th Nov, from The Fig
          lobby, Bangkok
        </p>
        <p className="ml-2 text-white text-base">
          6. Winners will be announced on our socials everyday
        </p>
      </div>
    </div>
  );
};

export default Raffle;
