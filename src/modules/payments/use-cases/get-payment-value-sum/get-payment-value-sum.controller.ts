import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { GetPaymentValueSumService } from './get-payment-value-sum.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentValueSumController {
  constructor(
    private readonly getPaymentValueSumService: GetPaymentValueSumService,
  ) {}

  @FamilyScoped()
  @Get('value-sum')
  async handle(
    @FamilyId() familyId: string,
    @Query() query: GetPaymentValueQuery,
  ): ControllerResponse<{ gain: number; loss: number }> {
    const res = await this.getPaymentValueSumService.execute({
      familyId,
      query,
    });
    return res;
  }
}
