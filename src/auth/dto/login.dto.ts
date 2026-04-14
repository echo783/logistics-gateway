import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  driverPhone!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}
