/*
  Warnings:

  - The primary key for the `Raffle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Raffle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[raffleAddress]` on the table `Raffle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,raffleAddress]` on the table `Raffle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `raffleAddress` to the `Raffle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Raffle_address_key";

-- AlterTable
ALTER TABLE "Raffle" DROP CONSTRAINT "Raffle_pkey",
DROP COLUMN "address",
DROP COLUMN "id",
ADD COLUMN     "raffleAddress" TEXT NOT NULL,
ADD COLUMN     "raffleId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Raffle_pkey" PRIMARY KEY ("raffleId");

-- CreateIndex
CREATE UNIQUE INDEX "Raffle_raffleAddress_key" ON "Raffle"("raffleAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Raffle_userId_raffleAddress_key" ON "Raffle"("userId", "raffleAddress");

-- AddForeignKey
ALTER TABLE "Raffle" ADD CONSTRAINT "Raffle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
