# Finasto API

REST API for Finasto, a shared household cost-control app. Families share accounts, categories and tags, and record payments, recurring payments and time budgets.

Built with NestJS 10, Prisma 5 and MySQL 8. Interactive API docs (Swagger) are served at `/api`.

## Run locally

Requirements: Node 22 and Docker (for the database).

```bash
# 1. Start MySQL (user/password/database: finasto)
docker compose up -d

# 2. Configure the API
cp .env.example .env

# 3. Install, create the schema and load demo data
npm ci
npx prisma migrate deploy
npx prisma db seed          # demo login: admin@email.com / 12345 (local only)

# 4. Start in watch mode
npm run start:dev
```

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api
- Health check: http://localhost:3000/health

## Configuration

All configuration comes from environment variables, validated at startup (`src/config/env.validation.ts`). The app refuses to start if a required value is missing.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | MySQL connection string used by Prisma |
| `JWT_USER_SECRET` | yes | Secret for signing user JWTs; at least 32 characters when `NODE_ENV=production` |
| `PORT` | no | HTTP port, default 3000 |
| `NODE_ENV` | no | `production` enables production checks |

Never commit `.env` files or bake them into images. In deployed environments, inject these variables at runtime from a secrets manager.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run start:dev` | Start with reload |
| `npm run build` | Compile to `dist/` |
| `npm run lint:check` / `npm run lint` | Check / fix lint and formatting |
| `npm run typecheck` | TypeScript check without emitting |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests (needs the database from `docker compose`) |

## Project structure

```
src/
  main.ts                    bootstrap: validation pipe, CORS, Swagger
  app.module.ts              wires config and feature modules
  config/                    environment validation
  database/                  Prisma service and repositories
  modules/<feature>/
    domain/                  entity classes (fromRaw / toDTO)
    dto/                     request validation (class-validator)
    use-cases/<name>/        one controller + one service per use case
    jobs/                    scheduled jobs and their manual triggers
prisma/
  schema.prisma, migrations/, seed/
test/                        end-to-end tests
```

## Docker

```bash
docker build -t finasto-api .
docker run -p 3000:3000 --env-file .env finasto-api
```

The image contains compiled code and production dependencies only, runs as a non-root user, and never contains `.env` files. Database migrations are run separately with `npx prisma migrate deploy` before starting a new version.
