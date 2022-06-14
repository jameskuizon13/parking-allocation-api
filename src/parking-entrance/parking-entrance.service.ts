import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ParkingEntranceDto } from './dto';

@Injectable({})
export class ParkingEntranceService {
  constructor(private databaseService: DatabaseService) {}

  fetchAllEntrances() {
    return this.databaseService.parkingEntrance.findMany();
  }

  addEntrance(dto: ParkingEntranceDto) {
    return this.databaseService.parkingEntrance.create({
      data: { ...dto },
    });
  }

  updateEntrance(id: string, dto: ParkingEntranceDto) {
    return this.databaseService.parkingEntrance.update({
      where: {
        id,
      },
      data: { ...dto },
    });
  }
}
