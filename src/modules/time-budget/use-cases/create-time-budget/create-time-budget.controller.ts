import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTimeBudgetDTO } from '../../dto/create-time-budget.dto';
import { CreateTimeBudgetService } from './create-time-budget.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('time-budgets')
@ApiTags('Time budgets')
export class CreateTimeBudgetController {
  constructor(
    private readonly createTimeBudgetService: CreateTimeBudgetService,
  ) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Req() request: AuthorizedRequest,
    @Body() createTimeBudgetDTO: CreateTimeBudgetDTO,
  ) {
    const res = await this.createTimeBudgetService.execute({
      familyId,
      payload: createTimeBudgetDTO,
      requester: request.user,
    });
    return res.toDTO();
  }
}
