import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePaymentDTO } from './create-payment.dto';

export class UpdatePaymentDTO extends PartialType(
  OmitType(CreatePaymentDTO, ['accountId']),
) {}
