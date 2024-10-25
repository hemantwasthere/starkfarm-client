import { NextResponse } from 'next/server';

import { db } from '@/db';

export async function POST() {
  try {
    // Select a random raffle participant
    const randomRaffleParticipant = await db.raffle.findFirst({
      where: {
        isRaffleParticipant: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 1,
      skip: Math.floor(
        Math.random() *
          (await db.raffle.count({
            where: {
              isRaffleParticipant: true,
            },
          })),
      ),
    });

    if (!randomRaffleParticipant) {
      return NextResponse.json({
        success: false,
        message: 'No raffle participants found',
      });
    }

    // Check if the user has already been added to the LuckyWinner table
    const existingWinner = await db.luckyWinner.findUnique({
      where: {
        winnerAddress: randomRaffleParticipant.raffleAddress,
      },
    });

    if (existingWinner) {
      return NextResponse.json({
        success: false,
        message: 'User is already a lucky winner',
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

    console.log(newLuckyWinner, 'newLuckyWinner------------');

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
