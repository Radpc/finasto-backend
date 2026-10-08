export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

/** What a controller returns; the EnvelopeInterceptor sends it as `{ data }`. */
export type ControllerResponse<T> = Promise<T>;
