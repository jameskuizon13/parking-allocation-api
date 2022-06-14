import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ParkingEntranceModule } from './parking-entrance/parking-entrance.module';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule, ParkingEntranceModule],
})
export class AppModule {}
