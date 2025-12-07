import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepo: UserRepoService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_USER_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserDTO> {
    const user = await this.userRepo.getUser({ where: { id: payload.id } });
    if (!user)
      throw new UnauthorizedException(
        'User account deactivated or updated. Please authenticate again.',
      );

    return user.toDTO();
  }
}
