import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth0Config, readAuth0Config } from 'src/config/auth0.config';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { Auth0UserService } from '../auth0/auth0-user.service';

/**
 * Accepts access tokens issued by Auth0 for the Finasto API.
 *
 * Tokens must be RS256, signed by a key published in the tenant's JWKS, and
 * carry the configured issuer and audience. When Auth0 is not configured the
 * strategy rejects every token, so the next strategy in the guard is tried.
 */
@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly auth0: Auth0Config | null;

  constructor(
    configService: ConfigService,
    private readonly auth0Users: Auth0UserService,
  ) {
    const auth0 = readAuth0Config({
      AUTH0_ISSUER_URL: configService.get('AUTH0_ISSUER_URL'),
      AUTH0_AUDIENCE: configService.get('AUTH0_AUDIENCE'),
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer: auth0?.issuer,
      audience: auth0?.audience,
      passReqToCallback: true,
      secretOrKeyProvider: auth0
        ? passportJwtSecret({
            jwksUri: auth0.jwksUri,
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10,
          })
        : (_req, _token, done) => done(new Error('Auth0 is not configured')),
    });

    this.auth0 = auth0;
  }

  async validate(req: Request, payload: { sub?: string }): Promise<UserDTO> {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = await this.auth0Users.resolve({
      sub: payload.sub!,
      accessToken: accessToken!,
      userInfoUri: this.auth0!.userInfoUri,
    });
    return user.toDTO();
  }
}
