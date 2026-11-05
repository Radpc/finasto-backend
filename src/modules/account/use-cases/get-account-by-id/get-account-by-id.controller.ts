import { Controller, Get, Param } from '@nestjs/common';
import { GetAccountByIdService } from './get-account-by-id.service';
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
export class GetAccountByIdController {
  constructor(private readonly getAccountByIdService: GetAccountByIdService) {}

  @Get(':accountId')
  async handle(
    @FamilyId() familyId: string,
    @Param('accountId') accountId: string,
  ): ControllerResponse<AccountDTO> {
    const result = await this.getAccountByIdService.execute({
      familyId,
      accountId: accountId,
    });

    return result.toDTO();
  }
}
