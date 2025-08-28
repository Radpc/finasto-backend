import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../domain/payment.domain';
import { PaginatedQuery } from 'src/types/paginated-dto';

export class ListPaymentsQuery extends PaginatedQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 10, required: false })
  minValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 10, required: false })
  maxValue?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: false,
  })
  since?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: false,
  })
  until?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ type: String, required: false })
  categoryId?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.Paid,
    required: false,
  })
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.Credit,
    required: false,
  })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Meu texto',
    required: false,
  })
  searchBy?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(String) : [String(value)],
  )
  @IsArray()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  tagIds?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  familyId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  recurringPaymentId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  accountId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({ required: false })
  hasRecurringPayment?: boolean;
}
