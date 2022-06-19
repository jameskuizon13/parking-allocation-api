import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { VehicleTypeEnum } from '../enums';

/**
 * FetchAllVehicleDto DTO for creating a vehicle
 *
 * * Almost similar with create-vehicle.dto.ts except
 * that the properties are optional
 */
export class FetchAllVehicleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  plateNumber?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  type?: VehicleTypeEnum;
}
