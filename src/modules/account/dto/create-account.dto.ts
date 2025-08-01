import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUUID()
  familyId: string;
}
