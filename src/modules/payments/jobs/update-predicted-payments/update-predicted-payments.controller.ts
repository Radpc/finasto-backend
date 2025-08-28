import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/modules/jwt/user-jwt/user.guard';
import { UpdatePredictedPaymentsService } from './update-predicted-payments.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('jobs')
@ApiTags('Job')
export class UpdatePredictedPaymentsController {
  constructor(
    private readonly updatePredictedPaymentsService: UpdatePredictedPaymentsService,
  ) {}

  @Post('/update-predicted-payments')
  async handle() {
    await this.updatePredictedPaymentsService.execute();
    return { data: null, message: 'Job executed' };
  }
}
