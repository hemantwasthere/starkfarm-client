import { NextResponse } from 'next/server';

import { db } from '@/db';
import { standariseAddress } from '@/utils';

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({
      success: false,
      message: 'address not found',
      user: null,
    });
  }

  // standardised address
  let parsedAddress = address;
  try {
    parsedAddress = standariseAddress(address);
  } catch (e) {
    throw new Error('Invalid address');
  }

  const user = await db.raffle.findFirst({
    where: {
      raffleAddress: parsedAddress,
    },
  });

  if (!user) {
    return NextResponse.json({
      success: false,
      message: 'User not found',
      user: null,
    });
  }

  const createdUser = await db.raffle.update({
    where: {
      raffleAddress: parsedAddress,
    },
    data: {
      sharedOnX: true,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'User registered for raffle successfully',
    user: createdUser,
  });
}
