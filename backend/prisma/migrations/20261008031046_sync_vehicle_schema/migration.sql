/*
  Warnings:

  - You are about to drop the `AGV` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AGVLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('IDLE', 'MOVING', 'CHARGING', 'ERROR', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- DropTable
DROP TABLE "AGV";

-- DropTable
DROP TABLE "AGVLog";

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'IDLE',
    "batteryLevel" INTEGER NOT NULL DEFAULT 100,
    "currentX" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currentY" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currentTheta" DOUBLE PRECISION,
    "lastHeartbeat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleLog" (
    "id" SERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "logLevel" "LogLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VehicleLog" ADD CONSTRAINT "VehicleLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
