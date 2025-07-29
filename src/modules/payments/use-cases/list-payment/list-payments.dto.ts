import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../../domain/payment.domain';

export class GetPaymentsParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 1, required: true })
  page: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 1, required: true })
  pageSize: number;

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
  @IsNumber()
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
}
