import { Account } from '@prisma/client';
import { AccountDTO } from '../dto/account.dto';

interface IProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountDomain {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromRaw(accountRaw: Account): AccountDomain {
    return new AccountDomain({
      id: accountRaw.id,
      createdAt: accountRaw.createdAt,
      updatedAt: accountRaw.updatedAt,
    });
  }

  toDTO(): AccountDTO {
    return new AccountDTO({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
