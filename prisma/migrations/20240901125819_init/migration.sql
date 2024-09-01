-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT,
ALTER COLUMN "monthlyCount" DROP NOT NULL,
ALTER COLUMN "monthlyCount" DROP DEFAULT,
ALTER COLUMN "yearlyCount" DROP NOT NULL,
ALTER COLUMN "yearlyCount" DROP DEFAULT,
ALTER COLUMN "currCount" DROP NOT NULL,
ALTER COLUMN "currCount" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Fridge" (
    "id" SERIAL NOT NULL,
    "beerCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Fridge_pkey" PRIMARY KEY ("id")
);
