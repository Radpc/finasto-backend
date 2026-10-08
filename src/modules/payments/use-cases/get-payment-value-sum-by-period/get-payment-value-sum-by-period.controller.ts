import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { GetPaymentValueSumByPeriodService } from './get-payment-value-sum-by-period.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

function getTimezoneFromISO(isoDateString: string) {
  const parts = isoDateString.split('T');
  if (parts.length < 2) {
    return null; // Not a valid ISO 8601 datetime string
  }
  const timePart = parts[1];
  const timezoneMatch = timePart.match(/([Z+\-]\d{2}(:\d{2})?)$/);

  if (timezoneMatch && timezoneMatch[1]) {
    return timezoneMatch[1];
  } else {
    return null; // No explicit timezone information found
  }
}

@Controller('payments')
@ApiTags('Payment')
export class GetPaymentValueSumByPeriodController {
  constructor(
    private readonly getPaymentValueSumByPeriodService: GetPaymentValueSumByPeriodService,
  ) {}

  @FamilyScoped()
  @Get('value-sum-by-period')
  async handle(
    @FamilyId() familyId: string,
    @Query() query: GetPaymentValueByPeriodQuery,
  ): ControllerResponse<{ from: Date; total: number }[]> {
    const res = await this.getPaymentValueSumByPeriodService.execute({
      familyId,
      query,
      timezone: getTimezoneFromISO(query.since) || '+00:00',
    });
    return res;
  }
}
