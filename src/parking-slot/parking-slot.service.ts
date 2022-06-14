import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable({})
export class ParkingSlotService {
  constructor(private databaseService: DatabaseService) {}
}
