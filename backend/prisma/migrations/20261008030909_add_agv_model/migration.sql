-- CreateTable
CREATE TABLE "AGV" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AGV_pkey" PRIMARY KEY ("id")
);
