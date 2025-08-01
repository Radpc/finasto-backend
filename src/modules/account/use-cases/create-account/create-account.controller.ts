import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateAccountDTO } from '../../dto/create-account.dto';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { CreateAccountService } from './create-account.service';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  async handle(
    @Body() payload: CreateAccountDTO,
    @Req() req: UserRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.createAccountService.execute({
      payload,
      requesterId: req.jwtPayload.userId,
    });

    return {
      data: result.data.toDTO(),
      message: 'Success',
    };
  }
}
