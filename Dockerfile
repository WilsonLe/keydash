# Base Image
################################################################################
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache \
    g++ \
    make \
    python3 \
    vips-dev \
    && rm -rf /var/cache/*
################################################################################

# Builder Image
################################################################################
FROM base AS builder
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
################################################################################


# Runner Image
################################################################################
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
CMD ["yarn", "start"]
################################################################################
