import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ListPaymentsQuery } from '../list-payment/list-payments.dto';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { DateTime } from 'luxon';

export enum PaymentValuePeriodType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export class GetPaymentValueByPeriodQuery extends OmitType(ListPaymentsQuery, [
  'page',
  'pageSize',
]) {
  @ApiProperty({ required: true, enum: PaymentValuePeriodType })
  @IsEnum(PaymentValuePeriodType)
  periodType: PaymentValuePeriodType;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: DateTime.now().startOf('month'),
    required: true,
  })
  since: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: DateTime.now().endOf('month'),
    required: true,
  })
  until: string;
}
