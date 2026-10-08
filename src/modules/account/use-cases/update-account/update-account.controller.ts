import { Body, Controller, Param, Put } from '@nestjs/common';
import { ControllerResponse } from 'src/types/response';
import { AccountDTO } from '../../dto/account.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAccountDTO } from '../../dto/update-account.dto';
import { UpdateAccountService } from './update-account.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('accounts')
@ApiTags('Account')
export class UpdateAccountController {
  constructor(private readonly updateAccountService: UpdateAccountService) {}

  @Put(':accountId')
  async handle(
    @FamilyId() familyId: string,
    @Param('accountId') accountId: string,
    @Body() payload: UpdateAccountDTO,
  ): ControllerResponse<AccountDTO> {
    const result = await this.updateAccountService.execute({
      familyId,
      payload,
      accountId: accountId,
    });

    return result.toDTO();
  }
}
