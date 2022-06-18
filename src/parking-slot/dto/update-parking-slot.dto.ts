import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { toBoolean } from '../../common/helpers';
import { PositionDto } from './position.dto';

export class UpdateParkingSlotDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  typeId?: string;

  @IsOptional()
  @Type(() => PositionDto)
  positions?: PositionDto[];

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isOccupied?: boolean;
}
