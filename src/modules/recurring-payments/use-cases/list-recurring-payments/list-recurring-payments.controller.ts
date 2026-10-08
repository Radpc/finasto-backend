import { Controller, UseGuards, Req, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ListRecurringPaymentsService } from './list-recurring-payments.service';
import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import { toPage } from 'src/common/pagination';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class ListRecurringPaymentsController {
  constructor(
    private readonly listRecurringPaymentsService: ListRecurringPaymentsService,
  ) {}

  @Get()
  async handle(
    @Query() query: ListRecurringPaymentsQuery,
    @Req() req: AuthorizedRequest,
  ) {
    const { data, total } = await this.listRecurringPaymentsService.execute({
      requester: req.user,
      query,
    });
    return toPage(
      data.map((d) => d.toDTO()),
      total,
      query,
    );
  }
}
