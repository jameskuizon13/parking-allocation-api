import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { VehicleTypeEnum } from '../enums';

/**
 * CreateVehicleDto DTO for creating a vehicle
 */
export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  type: VehicleTypeEnum;
}
