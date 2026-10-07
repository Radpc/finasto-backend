import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedQuery } from 'src/types/paginated-dto';

export class ListTagsQuery extends PaginatedQuery {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'Meu texto',
    required: false,
  })
  searchBy?: string;
}
