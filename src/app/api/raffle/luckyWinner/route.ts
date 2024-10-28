import { db } from '@/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET() {
  try {
    // Fetch all raffle participants
    const raffleParticipants = await db.raffle.findMany({
      where: {
        OR: [
          { isRaffleParticipant: true },
          { sharedOnX: true },
          { activeDeposits: true },
        ],
      },
    });

    if (raffleParticipants.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No raffle participants found',
      });
    }

    // Group participants by ticket count
    const threeTicketParticipants: any = [];
    const twoTicketParticipants: any = [];
    const oneTicketParticipants: any = [];

    raffleParticipants.forEach((participant) => {
      let ticketCount = 0;

      if (participant.isRaffleParticipant) ticketCount += 1;
      if (participant.sharedOnX) ticketCount += 1;
      if (participant.activeDeposits) ticketCount += 1;

      // Add the participant to the corresponding group based on their ticket count
      if (ticketCount === 3) {
        threeTicketParticipants.push(participant);
      } else if (ticketCount === 2) {
        twoTicketParticipants.push(participant);
      } else if (ticketCount === 1) {
        oneTicketParticipants.push(participant);
      }
    });

    let selectedParticipant;
    let foundValidParticipant = false;

    // Attempt to select a valid participant, prioritizing higher ticket groups
    const groups = [
      threeTicketParticipants,
      twoTicketParticipants,
      oneTicketParticipants,
    ];

    for (const group of groups) {
      if (group.length === 0) {
        continue; // Move to the next group if the current one is empty
      }

      // Keep searching within the current group until a valid participant is found
      while (!foundValidParticipant && group.length > 0) {
        // Randomly select a participant from the current group
        const randomIndex = Math.floor(Math.random() * group.length);
        selectedParticipant = group[randomIndex];

        // Check if the selected participant is already a lucky winner
        const existingWinner = await db.luckyWinner.findFirst({
          where: {
            raffleId: selectedParticipant.raffleId,
          },
        });

        // If not already a winner, break the loop
        if (!existingWinner) {
          foundValidParticipant = true;
          break;
        } else {
          // If the selected participant is already a winner, remove them from the group
          group.splice(randomIndex, 1);
        }
      }

      // If a valid participant has been found, exit the loop
      if (foundValidParticipant) {
        break;
      }
    }

    // If no valid participant was found after checking all groups
    if (!foundValidParticipant) {
      return NextResponse.json({
        success: false,
        message: 'No eligible raffle participants found',
      });
    }

    // Add the selected user to the LuckyWinner table
    const newLuckyWinner = await db.luckyWinner.create({
      data: {
        userId: selectedParticipant.userId,
        raffleId: selectedParticipant.raffleId,
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
