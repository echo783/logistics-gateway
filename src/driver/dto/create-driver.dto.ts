import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  driverName!: string;

  @IsString()
  @IsNotEmpty()
  driverPhone!: string;

  @IsString()
  @IsNotEmpty()
  vehicleNo!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
