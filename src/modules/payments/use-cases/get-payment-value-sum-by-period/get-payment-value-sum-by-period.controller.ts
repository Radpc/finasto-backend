import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { GetPaymentValueSumByPeriodService } from './get-payment-value-sum-by-period.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

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

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get('value-sum-by-period')
  async handle(
    @Query() query: GetPaymentValueByPeriodQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<{ from: Date; total: number }[]> {
    const res = await this.getPaymentValueSumByPeriodService.execute({
      query,
      requester: req.user,
      timezone: getTimezoneFromISO(query.since) || '+00:00',
    });
    return res;
  }
}
