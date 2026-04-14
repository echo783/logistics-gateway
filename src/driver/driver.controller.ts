import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { AuthUser } from '../auth/types/auth-user.type';

@Controller('drivers')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/shipments')
  getMyShipments(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.driverService.getDriverShipments(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.driverService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/shipments')
  getDriverShipments(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getDriverShipments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.getById(id);
  }
}
