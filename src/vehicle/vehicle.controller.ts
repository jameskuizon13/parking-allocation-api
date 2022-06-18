import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Vehicle } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { CreateVehicleDto, FetchAllVehicleDto } from './dto';
import { VehicleService } from './vehicle.service';

@ApiBearerAuth()
@ApiTags('vehicles')
@UseGuards(JwtGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @ApiOperation({
    summary:
      'Fetch all vehicles. You can also add filters to its search results',
  })
  @ApiOkResponse({ description: 'The list of vehicles' })
  @Get()
  fetchAll(@Query() query: FetchAllVehicleDto): Promise<Vehicle[]> {
    return this.vehicleService.fetchAll(query);
  }

  @ApiOperation({
    summary: 'Fetch vehicle details based on its id',
  })
  @ApiOkResponse({ description: 'The vehicle details' })
  @ApiNotFoundResponse({ description: 'Vehicle not found' })
  @Get('/:id')
  fetch(@Param('id') id: string): Promise<Vehicle> {
    return this.vehicleService.fetchOne(id);
  }

  @ApiOperation({
    summary: 'Create a vehicle',
  })
  @ApiCreatedResponse({ description: 'The vehicle created' })
  @ApiBadRequestResponse({ description: 'Vehicle registration error' })
  @Post()
  createVehicle(@Body() body: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.createVehicle(body);
  }
}
