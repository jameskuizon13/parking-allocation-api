import { VehicleTypeEnum } from '../enums';

/**
 * [CreateVehicleDto DTO for creating a vehicle]
 *
 * NOTE: I won't be adding the class-validator and class-transformer functions here
 *       as of now this is being used in the vehicle.service.ts only
 */
export class CreateVehicleDto {
  plateNumber: string;
  type: VehicleTypeEnum;
}
