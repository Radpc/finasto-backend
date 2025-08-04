import { Family } from '@prisma/client';
import { FamilyDTO } from '../dto/family.dto';

interface IProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FamilyDomain {
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

  static fromRaw(familyRaw: Family): FamilyDomain {
    return new FamilyDomain({
      id: familyRaw.id,
      name: familyRaw.name,
      createdAt: familyRaw.createdAt,
      updatedAt: familyRaw.updatedAt,
    });
  }

  toDTO(): FamilyDTO {
    return new FamilyDTO({
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
