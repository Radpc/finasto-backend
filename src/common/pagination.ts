import { PaginatedQuery } from 'src/types/paginated-dto';
import { PaginatedResponse } from 'src/types/response';

/** Prisma `skip`/`take` for a page query. */
export const pageArgs = ({ page, pageSize }: PaginatedQuery) => ({
  skip: pageSize * (page - 1),
  take: pageSize,
});

/** The response body for one page of a list. */
export const toPage = <T>(
  items: T[],
  total: number,
  { page, pageSize }: PaginatedQuery,
): PaginatedResponse<T> => ({
  items,
  pagination: { page, pageSize, total },
});
