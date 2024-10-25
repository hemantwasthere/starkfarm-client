/*
  Warnings:

  - You are about to drop the column `isRaffleParticipant` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN     "activeDeposits" BOOLEAN DEFAULT false,
ADD COLUMN     "isRaffleParticipant" BOOLEAN DEFAULT false,
ADD COLUMN     "sharedOnX" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isRaffleParticipant";
