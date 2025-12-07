import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAccountDTO } from '../../dto/update-account.dto';
import { UpdateAccountService } from './update-account.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class UpdateAccountController {
  constructor(private readonly updateAccountService: UpdateAccountService) {}

  @Put(':accountId')
  async handle(
    @Param('accountId') accountId: string,
    @Body() payload: UpdateAccountDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.updateAccountService.execute({
      payload,
      requesterId: req.user.id,
      accountId: accountId,
    });

    return {
      data: result.data.toDTO(),
      message: 'Success',
    };
  }
}
