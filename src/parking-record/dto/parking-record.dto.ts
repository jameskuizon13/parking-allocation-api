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
  };
  entranceToParkingSlot: {
    distance: number;
  };
  parkingEntrance: {
    name: string;
  };
}
