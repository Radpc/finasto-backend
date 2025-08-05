import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedQuery } from 'src/types/paginated-dto';

export class ListRecurringPaymentsQuery extends PaginatedQuery {
  @IsOptional()
  @IsString()
  @ApiProperty()
  accountId?: string;
}
