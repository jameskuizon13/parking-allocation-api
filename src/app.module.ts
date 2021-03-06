import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ParkingEntranceModule } from './parking-entrance/parking-entrance.module';
import { ParkingSlotModule } from './parking-slot/parking-slot.module';
import { ParkingSlotTypeModule } from './parking-slot-type/parking-slot-type.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ParkingRecordModule } from './parking-record/parking-record.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ParkingEntranceModule,
    ParkingRecordModule,
    ParkingSlotModule,
    ParkingSlotTypeModule,
    UserModule,
    VehicleModule,
  ],
})
export class AppModule {}
