import { Body, Controller, Param, Patch } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { UpdatePaymentService } from './update-payment.service';
import { UpdatePaymentDTO } from '../../dto/update-payment.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('payments')
@ApiTags('Payment')
export class UpdatePaymentController {
  constructor(private readonly updatePaymentService: UpdatePaymentService) {}

  @FamilyScoped()
  @Patch('/:paymentId')
  async handle(
    @FamilyId() familyId: string,
    @Body() payload: UpdatePaymentDTO,
    @Param('paymentId') paymentId: string,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.updatePaymentService.execute({
      familyId,
      paymentId,
      payload,
    });
    return res.toDTO();
  }
}
