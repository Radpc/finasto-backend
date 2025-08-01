import { Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ListAccountsQuery } from './list-accounts.dto';
import { ListAccountsService } from './list-accounts.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class ListAccountController {
  constructor(private readonly listAccountsService: ListAccountsService) {}

  @Post()
  async handle(
    @Query() listAccountQuery: ListAccountsQuery,
    @Req() req: UserRequest,
  ): ControllerResponse<PaginatedResponse<AccountDTO>> {
    const result = await this.listAccountsService.execute({
      query: listAccountQuery,
      requesterId: req.jwtPayload.userId,
    });

    return {
      message: 'Success',
      data: {
        items: result.data.map((r) => r.toDTO()),
        pagination: { page: listAccountQuery.page, total: result.total },
      },
    };
  }
}
