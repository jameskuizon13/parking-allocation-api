import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { DatabaseService } from '../database/database.service';
import { CreateParkingRecordDto } from './dto';

@Injectable({})
export class ParkingRecordService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {}

  /**
   * Creates a new parking record
   *
   * @param   {CreateParkingRecordDto}  dto  DTO for creating a parking record
   *
   * @return  {ParkingRecord}         The newly created Parking Record
   * @throws  {BadRequestException}
   */
  async createParkingRecord(dto: CreateParkingRecordDto) {
    try {
      return await this.databaseService.parkingRecord.create({
        data: {
          parkingSlotId: dto.parkingSlotId,
          vehicleId: dto.vehicleId,
        },
      });
    } catch (error) {
      throw new BadRequestException();
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
      return await this.databaseService.parkingRecord.findUnique({
        where: { id },
        include: { parkingSlot: { include: { parkingSlotType: true } } },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('Parking record not found');
        }
      } else {
        throw error;
      }
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
