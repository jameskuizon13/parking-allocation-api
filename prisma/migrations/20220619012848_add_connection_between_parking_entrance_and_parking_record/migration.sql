/*
  Warnings:

  - Added the required column `parking_entrance_id` to the `parking_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_records" ADD COLUMN     "parking_entrance_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_parking_entrance_id_fkey" FOREIGN KEY ("parking_entrance_id") REFERENCES "parking_entrances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
