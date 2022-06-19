import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from '../database/database.service';
import { ParkingSlotService } from '../parking-slot/parking-slot.service';
import { VehicleTypeEnum } from '../vehicle/enums';
import { VehicleService } from '../vehicle/vehicle.service';
import { CreateParkingRecordDto, ManualUpdateParkingRecordDto } from './dto';

@Injectable({})
export class ParkingRecordService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private parkingSlotService: ParkingSlotService,
    private vehicleService: VehicleService,
  ) {}

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
          include: {
            parkingSlot: { include: { parkingSlotType: true } },
            parkingEntrance: true,
          },
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
   * Fetch continuous data basend on parking records of the given vehicle
   *
   * @param   {string}  vehicleId  Unique ID of the vehicle
   *
   * @return  {Promise<{isContinuous: boolean; remainingContinuousHours: number;}>}
   *              The continuous data
   */
  async fetchContinuousData(vehicleId: string): Promise<{
    isContinuous: boolean;
    remainingContinuousHours: number;
  }> {
    const parkingRecords = await this.databaseService.parkingRecord.findMany({
      where: {
        vehicleId,
      },
    });

    const newTimeIn = new Date();
    const recentRecord = parkingRecords.find(({ timeOut }) => {
      // Getting the time difference between the current time in and the
      // previous time out and converting it to minutes as
      // 1000 milliseconds is 1 second and 60 seconds is 1 minute
      // as the condition for continuous rate is that the difference
      // between the new parking record time in and the past parking record
      // is within 1hr
      const timeDifference =
        (newTimeIn.getTime() - timeOut.getTime()) / (60 * 1000);
      return timeDifference > 0 && timeDifference <= 60;
    });

    if (recentRecord) {
      const remainingHours =
        parseInt(this.configService.get('FLAT_RATE_HOURS')) -
        recentRecord.duration;

      return {
        isContinuous: true,
        remainingContinuousHours: remainingHours > 0 ? remainingHours : 0,
      };
    } else {
      return { isContinuous: false, remainingContinuousHours: 0 };
    }
  }

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

      const continuousRateData = await this.fetchContinuousData(vehicleId);

      const parkingRecord = await this.databaseService.parkingRecord.create({
        data: {
          parkingSlotId,
          vehicleId,
          parkingEntranceId: entranceId,
          ...continuousRateData,
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
   * Computing the parking fee based on the difference from the time the vehicle entered the parking complex
   * and the time it unpark
   *
   * @param   {Date}    timeOut           The time when the vehicle is leaving the parking complex
   * @param   {Date}    timeIn            The time when the vehicle starts parking
   * @param   {number}  parkingSlotPrice  The price tag for the parking slot
   * @param   {number}  freeHours         For parkings that continuous rate applies to, it is the remaining hours
   *                                      in their flat rate payment
   * @param   {boolean} isContinuous      Does the continuous rate applies in this instance
   *
   * @return  {{ amountDue: number; duration: number }}    The parking fee that the car needs to pay upon leaving
   *                                                       and its duration of stay
   */
  computeParkingFee(
    timeOut: Date,
    timeIn: Date,
    parkingSlotPrice: number,
    freeHours = 0,
    isContinuous = false,
  ): { amountDue: number; duration: number } {
    const timeDifference = timeOut.getTime() - timeIn.getTime();

    // Dividing the timeDifference by hours based on milliseconds as
    // 1000 milliseconds is 1 second, 60 seconds is 1 minute and 60 minutes is 1 hr
    // and rounding it up to the nearest largest integer
    const totalHours = Math.ceil(timeDifference / (1000 * 60 * 60)) - freeHours;
    const flatRateHours = parseInt(this.configService.get('FLAT_RATE_HOURS'));
    const flatRate = parseInt(this.configService.get('FLAT_RATE'));
    const overnightFee = parseInt(this.configService.get('OVERNIGHT_FEE'));

    if (totalHours > 24) {
      const days = totalHours / 24;
      const remainingHours = Math.ceil(totalHours % 24);

      return {
        amountDue: days * overnightFee + remainingHours * parkingSlotPrice,
        duration: totalHours,
      };
    } else if (isContinuous) {
      return {
        amountDue: totalHours * parkingSlotPrice,
        duration: totalHours + freeHours,
      };
    } else if (totalHours > flatRateHours) {
      return {
        amountDue: (totalHours - flatRateHours) * parkingSlotPrice + flatRate,
        duration: totalHours,
      };
    } else {
      return { amountDue: flatRate, duration: totalHours + freeHours };
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
  async unpark(id: string) {
    const {
      timeIn,
      timeOut,
      remainingContinuousHours,
      isContinuous,
      parkingSlot: {
        id: parkingSlotId,
        parkingSlotType: { price },
      },
    } = await this.fetchParkingRecord(id);

    if (timeOut) {
      throw new BadRequestException('Vehicle has already unparked');
    }

    const newTimeOut = new Date();
    // price is of type Decimal from Decimal.js
    const data = this.computeParkingFee(
      newTimeOut,
      timeIn,
      price.toNumber(),
      remainingContinuousHours,
      isContinuous,
    );

    await this.parkingSlotService.updateParkingSlot(parkingSlotId, {
      isOccupied: false,
    });

    return this.databaseService.parkingRecord.update({
      where: { id },
      data: { timeOut: newTimeOut, ...data },
    });
  }

  /**
   * Used when you want to manually specify the parking duration
   *
   * @param   {string}  id  Unique id of the parking record
   * @param   {ManualUpdateParkingRecordDto} dto DTO for manually specifying the
   *                                             parking duration
   *
   * @return  {ParkingRecord}      The updated parking record with the amount due
   *                               and timeOut
   */
  async manualUnpark(id: string, dto: ManualUpdateParkingRecordDto) {
    try {
      const {
        timeIn,
        timeOut,
        remainingContinuousHours,
        isContinuous,
        parkingSlot: {
          id: parkingSlotId,
          parkingSlotType: { price },
        },
      } = await this.fetchParkingRecord(id);

      if (timeOut) {
        throw new BadRequestException('Vehicle has already unparked');
      }

      // Converting minutes and hours to milliseconds
      // 1000 milliseconds is equal 1 second
      // 60 seconds is equal to 1 minute
      // 60 minutes is equal to 1 hour
      const minutes = dto?.minutes ? dto.minutes * 60 * 1000 : 0;
      const hours = dto?.hours ? dto.hours * 60 * 60 * 1000 : 0;

      const newTimeOut = new Date(timeIn.getTime() + minutes + hours);
      // price is of type Decimal from Decimal.js
      const data = this.computeParkingFee(
        newTimeOut,
        timeIn,
        price.toNumber(),
        remainingContinuousHours,
        isContinuous,
      );

      await this.parkingSlotService.updateParkingSlot(parkingSlotId, {
        isOccupied: false,
      });

      return this.databaseService.parkingRecord.update({
        where: { id },
        data: { timeOut: newTimeOut, ...data },
      });
    } catch (error) {
      throw error;
    }
  }
}
