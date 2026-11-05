import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePaymentService } from './create-payment.service';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('payments')
@ApiTags('Payment')
export class CreatePaymentController {
  constructor(private readonly createPaymentService: CreatePaymentService) {}

  @Post()
  async handle(
    @Req() request: AuthorizedRequest,
    @Body() createPaymentDto: CreatePaymentDTO,
  ) {
    const requesterId = request.user.id;
    const res = await this.createPaymentService.execute({
      payload: createPaymentDto,
      requesterId,
    });
    return res.toDTO();
  }
}
