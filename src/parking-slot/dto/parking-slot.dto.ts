import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PositionDto } from './position.dto';

export class ParkingSlotDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  typeId: string;

  @IsOptional()
  @Type(() => PositionDto)
  positions: PositionDto[];
}
