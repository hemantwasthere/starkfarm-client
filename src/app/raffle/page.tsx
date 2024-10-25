import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

import RegisterRaffle from './_components/register-raffle';
import ShareOnX from './_components/share-on-x';

const Raffle: NextPage = () => {
  return (
    <div className="px-5 w-full max-w-[1350px] mx-auto pb-5">
      <div className="flex w-full items-center justify-between mt-12">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-[#FFFFFF] text-5xl font-semibold">
            8 Pool Raffle
          </h1>
          <p className="text-white text-base">
            Each week, we select 8 lucky addresses from Starknet&apos;s pool{' '}
            <br /> of active addresses from the previous week.{' '}
          </p>

          <RegisterRaffle />
        </div>

        <Image
          src="/raffle-hero.svg"
          width={385}
          height={247}
          alt="Raffle Hero Image"
        />
      </div>

      <div className="mt-12 rounded-md bg-gradient-to-r from-[#2f285c] to-[#2b5d4a] p-0.5">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#181d29] to-[#172428] h-full rounded-md px-6 py-3">
          <div className="flex items-center gap-3">
            <p className="text-[#95F3BD] font-semibold text-xl">Pool Size</p>

            <div className="rounded-full bg-gradient-to-r from-[#2f285c] to-[#2b5d4a] h-[48px] p-[3px] cursor-pointer transition-all active:scale-90 hover:opacity-90 select-none">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#181d29] to-[#172428] h-full rounded-full text-white font-bold px-5">
                500 STRK
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-white mr-8">
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
            Earn
            <span className="text-[#61FCAE] font-semibold">
              {' '}
              10 tickets each week{' '}
            </span>
            by staying active on STRKFarm and increase your changes
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <ShareOnX />

            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-md bg-gradient-to-r from-[#322663] to-[#306652] p-0.5"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-[#1c1b32] to-[#1e3031] h-full rounded-md px-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/strkfarm-white.svg"
                      width={64}
                      height={64}
                      alt="STRKFarm"
                    />
                    <p className="text-[#61FCAE] text-xl font-medium">
                      Any transaction on Starknet
                    </p>
                  </div>

                  <button className="border border-[#36E780] text-white px-4 py-1 text-sm font-bold rounded-[20px] transition-all active:scale-90">
                    2 ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9">
        <h5 className="text-white text-xl font-bold mb-0.5">Rules:</h5>
        <p className="ml-2 text-white text-base">
          1. You have upto 1 week to claim your rewards. Any unclaimed reward
          will be added to next pool prize.
        </p>
        <p className="ml-2 text-white text-base">
          2. Only account contracts are considered for this raffle
        </p>
      </div>
    </div>
  );
};

export default Raffle;
