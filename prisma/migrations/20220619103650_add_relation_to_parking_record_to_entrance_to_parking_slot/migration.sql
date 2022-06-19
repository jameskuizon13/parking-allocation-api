/*
  Warnings:

  - Added the required column `entrance_to_parking_slot_id` to the `parking_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_records" ADD COLUMN     "entrance_to_parking_slot_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_entrance_to_parking_slot_id_fkey" FOREIGN KEY ("entrance_to_parking_slot_id") REFERENCES "entrance_to_parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
