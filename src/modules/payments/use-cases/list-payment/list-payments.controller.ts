import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ListPaymentsService } from './list-payments.service';
import { ListPaymentsQuery } from './list-payments.dto';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { PaymentDTO } from '../../dto/payment.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('payments')
@ApiTags('Payment')
@FamilyScoped()
export class ListPaymentsController {
  constructor(private readonly listPaymentsService: ListPaymentsService) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() query: ListPaymentsQuery,
  ): ControllerResponse<PaginatedResponse<PaymentDTO>> {
    const { data, total } = await this.listPaymentsService.execute({
      familyId,
      query,
    });
    return toPage(
      data.map((d) => d.toDTO()),
      total,
      query,
    );
  }
}
