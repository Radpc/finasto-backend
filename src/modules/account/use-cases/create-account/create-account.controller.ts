import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDTO } from '../../dto/create-account.dto';
import { CreateAccountService } from './create-account.service';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('accounts')
@ApiTags('Account')
export class CreateAccountController {
  constructor(private readonly createAccountService: CreateAccountService) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Body() payload: CreateAccountDTO,
  ): ControllerResponse<AccountDTO> {
    const result = await this.createAccountService.execute({
      familyId,
      payload,
    });

    return result.toDTO();
  }
}
