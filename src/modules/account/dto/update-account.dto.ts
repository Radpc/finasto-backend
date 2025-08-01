import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAccountDTO } from './create-account.dto';

export class UpdateAccountDTO extends PartialType(
  OmitType(CreateAccountDTO, ['familyId']),
) {}
