import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @MinLength(4)
  password!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
