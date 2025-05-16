# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
USER node

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app

RUN chown -R node:node /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

RUN yarn install --production --frozen-lockfile
USER node

EXPOSE 8080
CMD ["node", "dist/main"]
