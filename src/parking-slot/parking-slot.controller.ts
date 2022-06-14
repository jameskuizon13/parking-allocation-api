import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { ParkingSlotDto } from './dto';

@ApiBearerAuth()
@ApiTags('parking-slot')
@UseGuards(JwtGuard)
@Controller('parking-slot')
export class ParkingSlotController {
  @Post()
  createParkingSlot(@Body() body: ParkingSlotDto) {
    return body;
  }
}
