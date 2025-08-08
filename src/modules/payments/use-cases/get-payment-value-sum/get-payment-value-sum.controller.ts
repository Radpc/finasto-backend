import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { GetPaymentValueSumService } from './get-payment-value-sum.service';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentValueSumController {
  constructor(
    private readonly getPaymentValueSumService: GetPaymentValueSumService,
  ) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('value-sum')
  async handle(
    @Query() query: GetPaymentValueQuery,
    @Req() req: UserRequest,
  ): ControllerResponse<{ gain: number; loss: number }> {
    const res = await this.getPaymentValueSumService.execute({
      query,
      requester: req.requester,
    });
    return {
      data: res.data,
      message: 'Success',
    };
  }
}
