import { Account } from '@prisma/client';
import { AccountDTO } from '../dto/account.dto';

interface IProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountDomain {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromRaw(accountRaw: Account): AccountDomain {
    return new AccountDomain({
      id: accountRaw.id,
      name: accountRaw.name,
      createdAt: accountRaw.createdAt,
      updatedAt: accountRaw.updatedAt,
    });
  }

  toDTO(): AccountDTO {
    return new AccountDTO({
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
