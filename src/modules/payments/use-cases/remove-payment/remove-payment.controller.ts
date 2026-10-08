import { Controller, Delete, Param } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { RemovePaymentService } from './remove-payment.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('payments')
@ApiTags('Payment')
export class RemovePaymentController {
  constructor(private readonly deletePaymentService: RemovePaymentService) {}

  @FamilyScoped()
  @Delete('/:paymentId')
  async handle(
    @FamilyId() familyId: string,
    @Param('paymentId') paymentId: string,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.deletePaymentService.execute({
      familyId,
      paymentId,
    });
    return res.toDTO();
  }
}
