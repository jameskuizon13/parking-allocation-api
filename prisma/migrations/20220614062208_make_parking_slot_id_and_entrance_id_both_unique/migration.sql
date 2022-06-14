/*
  Warnings:

  - A unique constraint covering the columns `[parking_slot_id,parking_entrance_id]` on the table `entrance_to_parking_slots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "entrance_to_parking_slots_parking_slot_id_parking_entrance__key" ON "entrance_to_parking_slots"("parking_slot_id", "parking_entrance_id");
