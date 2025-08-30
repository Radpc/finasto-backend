import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ListPaymentsQuery } from '../list-payment/list-payments.dto';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum PaymentValuePeriodType {
  Weekly,
  Monthly,
  Yearly,
}

export class GetPaymentValueByPeriodQuery extends OmitType(ListPaymentsQuery, [
  'page',
  'pageSize',
]) {
  @ApiProperty({ required: false, enum: PaymentValuePeriodType })
  @IsEnum(PaymentValuePeriodType)
  periodType: PaymentValuePeriodType;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: true,
  })
  since: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: true,
  })
  until: string;
}
