-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedVehicleId" TEXT,
ADD COLUMN     "startLocation" TEXT,
ADD COLUMN     "targetLocation" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "priority" SET DEFAULT 3;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedVehicleId_fkey" FOREIGN KEY ("assignedVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
