import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';

import { FetchParkingSlotDto, CreateParkingSlotDto } from './dto';

import { ParkingSlotService } from './parking-slot.service';

@ApiBearerAuth()
@ApiTags('parking-slots')
@UseGuards(JwtGuard)
@Controller('parking-slots')
export class ParkingSlotController {
  constructor(private parkingSlotService: ParkingSlotService) {}

  @ApiOperation({
    summary:
      'Fetch all parking slots. You can also add filters to its search results.',
  })
  @Get()
  fetchAll(@Query() query: FetchParkingSlotDto) {
    return this.parkingSlotService.fetchAll(query);
  }

  @ApiOperation({
    summary:
      'Creates a new parking slot. It may include creating a connection between an entrance and the slot',
  })
  @Post()
  createParkingSlot(@Body() body: CreateParkingSlotDto) {
    return this.parkingSlotService.createParkingSlot(body);
  }
}
