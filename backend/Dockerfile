# Build context must be the monorepo root, not backend/.
# From repo root: docker build -f backend/Dockerfile -t code-iron-backend .

# ---------- Stage 1: prune workspace to backend + transitive deps ----------
FROM node:20-alpine AS pruner
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune backend --docker

# ---------- Stage 2: install deps and build ----------
FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Install pruned deps first (better layer caching)
COPY --from=pruner /repo/out/json/ ./
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /repo/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned source and build
COPY --from=pruner /repo/out/full/ ./
RUN pnpm --filter backend build

# Prune dev deps for runtime
RUN pnpm --filter backend deploy --prod /app

# ---------- Stage 3: minimal runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /repo/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /repo/backend/package.json ./package.json
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main"]
