/*
  Warnings:

  - You are about to drop the column `currCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yearlyCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currCount",
DROP COLUMN "monthlyCount",
DROP COLUMN "yearlyCount",
ADD COLUMN     "currScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "monthlyScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yearlyScore" INTEGER NOT NULL DEFAULT 0;
