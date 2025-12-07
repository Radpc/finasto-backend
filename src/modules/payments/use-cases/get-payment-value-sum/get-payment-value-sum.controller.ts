import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { GetPaymentValueSumService } from './get-payment-value-sum.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentValueSumController {
  constructor(
    private readonly getPaymentValueSumService: GetPaymentValueSumService,
  ) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get('value-sum')
  async handle(
    @Query() query: GetPaymentValueQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<{ gain: number; loss: number }> {
    const res = await this.getPaymentValueSumService.execute({
      query,
      requester: req.user,
    });
    return {
      data: res.data,
      message: 'Success',
    };
  }
}
