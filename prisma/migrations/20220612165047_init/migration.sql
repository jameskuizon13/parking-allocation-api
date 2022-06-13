-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('SP', 'MP', 'LP');

-- CreateTable
CREATE TABLE "parking_entrances" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "parking_entrances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_slots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "parkingSlotTypeId" TEXT NOT NULL,

    CONSTRAINT "parking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntranceToParkingSlot" (
    "id" TEXT NOT NULL,
    "distance" INTEGER NOT NULL DEFAULT 0,
    "parkingSlotId" TEXT NOT NULL,
    "parkingEntranceId" TEXT NOT NULL,

    CONSTRAINT "EntranceToParkingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingSlotType" (
    "id" TEXT NOT NULL,
    "type" "ParkingType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ParkingSlotType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingRecords" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "timeIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOut" TIMESTAMP(3),
    "amountDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "parkingSlotId" TEXT NOT NULL,

    CONSTRAINT "ParkingRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_entrances_name_key" ON "parking_entrances"("name");

-- AddForeignKey
ALTER TABLE "parking_slots" ADD CONSTRAINT "parking_slots_parkingSlotTypeId_fkey" FOREIGN KEY ("parkingSlotTypeId") REFERENCES "ParkingSlotType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceToParkingSlot" ADD CONSTRAINT "EntranceToParkingSlot_parkingEntranceId_fkey" FOREIGN KEY ("parkingEntranceId") REFERENCES "parking_entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceToParkingSlot" ADD CONSTRAINT "EntranceToParkingSlot_parkingSlotId_fkey" FOREIGN KEY ("parkingSlotId") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingRecords" ADD CONSTRAINT "ParkingRecords_parkingSlotId_fkey" FOREIGN KEY ("parkingSlotId") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
