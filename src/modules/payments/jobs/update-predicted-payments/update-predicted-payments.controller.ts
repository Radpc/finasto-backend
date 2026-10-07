import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { UpdatePredictedPaymentsService } from './update-predicted-payments.service';
import { JobsTokenGuard } from 'src/common/guards/jobs-token.guard';

@UseGuards(JobsTokenGuard)
@ApiHeader({ name: 'x-jobs-token', required: true })
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
