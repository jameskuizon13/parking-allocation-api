import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DatabaseService } from '../database/database.service';
import { FetchParkingSlotDto, ParkingSlotDto } from './dto';

@Injectable({})
export class ParkingSlotService {
  constructor(private databaseService: DatabaseService) {}

  fetchAll(query: FetchParkingSlotDto) {
    if (query.parkingType) {
      query['parkingSlotType'] = { type: query.parkingType };
      delete query.parkingType;
    }

    /** Sample where statement if both isOccupied and parkingType is present
     *  {
     *      isOccupied: false,
     *      parkingSlotType: {
     *          type: 'SP'
     *      }
     *  }
     * */
    return this.databaseService.parkingSlot.findMany({
      where: query,
    });
  }

  async addParkingSlot(dto: ParkingSlotDto) {
    try {
      const positions = dto?.positions?.length ? dto.positions : [];

      // Awaiting the result of the Promise to catch if there is an error
      return await this.databaseService.parkingSlot.create({
        data: {
          name: dto.name,
          parkingSlotTypeId: dto.typeId,
          // this is a relationship table
          entranceToParkingSlots: {
            create: positions,
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Duplicate parking slot and/or duplicate distance to entrance',
          );
        }
      } else {
        throw error;
      }
    }
  }
}
