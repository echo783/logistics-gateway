import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ShipmentModule } from './shipment/shipment.module';
import { DriverModule } from './driver/driver.module';

@Module({
  imports: [PrismaModule, ShipmentModule, DriverModule],
})
export class AppModule {}
