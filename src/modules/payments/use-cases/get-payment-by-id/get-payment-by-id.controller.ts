import { Controller, Get, Param } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { GetPaymentByIdService } from './get-payment-by-id.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentByIdController {
  constructor(private readonly getPaymentByIdService: GetPaymentByIdService) {}

  @FamilyScoped()
  @Get('/:paymentId')
  async handle(
    @FamilyId() familyId: string,
    @Param('paymentId') paymentId: string,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.getPaymentByIdService.execute({
      familyId,
      paymentId,
    });
    return res.toDTO();
  }
}
