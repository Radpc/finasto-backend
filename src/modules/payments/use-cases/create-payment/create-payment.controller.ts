import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentService } from './create-payment.service';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('payments')
@ApiTags('Payment')
export class CreatePaymentController {
  constructor(private readonly createPaymentService: CreatePaymentService) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Req() request: AuthorizedRequest,
    @Body() createPaymentDto: CreatePaymentDTO,
  ) {
    const requesterId = request.user.id;
    const res = await this.createPaymentService.execute({
      familyId,
      payload: createPaymentDto,
      requesterId,
    });
    return res.toDTO();
  }
}
