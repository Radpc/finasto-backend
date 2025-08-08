import { OmitType } from '@nestjs/swagger';
import { ListPaymentsQuery } from '../list-payment/list-payments.dto';

export class GetPaymentValueQuery extends OmitType(ListPaymentsQuery, [
  'page',
  'pageSize',
]) {}
