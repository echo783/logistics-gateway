import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

export class UpdateShipmentStatusDto {
  @IsEnum(ShipmentStatus)
  currentStatus!: ShipmentStatus;

  @IsOptional()
  @IsString()
  changedBy?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
