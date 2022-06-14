import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { AddParkingEntranceDto } from './dto';
import { ParkingEntranceService } from './parking-entrance.service';

@ApiBearerAuth()
@ApiTags('parking-entrances')
@UseGuards(JwtGuard)
@Controller('parking-entrances')
export class ParkingEntranceController {
  constructor(private parkingEntranceService: ParkingEntranceService) {}

  @Get()
  fetchAll() {
    return this.parkingEntranceService.fetchAllEntrances();
  }

  @Post()
  addEntrance(@Body() body: AddParkingEntranceDto) {
    return this.parkingEntranceService.addEntrance(body);
  }
}
