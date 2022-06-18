import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable({})
export class ParkingSlotTypeService {
  constructor(private databaseService: DatabaseService) {}

  fetchAll() {
    return this.databaseService.parkingSlotType.findMany();
  }
}
