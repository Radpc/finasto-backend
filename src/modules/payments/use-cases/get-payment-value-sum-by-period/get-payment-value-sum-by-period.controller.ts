import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { GetPaymentValueSumByPeriodService } from './get-payment-value-sum-by-period.service';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentValueSumByPeriodController {
  constructor(
    private readonly getPaymentValueSumByPeriodService: GetPaymentValueSumByPeriodService,
  ) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('value-sum-by-period')
  async handle(
    @Query() query: GetPaymentValueByPeriodQuery,
    @Req() req: UserRequest,
  ): ControllerResponse<{ gain: number; loss: number }> {
    const res = await this.getPaymentValueSumByPeriodService.execute({
      query,
      requester: req.requester,
    });
    return {
      data: res.data,
      message: 'Success',
    };
  }
}
