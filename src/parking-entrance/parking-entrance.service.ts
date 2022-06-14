import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AddParkingEntranceDto } from './dto';

@Injectable({})
export class ParkingEntranceService {
  constructor(private databaseService: DatabaseService) {}

  fetchAllEntrances() {
    return this.databaseService.parkingEntrance.findMany();
  }

  addEntrance(dto: AddParkingEntranceDto) {
    return this.databaseService.parkingEntrance.create({
      data: { ...dto },
    });
  }
}
