import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString } from 'class-validator';
import { PaginatedQuery } from 'src/types/paginated-dto';

export class ListTimeBudgetsQuery extends PaginatedQuery {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Meu texto',
    required: false,
  })
  searchBy?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: false,
  })
  since?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    required: false,
  })
  until?: string;
}
