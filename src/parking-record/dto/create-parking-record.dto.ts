import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateParkingRecordDto {
  @IsUUID()
  @IsNotEmpty()
  entranceId: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;
}
