import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentStatus } from '@prisma/client';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';

@Injectable()
export class ShipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.shipment.findMany({
      include: {
        assignedDriver: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async create(dto: CreateShipmentDto) {
    return this.prisma.shipment.create({
      data: dto,
    });
  }

  async getByShipmentNo(shipmentNo: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentNo },
      include: {
        assignedDriver: true,
      },
    });
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }
    return shipment;
  }

  async updateShipmentNoStatus(
    shipmentNo: string,
    dto: UpdateShipmentStatusDto,
    changedBy: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
        where: { shipmentNo },
      });

      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }

      const currentStatus = shipment.currentStatus;
      const nextStatus = dto.currentStatus;

      const canChange = this.canChangeStatus(currentStatus, nextStatus);

      if (!canChange) {
        throw new BadRequestException(
          `상태 변경 불가: ${currentStatus} -> ${nextStatus}`,
        );
      }

      const shouldReleaseDriver =
        (nextStatus === ShipmentStatus.DELIVERED ||
          nextStatus === ShipmentStatus.CANCELLED) &&
        shipment.assignedDriverId;

      if (shouldReleaseDriver) {
        const assignedDriver = await tx.driver.findUnique({
          where: { id: shipment.assignedDriverId! },
        });

        if (assignedDriver && assignedDriver.currentWorkload > 0) {
          await tx.driver.update({
            where: { id: shipment.assignedDriverId! },
            data: {
              currentWorkload: {
                decrement: 1,
              },
            },
          });
        }
      }

      await tx.shipmentStatusHistory.create({
        data: {
          shipmentNo,
          fromStatus: currentStatus,
          toStatus: nextStatus,
          changedBy,
          reason: dto.reason,
        },
      });

      return tx.shipment.update({
        where: { shipmentNo },
        data: {
          currentStatus: nextStatus,
        },
        include: {
          assignedDriver: true,
        },
      });
    });
  }
  private canChangeStatus(
    currentStatus: ShipmentStatus,
    nextStatus: ShipmentStatus,
  ): boolean {
    const allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      [ShipmentStatus.REQUESTED]: [
        ShipmentStatus.READY,
        ShipmentStatus.CANCELLED,
      ],
      [ShipmentStatus.READY]: [
        ShipmentStatus.IN_TRANSIT,
        ShipmentStatus.CANCELLED,
      ],
      [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED],
      [ShipmentStatus.DELIVERED]: [],
      [ShipmentStatus.CANCELLED]: [],
    };
    return allowedTransitions[currentStatus].includes(nextStatus);
  }

  async getHistory(shipmentNo: string) {
    return this.prisma.shipmentStatusHistory.findMany({
      where: { shipmentNo },
      orderBy: { changedAt: 'desc' },
      select: {
        fromStatus: true,
        toStatus: true,
        changedAt: true,
      },
    });
  }

  async assignDriver(shipmentNo: string, driverId: number) {
    return this.prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
        where: { shipmentNo },
      });
      if (!shipment) {
        throw new NotFoundException('Shipment not found');
      }

      const driver = await tx.driver.findUnique({
        where: { id: driverId },
      });
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
      if (!driver.isActive) {
        throw new BadRequestException('비활성 기사에게 배정할 수 없습니다.');
      }
      if (shipment.currentStatus !== ShipmentStatus.READY) {
        throw new BadRequestException(
          'READY 상태의 배송만 기사 배정이 가능합니다.',
        );
      }
      const previousDriverId = shipment.assignedDriverId;
      if (previousDriverId === driverId) {
        throw new BadRequestException('이미 배정된 기사입니다.');
      }
      if (previousDriverId) {
        await tx.driver.update({
          where: { id: previousDriverId },
          data: {
            currentWorkload: {
              decrement: 1,
            },
          },
        });
      }
      await tx.driver.update({
        where: { id: driverId },
        data: {
          currentWorkload: {
            increment: 1,
          },
        },
      });

      await tx.shipmentAssignHistory.create({
        data: {
          shipmentNo,
          fromDriverId: previousDriverId,
          toDriverId: driverId,
        },
      });

      return tx.shipment.update({
        where: { shipmentNo },
        data: {
          assignedDriverId: driverId,
        },
        include: {
          assignedDriver: true,
        },
      });
    });
  }

  async getAssignHistory(shipmentNo: string) {
    return this.prisma.shipmentAssignHistory.findMany({
      where: { shipmentNo },
      orderBy: { assignedAt: 'desc' },
    });
  }
}
