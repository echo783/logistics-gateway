import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AssignDriverDto {
  @Type(() => Number)
  @IsInt()
  driverId!: number;
}
