import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { VehicleTypeEnum } from '../vehicle/enums';
import {
  FetchParkingSlotDto,
  CreateParkingSlotDto,
  UpdateParkingSlotDto,
} from './dto';

import { ParkingTypeEnum } from './enums';

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
      include: {
        parkingSlotType: true,
        parkingRecords: true,
        entranceToParkingSlots: {
          select: {
            distance: true,
            parkingEntrance: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async createParkingSlot(dto: CreateParkingSlotDto) {
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
        } else {
          throw new BadRequestException();
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Fetching a list of parking slot that is not occupied and has a connection
   * with the given entrance id
   *
   * @param   {ParkingTypeEnum[]}  types  Allowed parking slot type based on the vehicle size
   * @param   {string}  entranceId        The entrance id where the vehicle entered thru
   *
   * @return  {ParkingSlot[]}                        List of parking slots that are not occupied and
   *                                      connected to the entrance that the vehicle entered thru
   */
  async fetchAvailableParkingSlots(
    types: ParkingTypeEnum[],
    entranceId: string,
  ) {
    const typeOrStatements = types.map((type) => {
      return { type };
    });

    // Fetching all allowed parking slots based on the size/type of the vehicle
    // and is not occupied
    const parkingSlots = await this.databaseService.parkingSlot.findMany({
      where: {
        isOccupied: false,
        parkingSlotType: {
          OR: typeOrStatements,
        },
      },
      include: {
        entranceToParkingSlots: true,
      },
    });

    // If there is no available parking slot throw an error
    if (parkingSlots.length === 0) {
      throw new BadRequestException('No available parking slot');
    }

    // Filtering parkingSlots that is connected to the given entrance
    const availableParkingSlots = parkingSlots
      .map((parkingSlot) => {
        return {
          ...parkingSlot,
          entranceToParkingSlots: parkingSlot.entranceToParkingSlots.filter(
            ({ parkingEntranceId }) => parkingEntranceId === entranceId,
          ),
        };
      })
      .filter(({ entranceToParkingSlots }) => entranceToParkingSlots.length);

    return availableParkingSlots;
  }

  async fetchNearestAvailableParkingSlot(
    entranceId: string,
    vehicleType: VehicleTypeEnum,
  ) {
    try {
      const allowedParkingSlots =
        vehicleType === VehicleTypeEnum.S
          ? [ParkingTypeEnum.SP, ParkingTypeEnum.MP, ParkingTypeEnum.LP]
          : vehicleType === VehicleTypeEnum.M
          ? [ParkingTypeEnum.MP, ParkingTypeEnum.LP]
          : [ParkingTypeEnum.LP];

      const availableParkingSlots = await this.fetchAvailableParkingSlots(
        allowedParkingSlots,
        entranceId,
      );

      return availableParkingSlots.reduce((nearest, parkingSlot) => {
        if (
          nearest.entranceToParkingSlots[0].distance >
          parkingSlot.entranceToParkingSlots[0].distance
        ) {
          return parkingSlot;
        }
        return nearest;
      });
    } catch (error) {
      throw error;
    }
  }

  updateParkingSlot(id: string, dto: UpdateParkingSlotDto) {
    return this.databaseService.parkingSlot.update({
      where: {
        id,
      },
      data: { ...dto },
    });
  }
}
