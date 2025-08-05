import { Controller, UseGuards, Req, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ListRecurringPaymentsService } from './list-recurring-payments.service';
import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';

@UseGuards(UserGuard)
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
    @Req() req: UserRequest,
  ) {
    const {
      data: { data, total },
      message,
    } = await this.listRecurringPaymentsService.execute({
      requester: req.requester,
      query,
    });
    return {
      data: {
        items: data.map((d) => d.toDTO()),
        pagination: { page: query.page, total: total },
      },
      message,
    };
  }
}
