/*
  Warnings:

  - Made the column `monthlyCount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearlyCount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currCount` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "monthlyCount" SET NOT NULL,
ALTER COLUMN "monthlyCount" SET DEFAULT 0,
ALTER COLUMN "yearlyCount" SET NOT NULL,
ALTER COLUMN "yearlyCount" SET DEFAULT 0,
ALTER COLUMN "currCount" SET NOT NULL,
ALTER COLUMN "currCount" SET DEFAULT 0;
