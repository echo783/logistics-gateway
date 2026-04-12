-- CreateTable
CREATE TABLE "ShipmentAssignHistory" (
    "id" SERIAL NOT NULL,
    "shipmentNo" TEXT NOT NULL,
    "fromDriverId" INTEGER,
    "toDriverId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentAssignHistory_pkey" PRIMARY KEY ("id")
);
