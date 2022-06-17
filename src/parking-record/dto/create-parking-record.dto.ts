import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateParkingRecordDto {
  @IsUUID()
  @IsNotEmpty()
  parkingSlotId: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;
}
