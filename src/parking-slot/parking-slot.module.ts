import { Module } from '@nestjs/common';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';

@Module({
  imports: [VehicleModule],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}
