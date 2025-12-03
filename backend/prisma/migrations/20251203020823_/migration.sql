/*
  Warnings:

  - You are about to drop the `matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournament_registrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "match_participants" DROP CONSTRAINT "match_participants_matchId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_arenaId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "tournament_registrations" DROP CONSTRAINT "tournament_registrations_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "tournament_registrations" DROP CONSTRAINT "tournament_registrations_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "tournament_registrations" DROP CONSTRAINT "tournament_registrations_userId_fkey";

-- DropTable
DROP TABLE "matches";

-- DropTable
DROP TABLE "tournament_registrations";

-- CreateTable
CREATE TABLE "tournamentRegistrations" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "partnerId" INTEGER,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournamentRegistrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "arenaId" INTEGER NOT NULL,
    "tournamentId" INTEGER,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
    "scoreResult" TEXT,
    "winnerTeamId" INTEGER,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournamentRegistrations_tournamentId_userId_key" ON "tournamentRegistrations"("tournamentId", "userId");

-- AddForeignKey
ALTER TABLE "tournamentRegistrations" ADD CONSTRAINT "tournamentRegistrations_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentRegistrations" ADD CONSTRAINT "tournamentRegistrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentRegistrations" ADD CONSTRAINT "tournamentRegistrations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "arenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
