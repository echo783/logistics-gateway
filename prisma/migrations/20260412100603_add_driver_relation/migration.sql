/*
  Warnings:

  - A unique constraint covering the columns `[driverPhone]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicleNo]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ShipmentStatusHistory" ADD COLUMN     "changedBy" TEXT,
ADD COLUMN     "reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverPhone_key" ON "Driver"("driverPhone");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_vehicleNo_key" ON "Driver"("vehicleNo");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_assignedDriverId_fkey" FOREIGN KEY ("assignedDriverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
