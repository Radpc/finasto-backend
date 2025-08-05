import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { PaymentMethod } from 'src/modules/payments/domain/payment.domain';

export class CreateRecurringPaymentDTO {
  @IsUUID()
  @ApiProperty()
  accountId: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  startDateFrom?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'Compras' })
  description: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.Cash })
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 75.8 })
  totalValue: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 75.8 })
  singlePaymentValue: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  @ApiProperty({ example: 6 })
  numberOfInstallments?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 75.8 })
  dayOfMonth: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  automaticPayment: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 1 })
  categoryId: string;

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
