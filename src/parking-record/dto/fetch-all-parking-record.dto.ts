import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { toBoolean } from '../../common/helpers';
import { ParkingTypeEnum } from '../../parking-slot/enums';

import { VehicleTypeEnum } from '../../vehicle/enums';

export class FetchAllParkingRecordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  keyword?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  vehicleType?: VehicleTypeEnum;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ParkingTypeEnum)
  parkingType?: ParkingTypeEnum;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive?: boolean;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isContinuous?: boolean;
}
