import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  getAll() {
    return this.shipmentService.getAll();
  }

  @Post()
  create(@Body() dto: CreateShipmentDto) {
    return this.shipmentService.create(dto);
  }

  @Get(':shipmentNo')
  getByShipmentNo(@Param('shipmentNo') shipmentNo: string) {
    return this.shipmentService.getByShipmentNo(shipmentNo);
  }

  @Patch(':shipmentNo/status')
  updateShipmentNoStatus(
    @Param('shipmentNo') shipmentNo: string,
    @Body() dto: UpdateShipmentStatusDto,
  ) {
    console.log('=== updateShipmentNoStatus called ===', shipmentNo);
    return this.shipmentService.updateShipmentNoStatus(shipmentNo, dto);
  }

  @Get(':shipmentNo/history')
  getShipmentHistory(@Param('shipmentNo') shipmentNo: string) {
    return this.shipmentService.getHistory(shipmentNo);
  }

  @Patch(':shipmentNo/assign-driver')
  assignDriver(
    @Param('shipmentNo') shipmentNo: string,
    @Body() dto: AssignDriverDto,
  ) {
    return this.shipmentService.assignDriver(shipmentNo, dto.driverId);
  }

  @Get(':shipmentNo/assign-history')
  getAssignHistory(@Param('shipmentNo') shipmentNo: string) {
    return this.shipmentService.getAssignHistory(shipmentNo);
  }
}
