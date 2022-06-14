import { Module } from '@nestjs/common';
import { ParkingEntranceController } from './parking-entrance.controller';
import { ParkingEntranceService } from './parking-entrance.service';

@Module({
  controllers: [ParkingEntranceController],
  providers: [ParkingEntranceService],
})
export class ParkingEntranceModule {}
