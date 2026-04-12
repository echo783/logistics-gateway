-- CreateTable
CREATE TABLE "ShipmentStatusHistory" (
    "id" SERIAL NOT NULL,
    "shipmentNo" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentStatusHistory_pkey" PRIMARY KEY ("id")
);
