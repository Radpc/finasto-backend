import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFamilyDTO {
  @ApiProperty()
  @IsString()
  name: string;
}
