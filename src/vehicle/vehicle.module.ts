import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Module({
  exports: [VehicleService],
  providers: [VehicleService],
})
export class VehicleModule {}
