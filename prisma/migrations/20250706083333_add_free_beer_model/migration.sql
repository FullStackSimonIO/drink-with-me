-- CreateTable
CREATE TABLE "FreeBeer" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FreeBeer_pkey" PRIMARY KEY ("id")
);
