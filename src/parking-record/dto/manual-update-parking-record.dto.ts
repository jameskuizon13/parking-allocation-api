import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ManualUpdateParkingRecordDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hours?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(60)
  minutes?: number;
}
