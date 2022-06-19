import { ParkingType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ParkingTypeEnum } from '../../parking-slot/enums';

/**
 * DTO for the response for parking (POST /parking-record) and
 * unparking (PATCH /parking-record/:id)
 *
 * No need for class validator as this is only for swagger
 */
export class ParkingRecordDto {
  id: string;
  timeIn: Date;
  timeOut: Date;
  amountDue: number | Decimal;
  parkingSlot: {
    name: string;
    parkingSlotType: {
      price: number | Decimal;
      type: ParkingTypeEnum | ParkingType;
    };
    // Using any for this for now as there is a circular dependency issue that
    // I still haven't figured out how to fix
    entranceToParkingSlots?: any;
  };
}
