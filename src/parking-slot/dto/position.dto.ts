import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PositionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  parkingEntranceId: string;

  @IsInt()
  @IsNotEmpty()
  distance: number;
}
