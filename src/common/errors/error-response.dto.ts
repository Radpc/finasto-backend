import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from './error-code';

export class ErrorResponseDTO {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ enum: ErrorCode, example: ErrorCode.NotFound })
  code: ErrorCode;

  @ApiProperty({ example: 'Not found' })
  message: string;

  @ApiProperty({
    required: false,
    description:
      'Extra data for some codes. VALIDATION_FAILED: [{ field, constraints }]',
  })
  details?: unknown;
}
