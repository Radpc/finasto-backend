import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ListPaymentsService } from './list-payments.service';
import { ListPaymentsQuery } from './list-payments.dto';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('payments')
@ApiTags('Payment')
@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class ListPaymentsController {
  constructor(private readonly listPaymentsService: ListPaymentsService) {}

  @Get()
  async handle(
    @Query() query: ListPaymentsQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaginatedResponse<PaymentDTO>> {
    const { data, total } = await this.listPaymentsService.execute({
      query,
      requesterId: req.user.id,
    });
    return {
      data: {
        items: data.map((d) => d.toDTO()),
        pagination: { page: query.page, total: total },
      },
      message: 'Success',
    };
  }
}
