import { Module } from '@nestjs/common';

import { ParkingRecordModule } from '../parking-record/parking-record.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';

@Module({
  imports: [ParkingRecordModule, VehicleModule],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}
