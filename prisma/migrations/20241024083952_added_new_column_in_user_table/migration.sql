/*
  Warnings:

  - A unique constraint covering the columns `[userId,refreeAddress]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRaffleParticipant" BOOLEAN DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Signatures" (
    "id" SERIAL NOT NULL,
    "signature" TEXT NOT NULL,
    "tncDocVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "og_nft_users" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "og_nft_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signatures_userId_tncDocVersion_key" ON "Signatures"("userId", "tncDocVersion");

-- CreateIndex
CREATE UNIQUE INDEX "og_nft_users_userId_key" ON "og_nft_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_userId_refreeAddress_key" ON "Referral"("userId", "refreeAddress");

-- AddForeignKey
ALTER TABLE "Signatures" ADD CONSTRAINT "Signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "og_nft_users" ADD CONSTRAINT "og_nft_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
