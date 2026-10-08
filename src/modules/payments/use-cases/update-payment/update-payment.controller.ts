import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { UpdatePaymentService } from './update-payment.service';
import { UpdatePaymentDTO } from '../../dto/update-payment.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('payments')
@ApiTags('Payment')
export class UpdatePaymentController {
  constructor(private readonly updatePaymentService: UpdatePaymentService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Patch('/:paymentId')
  async handle(
    @Body() payload: UpdatePaymentDTO,
    @Param('paymentId') paymentId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaymentDTO> {
    const res = await this.updatePaymentService.execute({
      paymentId,
      payload,
      requester: req.user,
    });
    return res.toDTO();
  }
}
