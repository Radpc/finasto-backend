import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../domain/payment.domain';

export class CreatePaymentDTO {
  @IsUUID()
  @ApiProperty()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'Compras' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 75.8 })
  value: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 1 })
  categoryId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'Podemos economizar com isso..' })
  observation?: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.Paid })
  status: PaymentStatus;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.Cash })
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: new Date().toISOString() })
  paymentDate: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @ApiProperty({
    type: String,
    isArray: true,
    example: '[]',
    required: false,
  })
  tagIds?: string[];
}
