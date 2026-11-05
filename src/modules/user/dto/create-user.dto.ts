import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../domain/user.domain';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt ignores bytes beyond 72
  password: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    required: false,
    description:
      'Deprecated: send the X-Family-Id header instead. If both are sent they must match.',
  })
  familyId?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
