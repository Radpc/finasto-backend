import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { RemovePaymentService } from './remove-payment.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('payments')
@ApiTags('Payment')
export class RemovePaymentController {
  constructor(private readonly deletePaymentService: RemovePaymentService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Delete('/:paymentId')
  async handle(
    @Param('paymentId') paymentId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.deletePaymentService.execute({
      paymentId,
      requesterId: req.user.id,
    });
    return res.toDTO();
  }
}
