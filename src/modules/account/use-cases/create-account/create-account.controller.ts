import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateAccountDTO } from '../../dto/create-account.dto';
import { CreateAccountService } from './create-account.service';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('accounts')
@ApiTags('Account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  async handle(
    @Body() payload: CreateAccountDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<AccountDTO> {
    const result = await this.createAccountService.execute({
      payload,
      requesterId: req.user.id,
    });

    return {
      data: result.data.toDTO(),
      message: 'Success',
    };
  }
}
