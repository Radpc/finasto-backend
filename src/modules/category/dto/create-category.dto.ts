import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Compras' })
  label: string;

  @IsUUID()
  @ApiProperty()
  familyId: string;
}
