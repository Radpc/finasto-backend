import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/modules/user/domain/user.domain';

export type JwtUserPayload = {
  userId: string;
  role: UserRole;
};

@Injectable()
export class UserJwtService {
  private jwtSecret: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = configService.getOrThrow('JWT_USER_SECRET');
  }

  async verifyToken(token: string) {
    try {
      const payload: JwtUserPayload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid user credentials');
    }
  }

  async safeVerifyToken(token: string) {
    try {
      const payload: JwtUserPayload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      return payload;
    } catch {
      return;
    }
  }

  async encode(payload: JwtUserPayload) {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1d',
    });
  }
}
