/*
  Warnings:

  - You are about to drop the column `parkingEntranceId` on the `entrance_to_parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `parkingSlotId` on the `entrance_to_parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `amountDue` on the `parking_records` table. All the data in the column will be lost.
  - You are about to drop the column `parkingSlotId` on the `parking_records` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `parking_records` table. All the data in the column will be lost.
  - You are about to drop the column `timeIn` on the `parking_records` table. All the data in the column will be lost.
  - You are about to drop the column `timeOut` on the `parking_records` table. All the data in the column will be lost.
  - You are about to drop the column `isOccupied` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `parkingSlotTypeId` on the `parking_slots` table. All the data in the column will be lost.
  - Added the required column `parking_entrance_id` to the `entrance_to_parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_slot_id` to the `entrance_to_parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_slot_id` to the `parking_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `parking_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_slot_type_id` to the `parking_slots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('S', 'M', 'L');

-- DropForeignKey
ALTER TABLE "entrance_to_parking_slots" DROP CONSTRAINT "entrance_to_parking_slots_parkingEntranceId_fkey";

-- DropForeignKey
ALTER TABLE "entrance_to_parking_slots" DROP CONSTRAINT "entrance_to_parking_slots_parkingSlotId_fkey";

-- DropForeignKey
ALTER TABLE "parking_records" DROP CONSTRAINT "parking_records_parkingSlotId_fkey";

-- DropForeignKey
ALTER TABLE "parking_slots" DROP CONSTRAINT "parking_slots_parkingSlotTypeId_fkey";

-- AlterTable
ALTER TABLE "entrance_to_parking_slots" DROP COLUMN "parkingEntranceId",
DROP COLUMN "parkingSlotId",
ADD COLUMN     "parking_entrance_id" TEXT NOT NULL,
ADD COLUMN     "parking_slot_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parking_records" DROP COLUMN "amountDue",
DROP COLUMN "parkingSlotId",
DROP COLUMN "plateNumber",
DROP COLUMN "timeIn",
DROP COLUMN "timeOut",
ADD COLUMN     "amount_due" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "parking_slot_id" TEXT NOT NULL,
ADD COLUMN     "time_in" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "time_out" TIMESTAMP(3),
ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "isOccupied",
DROP COLUMN "parkingSlotTypeId",
ADD COLUMN     "is_occupied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parking_slot_type_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_slots" ADD CONSTRAINT "parking_slots_parking_slot_type_id_fkey" FOREIGN KEY ("parking_slot_type_id") REFERENCES "parking_slot_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrance_to_parking_slots" ADD CONSTRAINT "entrance_to_parking_slots_parking_entrance_id_fkey" FOREIGN KEY ("parking_entrance_id") REFERENCES "parking_entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrance_to_parking_slots" ADD CONSTRAINT "entrance_to_parking_slots_parking_slot_id_fkey" FOREIGN KEY ("parking_slot_id") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_parking_slot_id_fkey" FOREIGN KEY ("parking_slot_id") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
