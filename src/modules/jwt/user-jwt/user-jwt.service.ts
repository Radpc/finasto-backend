import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from 'src/modules/user/dto/user.dto';

@Injectable()
export class UserJwtService {
  private jwtSecret: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = configService.getOrThrow('JWT_USER_SECRET');
  }

  async encodeJWT(payload: UserDTO) {
    const { id, name, email, role } = payload;

    return this.jwtService.sign(
      { id, name, email, role },
      {
        secret: this.jwtSecret,
        expiresIn: '1d',
      },
    );
  }
}
