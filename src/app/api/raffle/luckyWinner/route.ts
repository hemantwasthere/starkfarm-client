import { NextResponse } from 'next/server';

import { db } from '@/db';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET() {
  try {
    const raffleParticipantsCount = await db.raffle.count({
      where: {
        isRaffleParticipant: true,
        sharedOnX: true,
        activeDeposits: true,
      },
    });

    if (raffleParticipantsCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'No raffle participants found',
      });
    }

    let randomRaffleParticipant;
    let foundValidParticipant = false;

    // Keep searching until a valid participant is found
    while (!foundValidParticipant) {
      // Select a random raffle participant
      randomRaffleParticipant = await db.raffle.findFirst({
        where: {
          isRaffleParticipant: true,
          sharedOnX: true,
          activeDeposits: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
        skip: Math.floor(Math.random() * raffleParticipantsCount),
      });

      if (!randomRaffleParticipant) {
        return NextResponse.json({
          success: false,
          message: 'No raffle participants found',
        });
      }

      // Check if the selected participant is already a lucky winner
      const existingWinner = await db.luckyWinner.findUnique({
        where: {
          winnerAddress: randomRaffleParticipant.raffleAddress,
        },
      });

      // If not already a winner, break the loop
      if (!existingWinner) {
        foundValidParticipant = true;
      }
    }

    if (!randomRaffleParticipant) {
      return NextResponse.json({
        success: false,
        message: 'No raffle participants found',
      });
    }

    // Add the selected user to the LuckyWinner table
    const newLuckyWinner = await db.luckyWinner.create({
      data: {
        winnerAddress: randomRaffleParticipant.raffleAddress,
        userId: randomRaffleParticipant.userId,
        raffleId: randomRaffleParticipant.raffleId,
      },
    });

    console.log(newLuckyWinner);

    return NextResponse.json({
      success: true,
      message: 'Lucky winner selected successfully',
      luckyWinner: newLuckyWinner,
    });
  } catch (error) {
    console.error('Error selecting a lucky winner:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while selecting a lucky winner',
    });
  }
}
