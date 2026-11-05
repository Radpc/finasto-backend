import { Injectable } from '@nestjs/common';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';
import { CreateAccountDTO } from '../../dto/create-account.dto';
import { AccountDomain } from '../../domain/account.domain';

type Input = {
  familyId: string;
  payload: CreateAccountDTO;
};
type Output = AccountDomain;

@Injectable()
export class CreateAccountService {
  constructor(private readonly accountRepoService: AccountRepoService) {}

  async execute(input: Input): Promise<Output> {
    return this.accountRepoService.createAccount(input.familyId, {
      name: input.payload.name,
    });
  }
}
