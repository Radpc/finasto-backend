import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export const MAX_PAGE_SIZE = 100;

export class PaginatedQuery {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ type: Number, example: 1, required: true, minimum: 1 })
  page: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @ApiProperty({
    type: Number,
    example: 20,
    required: true,
    minimum: 1,
    maximum: MAX_PAGE_SIZE,
  })
  pageSize: number;
}
