import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { CreateTimeBudgetDTO } from '../../dto/create-time-budget.dto';
import { CreateTimeBudgetService } from './create-time-budget.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budgets')
export class CreateTimeBudgetController {
  constructor(
    private readonly createTimeBudgetService: CreateTimeBudgetService,
  ) {}

  @Post()
  async handle(
    @Req() request: UserRequest,
    @Body() createTimeBudgetDTO: CreateTimeBudgetDTO,
  ) {
    const res = await this.createTimeBudgetService.execute({
      payload: createTimeBudgetDTO,
      requester: request.requester,
    });
    return { data: res.data.toDTO(), message: 'Payment created' };
  }
}
