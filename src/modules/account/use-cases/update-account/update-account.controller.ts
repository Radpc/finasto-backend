import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAccountDTO } from '../../dto/update-account.dto';
import { UpdateAccountService } from './update-account.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class UpdateAccountController {
  constructor(private readonly updateAccountService: UpdateAccountService) {}

  @Put(':accountId')
  async handle(
    @Param('accountId') accountId: string,
    @Body() payload: UpdateAccountDTO,
    @Req() req: UserRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.updateAccountService.execute({
      payload,
      requesterId: req.jwtPayload.userId,
      accountId: accountId,
    });

    return {
      data: result.data.toDTO(),
      message: 'Success',
    };
  }
}
