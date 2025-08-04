import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { GetAccountByIdService } from './get-account-by-id.service';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class GetAccountByIdController {
  constructor(private readonly getAccountByIdService: GetAccountByIdService) {}

  @Get(':accountId')
  async handle(
    @Param('accountId') accountId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.getAccountByIdService.execute({
      accountId: accountId,
      requesterId: req.requester.userId,
    });

    return { data: result.data.toDTO(), message: 'Success' };
  }
}
