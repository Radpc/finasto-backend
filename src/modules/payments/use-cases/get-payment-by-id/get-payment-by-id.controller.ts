import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { GetPaymentByIdService } from './get-payment-by-id.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentByIdController {
  constructor(private readonly getPaymentByIdService: GetPaymentByIdService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get('/:paymentId')
  async handle(
    @Param('paymentId') paymentId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.getPaymentByIdService.execute({
      paymentId,
      requester: req.user,
    });
    return {
      data: res.data.toDTO(),
      message: 'Success',
    };
  }
}
