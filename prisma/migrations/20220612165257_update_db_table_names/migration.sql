/*
  Warnings:

  - You are about to drop the `EntranceToParkingSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingRecords` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingSlotType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EntranceToParkingSlot" DROP CONSTRAINT "EntranceToParkingSlot_parkingEntranceId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceToParkingSlot" DROP CONSTRAINT "EntranceToParkingSlot_parkingSlotId_fkey";

-- DropForeignKey
ALTER TABLE "ParkingRecords" DROP CONSTRAINT "ParkingRecords_parkingSlotId_fkey";

-- DropForeignKey
ALTER TABLE "parking_slots" DROP CONSTRAINT "parking_slots_parkingSlotTypeId_fkey";

-- DropTable
DROP TABLE "EntranceToParkingSlot";

-- DropTable
DROP TABLE "ParkingRecords";

-- DropTable
DROP TABLE "ParkingSlotType";

-- CreateTable
CREATE TABLE "entrance_to_parking_slots" (
    "id" TEXT NOT NULL,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "parkingSlotId" TEXT NOT NULL,
    "parkingEntranceId" TEXT NOT NULL,

    CONSTRAINT "entrance_to_parking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_slot_types" (
    "id" TEXT NOT NULL,
    "type" "ParkingType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "parking_slot_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_records" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "timeIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOut" TIMESTAMP(3),
    "amountDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "parkingSlotId" TEXT NOT NULL,

    CONSTRAINT "parking_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_slots" ADD CONSTRAINT "parking_slots_parkingSlotTypeId_fkey" FOREIGN KEY ("parkingSlotTypeId") REFERENCES "parking_slot_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrance_to_parking_slots" ADD CONSTRAINT "entrance_to_parking_slots_parkingEntranceId_fkey" FOREIGN KEY ("parkingEntranceId") REFERENCES "parking_entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrance_to_parking_slots" ADD CONSTRAINT "entrance_to_parking_slots_parkingSlotId_fkey" FOREIGN KEY ("parkingSlotId") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_parkingSlotId_fkey" FOREIGN KEY ("parkingSlotId") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
