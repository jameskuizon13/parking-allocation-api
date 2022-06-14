import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { toBoolean } from '../../common/helpers';
import { ParkingTypeEnum } from '../enums';

export class FetchParkingSlotDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ParkingTypeEnum)
  parkingType?: ParkingTypeEnum;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isOccupied?: boolean;
}
