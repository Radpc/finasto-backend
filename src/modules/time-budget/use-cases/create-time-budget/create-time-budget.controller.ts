import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { CreateTimeBudgetDTO } from '../../dto/create-time-budget.dto';
import { CreateTimeBudgetService } from './create-time-budget.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budgets')
export class CreateTimeBudgetController {
  constructor(
    private readonly createTimeBudgetService: CreateTimeBudgetService,
  ) {}

  @Post()
  async handle(
    @Req() request: AuthorizedRequest,
    @Body() createTimeBudgetDTO: CreateTimeBudgetDTO,
  ) {
    const res = await this.createTimeBudgetService.execute({
      payload: createTimeBudgetDTO,
      requester: request.user,
    });
    return { data: res.data.toDTO(), message: 'Payment created' };
  }
}
