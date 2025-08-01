import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListPaymentsService } from './list-payments.service';
import { ListPaymentsQuery } from './list-payments.dto';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { PaymentDTO } from '../../dto/payment.dto';

@Controller('payments')
@ApiTags('Payment')
export class ListPaymentsController {
  constructor(private readonly listPaymentsService: ListPaymentsService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get()
  async handle(
    @Query() query: ListPaymentsQuery,
    @Req() req: UserRequest,
  ): ControllerResponse<PaginatedResponse<PaymentDTO>> {
    const { data, total } = await this.listPaymentsService.execute({
      query,
      requesterId: req.jwtPayload.userId,
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
