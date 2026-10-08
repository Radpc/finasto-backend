import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { GetAccountByIdService } from './get-account-by-id.service';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class GetAccountByIdController {
  constructor(private readonly getAccountByIdService: GetAccountByIdService) {}

  @Get(':accountId')
  async handle(
    @Param('accountId') accountId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.getAccountByIdService.execute({
      accountId: accountId,
      requesterId: req.user.id,
    });

    return result.toDTO();
  }
}
