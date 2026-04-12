/*
  Warnings:

  - The `currentStatus` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "currentStatus",
ADD COLUMN     "currentStatus" "ShipmentStatus" NOT NULL DEFAULT 'REQUESTED';
