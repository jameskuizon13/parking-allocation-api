/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `parking_slots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parking_slots_name_key" ON "parking_slots"("name");
