import { IsString, IsNumber } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  shipmentNo!: string;

  @IsString()
  itemName!: string;

  @IsNumber()
  quantity!: number;

  @IsString()
  companyName!: string;

  @IsString()
  companyCode!: string;

  @IsString()
  destination!: string;

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;
}
