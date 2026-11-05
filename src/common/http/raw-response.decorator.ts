import { SetMetadata } from '@nestjs/common';

export const RAW_RESPONSE = 'rawResponse';

/** Skips the `{ data }` envelope, for endpoints read by machines (health checks). */
export const RawResponse = () => SetMetadata(RAW_RESPONSE, true);
