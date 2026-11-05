import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { AccountDTO } from '../../dto/account.dto';
import { ListAccountsQuery } from './list-accounts.dto';
import { ListAccountsService } from './list-accounts.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class ListAccountController {
  constructor(private readonly listAccountsService: ListAccountsService) {}

  @Get()
  async handle(
    @Query() listAccountQuery: ListAccountsQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaginatedResponse<AccountDTO>> {
    const result = await this.listAccountsService.execute({
      query: listAccountQuery,
      requesterId: req.user.id,
    });

    return toPage(
      result.data.map((r) => r.toDTO()),
      result.total,
      listAccountQuery,
    );
  }
}
