import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { ParkingSlotDto } from './dto';
import { ParkingSlotService } from './parking-slot.service';

@ApiBearerAuth()
@ApiTags('parking-slot')
@UseGuards(JwtGuard)
@Controller('parking-slot')
export class ParkingSlotController {
  constructor(private parkingSlotService: ParkingSlotService) {}

  @ApiOperation({
    summary:
      'Create a new parking slot. It may include creating a connection between an entrance and the slot',
  })
  @Post()
  createParkingSlot(@Body() body: ParkingSlotDto) {
    return this.parkingSlotService.addParkingSlot(body);
  }
}
