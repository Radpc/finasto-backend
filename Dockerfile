# syntax=docker/dockerfile:1

# ---- Build stage: install deps, generate Prisma client, compile, prune ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev

# ---- Runtime stage: production deps and compiled code only, non-root ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

# Configuration (DATABASE_URL, JWT_USER_SECRET, ...) is provided at runtime
# through environment variables, never baked into the image.
CMD ["node", "dist/src/main.js"]
