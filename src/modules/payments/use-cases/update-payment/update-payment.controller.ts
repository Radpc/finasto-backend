import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { UpdatePaymentService } from './update-payment.service';
import { UpdatePaymentDTO } from '../../dto/update-payment.dto';

@Controller('payments')
@ApiTags('Payment')
export class UpdatePaymentController {
  constructor(private readonly updatePaymentService: UpdatePaymentService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Patch('/:paymentId')
  async handle(
    @Body() payload: UpdatePaymentDTO,
    @Param('paymentId') paymentId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.updatePaymentService.execute({
      paymentId,
      payload,
      requester: req.requester,
    });
    return {
      data: res.data.toDTO(),
      message: 'Success',
    };
  }
}
