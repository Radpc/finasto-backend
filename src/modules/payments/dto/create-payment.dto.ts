import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../domain/payment.domain';
import { Transform } from 'class-transformer';

export class CreatePaymentDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'Compras' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 75.8 })
  value: number;

  @IsNotEmpty()
  @IsNumber()
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
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @ApiProperty({
    type: String,
    isArray: true,
    example: '[]',
    required: false,
  })
  tagIds?: string[];
}
