/*
  Warnings:

  - A unique constraint covering the columns `[plate_number]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_number_key" ON "vehicles"("plate_number");
