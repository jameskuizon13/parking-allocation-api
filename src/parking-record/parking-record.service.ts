import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from '../database/database.service';
import { ParkingSlotService } from '../parking-slot/parking-slot.service';
import { VehicleTypeEnum } from '../vehicle/enums';
import { VehicleService } from '../vehicle/vehicle.service';
import { CreateParkingRecordDto } from './dto';

@Injectable({})
export class ParkingRecordService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private parkingSlotService: ParkingSlotService,
    private vehicleService: VehicleService,
  ) {}

  /**
   * Creates a parking object, if we can create or find the vehicle, and assign
   * a parking slot to it
   *
   * @param   {CreateParkingRecordDto}  dto  DTO for creating a parking record
   *
   * @return  {ParkingRecord}         The newly created Parking Record
   * @throws  {ForbiddenException}    There is still an active parking record
   */
  async createParkingRecord(dto: CreateParkingRecordDto) {
    try {
      const { entranceId, vehicleId } = dto;

      const vehicle = await this.vehicleService.fetchOne(vehicleId);

      const { id: parkingSlotId } =
        await this.parkingSlotService.fetchNearestAvailableParkingSlot(
          entranceId,
          vehicle.type as VehicleTypeEnum,
        );

      // Fetch all parking records
      // This will throw an error if there is an existing active parking record
      const parkingRecords = await this.databaseService.parkingRecord.findMany({
        where: {
          vehicleId,
        },
      });

      // Check if parking records has an active parking
      const activeParkingRecord = parkingRecords.find(
        (parkingRecord) => parkingRecord.timeOut == null,
      );

      if (activeParkingRecord) {
        throw new ForbiddenException('There is still an active parking record');
      }

      const parkingRecord = await this.databaseService.parkingRecord.create({
        data: {
          parkingSlotId,
          vehicleId,
        },
        select: {
          id: true,
          timeIn: true,
          timeOut: true,
          amountDue: true,
          parkingSlot: {
            select: {
              name: true,
              parkingSlotType: {
                select: {
                  price: true,
                  type: true,
                },
              },
              entranceToParkingSlots: {
                select: {
                  distance: true,
                  parkingEntrance: { select: { name: true } },
                },
                where: {
                  parkingEntranceId: entranceId,
                },
              },
            },
          },
        },
      });

      await this.parkingSlotService.updateParkingSlot(parkingSlotId, {
        isOccupied: true,
      });

      return parkingRecord;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch existing parking record if not, will throw an error
   *
   * @param   {string}  id  Unique id of parking record
   *
   * @return  {ParkingRecord}      Fetched parking record
   * @throws  {NotFoundException}  Parking record not found
   */
  async fetchParkingRecord(id: string) {
    try {
      const parkingRecord = await this.databaseService.parkingRecord.findUnique(
        {
          where: { id },
          include: { parkingSlot: { include: { parkingSlotType: true } } },
        },
      );

      if (!parkingRecord) {
        throw new NotFoundException('Parking record not found');
      }

      return parkingRecord;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Computing the parking fee based on the difference from the time the vehicle entered the parking complex
   * and the time it unpark
   *
   * @param   {Date}    timeOut           The time when the vehicle is leaving the parking complex
   * @param   {Date}    timeIn            The time when the vehicle starts parking
   * @param   {number}  parkingSlotPrice  The price tag for the parking slot
   *
   * @return  {number}                    The parking fee that the car needs to pay upon leaving
   */
  computeParkingFee(
    timeOut: Date,
    timeIn: Date,
    parkingSlotPrice: number,
  ): number {
    const timeDifference = timeOut.getTime() - timeIn.getTime();

    // Dividing the timeDifference by hours based on milliseconds as
    // 1000 milliseconds is 1 second, 60 seconds is 1 minute and 60 minutes is 1 hr
    // and rounding it up to the nearest largest integer
    const totalHours = Math.ceil(timeDifference / (1000 * 60 * 60));
    const flatRateHours = this.configService.get('FLAT_RATE_HOURS');

    if (totalHours > 24) {
      const days = totalHours / 24;
      const remainingHours = Math.ceil(totalHours % 24);

      return (
        days * this.configService.get('OVERNIGHT_FEE') +
        remainingHours * parkingSlotPrice
      );
    } else if (totalHours > flatRateHours) {
      return (
        (totalHours - flatRateHours) * parkingSlotPrice +
        this.configService.get('FLAT_RATE')
      );
    } else {
      return this.configService.get('FLAT_RATE');
    }
  }

  /**
   * Used when unparking/when the vehicle is leaving the parking complex
   *
   * @param   {string}  id  Unique id of the parking record
   *
   * @return  {ParkingRecord}      The updated parking record with the amount due
   *                               and timeOut
   */
  async endParkingRecord(id: string) {
    const {
      timeIn,
      parkingSlot: {
        parkingSlotType: { price },
      },
    } = await this.fetchParkingRecord(id);

    const timeOut = new Date();
    // price is of type Decimal from Decimal.js
    const amountDue = this.computeParkingFee(timeOut, timeIn, price.toNumber());

    return this.databaseService.parkingRecord.update({
      where: { id },
      data: { timeOut, amountDue },
    });
  }
}