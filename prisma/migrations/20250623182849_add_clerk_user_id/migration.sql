/*
  Warnings:

  - You are about to drop the column `monthlyScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yearlyScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Fridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyStat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MonthlyStat" DROP CONSTRAINT "MonthlyStat_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "monthlyScore",
DROP COLUMN "yearlyScore",
ADD COLUMN     "clerkUserId" TEXT;

-- DropTable
DROP TABLE "Fridge";

-- DropTable
DROP TABLE "MonthlyStat";

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
