import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    const exists = await this.prisma.driver.findFirst({
      where: {
        OR: [
          { driverPhone: createDriverDto.driverPhone },
          { vehicleNo: createDriverDto.vehicleNo },
        ],
      },
    });

    if (exists) {
      throw new BadRequestException(
        '이미 등록된 기사 전화번호 또는 차량번호 입니다.',
      );
    }

    const passwordHash = await bcrypt.hash(createDriverDto.password, 10);

    return this.prisma.driver.create({
      data: {
        driverName: createDriverDto.driverName,
        driverPhone: createDriverDto.driverPhone,
        vehicleNo: createDriverDto.vehicleNo,
        passwordHash,
        isActive: createDriverDto.isActive ?? true,
      },
      select: {
        id: true,
        driverName: true,
        driverPhone: true,
        vehicleNo: true,
        isActive: true,
        currentWorkload: true,
        createdAt: true,
      },
    });
  }

  async getAll() {
    return this.prisma.driver.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        driverName: true,
        driverPhone: true,
        vehicleNo: true,
        isActive: true,
        currentWorkload: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(id: number) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      select: {
        id: true,
        driverName: true,
        driverPhone: true,
        vehicleNo: true,
        currentWorkload: true,
        shipments: {
          select: {
            shipmentNo: true,
            currentStatus: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('해당 ID의 기사가 존재하지 않습니다.');
    }

    return driver;
  }

  async getDriverShipments(driverId: number) {
    return this.prisma.shipment.findMany({
      where: {
        assignedDriverId: driverId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
