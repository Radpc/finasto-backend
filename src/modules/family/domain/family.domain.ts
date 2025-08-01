import { Family } from '@prisma/client';
import { FamilyDTO } from '../dto/family.dto';

interface IProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FamilyDomain {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromRaw(familyRaw: Family): FamilyDomain {
    return new FamilyDomain({
      id: familyRaw.id,
      createdAt: familyRaw.createdAt,
      updatedAt: familyRaw.updatedAt,
    });
  }

  toDTO(): FamilyDTO {
    return new FamilyDTO({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
