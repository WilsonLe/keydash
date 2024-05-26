# Base Image
################################################################################
FROM node:20-alpine AS base
WORKDIR /app
################################################################################

# Builder Image
################################################################################
FROM base AS builder
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add sharp --ignore-engines
COPY . .
RUN yarn build
################################################################################

# Dependency Image
################################################################################
FROM base AS dependency
COPY package.json yarn.lock ./
RUN yarn install --production
################################################################################


# Runner Image
################################################################################
FROM base AS runner
ENV NODE_ENV production
ENV PAYLOAD_CONFIG_PATH ./.payload/payload.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.payload ./.payload
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=dependency /app/node_modules ./node_modules
EXPOSE 3000
CMD ["yarn", "start"]
################################################################################
