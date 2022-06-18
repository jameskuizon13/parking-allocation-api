import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto, FetchAllVehicleDto } from './dto';

@Injectable({})
export class VehicleService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Fetch all vehicles that passed the filters
   *
   * @param   {FetchAllVehicleDto}  query  DTO for filtering the search results
   *
   * @return  {Vehicle[]}                  List of vehicles
   */
  fetchAll(query: FetchAllVehicleDto) {
    return this.databaseService.vehicle.findMany({ where: query });
  }

  /**
   * Fetch vehicle with the given id
   *
   * @param   {string}  id  Unique id of vehicle
   *
   * @return  {Vehicle}     The fetch vehicle details
   */
  async fetchOne(id: string) {
    try {
      return await this.databaseService.vehicle.findUnique({
        where: { id },
        include: { parkingRecords: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('Vehicle not found');
        }
      } else {
        throw error;
      }
    }
  }

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
}
