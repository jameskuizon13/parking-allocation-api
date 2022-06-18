import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto } from './dto';

@Injectable({})
export class VehicleService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Try to create a vehicle but if vehicle is already existing
   * return existing vehicle
   *
   * @param   {CreateVehicleDto}  dto  [data description]
   *
   * @return  {[type]}                  [return description]
   */
  async createOrFindVehicle(dto: CreateVehicleDto) {
    try {
      return await this.databaseService.vehicle.create({ data: dto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return await this.databaseService.vehicle.findUnique({
            where: { plateNumber: dto.plateNumber },
          });
        }
      } else {
        throw new BadRequestException();
      }
    }
  }
}
