import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ParkingRecordService } from './parking-record.service';

@Module({
  exports: [ParkingRecordService],
  imports: [ConfigModule],
  providers: [ParkingRecordService],
})
export class ParkingRecordModule {}
