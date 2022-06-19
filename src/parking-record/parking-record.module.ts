import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ParkingSlotModule } from '../parking-slot/parking-slot.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ParkingRecordController } from './parking-record.controller';
import { ParkingRecordService } from './parking-record.service';

@Module({
  controllers: [ParkingRecordController],
  exports: [ParkingRecordService],
  imports: [ConfigModule, ParkingSlotModule, VehicleModule],
  providers: [ParkingRecordService],
})
export class ParkingRecordModule {}
