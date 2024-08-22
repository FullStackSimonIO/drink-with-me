-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "monthlyCount" INTEGER,
    "yearlyCount" INTEGER,
    "currCount" INTEGER,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
