/*
  Warnings:

  - You are about to drop the column `vehicle_type` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `type` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "vehicle_type",
ADD COLUMN     "type" "VehicleType" NOT NULL;
