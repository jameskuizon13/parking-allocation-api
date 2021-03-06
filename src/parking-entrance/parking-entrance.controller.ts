import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { ParkingEntranceDto } from './dto';
import { ParkingEntranceService } from './parking-entrance.service';

@ApiBearerAuth()
@ApiTags('parking-entrances')
@UseGuards(JwtGuard)
@Controller('parking-entrances')
export class ParkingEntranceController {
  constructor(private parkingEntranceService: ParkingEntranceService) {}

  @ApiOperation({ summary: 'Fetch all parking entrances' })
  @Get()
  fetchAll() {
    return this.parkingEntranceService.fetchAll();
  }

  @ApiOperation({ summary: 'Create a new entrance' })
  @Post()
  createEntrance(@Body() body: ParkingEntranceDto) {
    return this.parkingEntranceService.createEntrance(body);
  }

  @ApiOperation({ summary: 'Update name of parking entrance' })
  @Patch(':id')
  updateEntrance(@Param('id') id: string, @Body() body: ParkingEntranceDto) {
    return this.parkingEntranceService.updateEntrance(id, body);
  }
}
