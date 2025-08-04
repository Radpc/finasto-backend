import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { RemovePaymentService } from './remove-payment.service';

@Controller('payments')
@ApiTags('Payment')
export class RemovePaymentController {
  constructor(private readonly deletePaymentService: RemovePaymentService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Delete('/:paymentId')
  async handle(
    @Param('paymentId') paymentId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.deletePaymentService.execute({
      paymentId,
      requesterId: req.requester.userId,
    });
    return {
      data: res.toDTO(),
      message: 'Success',
    };
  }
}
