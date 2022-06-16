import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { VehicleTypeEnum } from '../../vehicle/enums';

export class AssignParkingSlotDto {
  @IsUUID()
  @IsNotEmpty()
  entranceId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  vehicleType: VehicleTypeEnum;
}
