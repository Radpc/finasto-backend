import { PartialType } from '@nestjs/swagger';
import { CreateTagDTO } from './create-tag.dto';

export class UpdateTagDTO extends PartialType(CreateTagDTO) {}
