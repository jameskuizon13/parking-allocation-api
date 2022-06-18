import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto } from './dto';

@Injectable({})
export class VehicleService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Create a vehicle
   *
   * @param   {CreateVehicleDto}  dto  DTO for creating a vehicle
   *
   * @return  {Vehicle}                Created Vehicle
   * @throws  {BadRequestException}    Duplicate vehicle
   */
  async createVehicle(dto: CreateVehicleDto) {
    try {
      return await this.databaseService.vehicle.create({ data: dto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Vehicle registration error');
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * ! Deprecated
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
          const vehicle = await this.databaseService.vehicle.findFirst({
            where: dto,
          });

          if (!vehicle) {
            throw new BadRequestException('Vehicle registration error');
          } else {
            return vehicle;
          }
        }
      } else {
        throw new BadRequestException();
      }
    }
  }
}
