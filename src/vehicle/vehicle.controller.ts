import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Vehicle } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { CreateVehicleDto } from './dto';
import { VehicleService } from './vehicle.service';

@ApiBearerAuth()
@ApiTags('vehicles')
@UseGuards(JwtGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Post()
  createVehicle(@Body() body: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.createOrFindVehicle(body);
  }
}
