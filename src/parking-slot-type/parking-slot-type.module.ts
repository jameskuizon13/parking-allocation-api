import { Module } from '@nestjs/common';
import { ParkingSlotTypeController } from './parking-slot-type.controller';
import { ParkingSlotTypeService } from './parking-slot-type.service';

@Module({
  controllers: [ParkingSlotTypeController],
  providers: [ParkingSlotTypeService],
})
export class ParkingSlotTypeModule {}
