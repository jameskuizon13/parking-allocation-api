import { UseGuards, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { ParkingSlotTypeService } from './parking-slot-type.service';

@ApiBearerAuth()
@ApiTags('parking-slot-types')
@UseGuards(JwtGuard)
@Controller('parking-slot-types')
export class ParkingSlotTypeController {
  constructor(private parkingSlotTypeService: ParkingSlotTypeService) {}

  @ApiOperation({ summary: 'Fetch list of parking slot types' })
  @Get()
  fetchAll() {
    return this.parkingSlotTypeService.fetchAll();
  }
}
