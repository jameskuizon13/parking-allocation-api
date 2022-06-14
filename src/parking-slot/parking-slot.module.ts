import { Module } from '@nestjs/common';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';

@Module({
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}
