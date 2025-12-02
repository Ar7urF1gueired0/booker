/*
  Warnings:

  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `court` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `team1Players` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `team1Score` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2Players` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `team2Score` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `matches` table. All the data in the column will be lost.
  - The `id` column on the `matches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tournamentId` column on the `matches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `matches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tournaments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courts` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `playersPerMatch` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tournaments` table. All the data in the column will be lost.
  - The `id` column on the `tournaments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `arenaId` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchDate` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arenaId` to the `tournaments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `tournaments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HandType" AS ENUM ('RIGHT', 'LEFT');

-- CreateEnum
CREATE TYPE "BackhandType" AS ENUM ('ONE_HAND', 'TWO_HANDS');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('PRO', 'A', 'B', 'C');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'ONGOING', 'FINISHED', 'CANCELED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
DROP COLUMN "court",
DROP COLUMN "createdAt",
DROP COLUMN "scheduledAt",
DROP COLUMN "team1Players",
DROP COLUMN "team1Score",
DROP COLUMN "team2Players",
DROP COLUMN "team2Score",
DROP COLUMN "updatedAt",
ADD COLUMN     "arenaId" INTEGER NOT NULL,
ADD COLUMN     "matchDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scoreResult" TEXT,
ADD COLUMN     "winnerTeamId" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "tournamentId",
ADD COLUMN     "tournamentId" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tournaments" DROP CONSTRAINT "tournaments_pkey",
DROP COLUMN "courts",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "format",
DROP COLUMN "playersPerMatch",
DROP COLUMN "updatedAt",
ADD COLUMN     "arenaId" INTEGER NOT NULL,
ADD COLUMN     "categoryFilter" TEXT,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "registrationDeadline" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "backhand" "BackhandType" NOT NULL DEFAULT 'ONE_HAND',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "forehand" "HandType" NOT NULL DEFAULT 'RIGHT',
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'C',
ADD COLUMN     "locationCity" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "arenas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "contactPhone" TEXT,

    CONSTRAINT "arenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_registrations" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "partnerId" INTEGER,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participants" (
    "matchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamNumber" INTEGER NOT NULL,

    CONSTRAINT "match_participants_pkey" PRIMARY KEY ("matchId","userId")
);

-- CreateTable
CREATE TABLE "social_posts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contentText" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "earnedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("userId","achievementId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournament_registrations_tournamentId_userId_key" ON "tournament_registrations"("tournamentId", "userId");

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "arenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registrations" ADD CONSTRAINT "tournament_registrations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "arenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
