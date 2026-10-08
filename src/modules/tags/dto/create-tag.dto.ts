import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTagDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    required: false,
    description:
      'Deprecated: send the X-Family-Id header instead. If both are sent they must match.',
  })
  familyId?: string;
}
