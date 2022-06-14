import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { PositionDto } from './position.dto';

export class CreateParkingSlotDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsUUID()
  @IsNotEmpty()
  typeId: string;

  @IsOptional()
  @Type(() => PositionDto)
  positions?: PositionDto[];
}
