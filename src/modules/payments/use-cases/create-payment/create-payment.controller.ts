import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePaymentService } from './create-payment.service';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('payments')
@ApiTags('Payment')
export class CreatePaymentController {
  constructor(private readonly createPaymentService: CreatePaymentService) {}

  @Post()
  async handle(
    @Req() request: UserRequest,
    @Body() createPaymentDto: CreatePaymentDTO,
  ) {
    const requesterId = request.requester.userId;
    const res = await this.createPaymentService.execute({
      payload: createPaymentDto,
      requesterId,
    });
    return { data: res.data.toDTO(), message: 'Payment created' };
  }
}
