# Auth0 setup

Finasto uses Auth0 for sign-in. The web app signs people in with Auth0's hosted login page and sends the resulting access token to this API, which checks it against the tenant's public keys. The API never sees passwords.

Auth0's Free plan covers up to 25,000 monthly active users, which is enough for development and launch.

## 1. Create two tenants

Create one tenant per environment so test users and settings never mix with real ones:

- `finasto-dev` for local development
- `finasto` for production (later, when hosting is set up)

## 2. Register the API

In **Applications → APIs → Create API**:

- **Name:** Finasto API
- **Identifier:** `https://api.finasto.app` (any URL-shaped string; it does not need to resolve). This becomes `AUTH0_AUDIENCE`.
- **Signing algorithm:** RS256

In the API's settings, turn on **Allow Offline Access** so the web app can use refresh tokens.

## 3. Register the web app

In **Applications → Applications → Create Application**, choose **Single Page Web Applications**:

- **Allowed Callback URLs:** `http://localhost:5173`
- **Allowed Logout URLs:** `http://localhost:5173`
- **Allowed Web Origins:** `http://localhost:5173`
- **Refresh Token Rotation:** on

Add the production URLs to the production tenant's app when it exists.

## 4. Sign-in methods

Under **Authentication**, enable email and password (Database) and, optionally, Google. Turn on email verification: the API only links an Auth0 sign-in to a Finasto account when Auth0 reports the email as verified.

## 5. Configure the API

```bash
AUTH0_ISSUER_URL=https://finasto-dev.us.auth0.com/   # your tenant domain, with https:// and a trailing slash
AUTH0_AUDIENCE=https://api.finasto.app
```

Neither value is secret. The API downloads the tenant's public keys from `<issuer>.well-known/jwks.json` and caches them.

## How accounts are matched

On the first request with a new Auth0 identity, the API asks Auth0's `/userinfo` endpoint for the email and links the identity to the Finasto user with that email, if:

- Auth0 says the email is verified, and
- that Finasto user is not already linked to another Auth0 identity.

Otherwise the API answers 403. Signing up without an existing Finasto account comes with the sign-up work in Phase 3 of the plan.
