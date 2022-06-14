import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddParkingEntranceDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;
}
