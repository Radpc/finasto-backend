import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { GetPaymentByIdService } from './get-payment-by-id.service';

@Controller('payments')
@ApiTags('Payment')
export class UpdatePaymentController {
  constructor(private readonly getPaymentByIdService: GetPaymentByIdService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('/:paymentId')
  async handle(
    @Param('paymentId') paymentId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.getPaymentByIdService.execute({
      paymentId,
      requester: req.requester,
    });
    return {
      data: res.data.toDTO(),
      message: 'Success',
    };
  }
}
