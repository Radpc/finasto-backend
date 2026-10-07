export type Auth0Config = {
  /** Tenant URL with a trailing slash, e.g. https://finasto-dev.us.auth0.com/ */
  issuer: string;
  /** Identifier of the Finasto API in Auth0, e.g. https://api.finasto.app */
  audience: string;
  jwksUri: string;
  userInfoUri: string;
};

type Env = Record<string, string | undefined>;

/** Returns the Auth0 settings, or null when Auth0 sign-in is not configured. */
export function readAuth0Config(env: Env): Auth0Config | null {
  const rawIssuer = env.AUTH0_ISSUER_URL;
  const audience = env.AUTH0_AUDIENCE;
  if (!rawIssuer || !audience) return null;

  const issuer = rawIssuer.endsWith('/') ? rawIssuer : `${rawIssuer}/`;
  return {
    issuer,
    audience,
    jwksUri: `${issuer}.well-known/jwks.json`,
    userInfoUri: `${issuer}userinfo`,
  };
}
