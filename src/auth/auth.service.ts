import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { driverPhone: dto.driverPhone },
    });

    if (!driver) {
      throw new UnauthorizedException(
        '전화번호 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const isMatch = await bcrypt.compare(dto.password, driver.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException(
        '전화번호 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    if (!driver.isActive) {
      throw new UnauthorizedException('비활성 기사 계정입니다.');
    }

    const payload = {
      sub: driver.id,
      driverId: driver.id,
      driverName: driver.driverName,
      driverPhone: driver.driverPhone,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      driver: {
        id: driver.id,
        driverName: driver.driverName,
        driverPhone: driver.driverPhone,
        vehicleNo: driver.vehicleNo,
      },
    };
  }

  async validateUser(driverId: number) {
    return this.prisma.driver.findUnique({
      where: { id: driverId },
      select: {
        id: true,
        driverName: true,
        driverPhone: true,
        vehicleNo: true,
        isActive: true,
      },
    });
  }
}
