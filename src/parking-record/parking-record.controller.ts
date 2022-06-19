import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import {
  CreateParkingRecordDto,
  ManualUpdateParkingRecordDto,
  ParkingRecordDto,
} from './dto';
import { ParkingRecordService } from './parking-record.service';

@ApiBearerAuth()
@ApiTags('parking-records')
@UseGuards(JwtGuard)
@Controller('parking-records')
export class ParkingRecordController {
  constructor(private parkingRecordService: ParkingRecordService) {}

  @ApiOperation({ summary: 'Fetch a particular parking record' })
  @ApiNotFoundResponse({ description: 'Parking record not found' })
  @Get(':id')
  fetchParkingRecord(@Param('id') id: string) {
    return this.parkingRecordService.fetchParkingRecord(id);
  }

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

  @ApiOperation({ summary: 'Unpark vehicle' })
  @ApiResponse({ description: 'The parking record' })
  @ApiNotFoundResponse({ description: 'Parking record not found' })
  @ApiBadRequestResponse({ description: 'Vehicle has already unparked' })
  @Patch(':id')
  unpark(@Param('id') id: string) {
    return this.parkingRecordService.unpark(id);
  }

  @ApiOperation({
    summary:
      'Manual setting of unparking time. For demostaration or testing purposes',
  })
  @ApiResponse({ description: 'The parking record' })
  @ApiNotFoundResponse({ description: 'Parking record not found' })
  @ApiBadRequestResponse({ description: 'Vehicle has already unparked' })
  @Patch(':id/manual')
  manualUnparkParkingRecord(
    @Param('id') id: string,
    @Body() body: ManualUpdateParkingRecordDto,
  ) {
    return this.parkingRecordService.manualUnpark(id, body);
  }
}
