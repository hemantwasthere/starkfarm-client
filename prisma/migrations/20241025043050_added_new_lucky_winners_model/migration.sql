-- CreateTable
CREATE TABLE "LuckyWinner" (
    "winnerId" SERIAL NOT NULL,
    "winnerAddress" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raffleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LuckyWinner_pkey" PRIMARY KEY ("winnerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LuckyWinner_winnerAddress_key" ON "LuckyWinner"("winnerAddress");

-- CreateIndex
CREATE UNIQUE INDEX "LuckyWinner_userId_winnerAddress_key" ON "LuckyWinner"("userId", "winnerAddress");

-- AddForeignKey
ALTER TABLE "LuckyWinner" ADD CONSTRAINT "LuckyWinner_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("raffleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckyWinner" ADD CONSTRAINT "LuckyWinner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
