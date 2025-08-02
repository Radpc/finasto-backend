import { FamilyDTO } from 'src/modules/family/dto/family.dto';
import { UserRole } from '../domain/user.domain';

interface IProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  families?: FamilyDTO[];
}

export class UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  families?: FamilyDTO[];

  constructor(props: IProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.families = props.families;
  }
}
