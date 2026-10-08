import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRecurringPaymentService } from './create-recurring-payment.service';
import { CreateRecurringPaymentDTO } from '../../dto/create-recurring-payment.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class CreateRecurringPaymentController {
  constructor(
    private readonly createRecurringPaymentService: CreateRecurringPaymentService,
  ) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Body() payload: CreateRecurringPaymentDTO,
    @Req() req: AuthorizedRequest,
  ) {
    const res = await this.createRecurringPaymentService.execute({
      familyId,
      payload,
      requester: req.user,
    });
    return res.toDTO();
  }
}
