import { FamilyDTO } from 'src/modules/family/dto/family.dto';
import { UserRole } from '../domain/user.domain';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  families?: FamilyDTO[];
}
