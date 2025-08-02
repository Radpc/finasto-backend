import { compare } from 'bcryptjs';
import { Family, User } from '@prisma/client';
import { UserDTO } from '../dto/user.dto';
import { FamilyDomain } from 'src/modules/family/domain/family.domain';

export enum UserRole {
  FamilyHead = 'familyHead',
  FamilyMember = 'familyMember',
}

interface IProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  families?: FamilyDomain[];
}

type UserWithIncludes = User & {
  families?: Family[];
};

export class UserDomain {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  private password: string;
  createdAt: Date;
  updatedAt: Date;

  families?: FamilyDomain[];

  constructor(props: IProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.password = props.password;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.families = props.families;
  }

  static fromRaw(rawUser: UserWithIncludes) {
    return new UserDomain({
      id: rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      role: rawUser.role as UserRole,
      password: rawUser.password,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
      families: rawUser.families
        ? rawUser.families.map(FamilyDomain.fromRaw)
        : undefined,
    });
  }

  isPasswordValid(passwordToCheck: string) {
    return compare(passwordToCheck, this.password);
  }

  toDTO() {
    return new UserDTO({
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),

      families: this.families?.map((f)=>f.toDTO());
    });
  }
}
