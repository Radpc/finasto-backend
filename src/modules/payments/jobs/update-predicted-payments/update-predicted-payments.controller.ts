import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePredictedPaymentsService } from './update-predicted-payments.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';

@UseGuards(ApiKeyAndJwtGuard)
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
