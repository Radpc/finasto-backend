import { readAuth0Config } from './auth0.config';

describe('readAuth0Config', () => {
  it('is null when Auth0 is not configured', () => {
    expect(readAuth0Config({})).toBeNull();
  });

  it('derives the JWKS and userinfo URLs from the issuer', () => {
    expect(
      readAuth0Config({
        AUTH0_ISSUER_URL: 'https://finasto-dev.us.auth0.com',
        AUTH0_AUDIENCE: 'https://api.finasto.app',
      }),
    ).toEqual({
      issuer: 'https://finasto-dev.us.auth0.com/',
      audience: 'https://api.finasto.app',
      jwksUri: 'https://finasto-dev.us.auth0.com/.well-known/jwks.json',
      userInfoUri: 'https://finasto-dev.us.auth0.com/userinfo',
    });
  });
});
