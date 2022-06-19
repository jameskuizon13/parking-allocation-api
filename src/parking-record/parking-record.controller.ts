import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { CreateParkingRecordDto, ParkingRecordDto } from './dto';
import { ParkingRecordService } from './parking-record.service';

@ApiBearerAuth()
@ApiTags('parking-records')
@UseGuards(JwtGuard)
@Controller('parking-records')
export class ParkingRecordController {
  constructor(private parkingRecordService: ParkingRecordService) {}

  /**
   * Creates a parking record
   */
  @ApiOperation({ summary: 'Assign a parking slot to a user' })
  @ApiCreatedResponse({
    description: 'Created parking record and additional needed details',
    type: ParkingRecordDto,
  })
  @ApiBadRequestResponse({ description: 'No available parking slot' })
  @ApiNotFoundResponse({ description: 'Vehicle not found' })
  @Post()
  createParkingRecord(
    @Body() body: CreateParkingRecordDto,
  ): Promise<ParkingRecordDto> {
    return this.parkingRecordService.createParkingRecord(body);
  }
}
