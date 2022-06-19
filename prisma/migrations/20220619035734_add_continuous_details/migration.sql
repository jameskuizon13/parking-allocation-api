-- AlterTable
ALTER TABLE "parking_records" ADD COLUMN     "is_continuous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remaining_continuous_hours" INTEGER NOT NULL DEFAULT 0;
