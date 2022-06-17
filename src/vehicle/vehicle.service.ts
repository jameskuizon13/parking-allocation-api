import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto } from './dto';

@Injectable({})
export class VehicleService {
  constructor(private databaseService: DatabaseService) {}

  async createOrFindVehicle(data: CreateVehicleDto) {
    try {
      return await this.databaseService.vehicle.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return await this.databaseService.vehicle.findUnique({
            where: { plateNumber: data.plateNumber },
          });
        }
      } else {
        throw new BadRequestException();
      }
    }
  }
}
