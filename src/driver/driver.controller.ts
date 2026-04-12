import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('drivers')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  getAll() {
    return this.driverService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getById(id);
  }

  @Get(':id/shipments')
  getDriverShipments(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getDriverShipments(id);
  }
}
