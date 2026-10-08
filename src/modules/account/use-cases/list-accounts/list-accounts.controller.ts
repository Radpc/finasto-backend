import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { AccountDTO } from '../../dto/account.dto';
import { ListAccountsQuery } from './list-accounts.dto';
import { ListAccountsService } from './list-accounts.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('accounts')
@ApiTags('Account')
export class ListAccountController {
  constructor(private readonly listAccountsService: ListAccountsService) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() listAccountQuery: ListAccountsQuery,
  ): ControllerResponse<PaginatedResponse<AccountDTO>> {
    const result = await this.listAccountsService.execute({
      familyId,
      query: listAccountQuery,
    });

    return toPage(
      result.data.map((r) => r.toDTO()),
      result.total,
      listAccountQuery,
    );
  }
}
