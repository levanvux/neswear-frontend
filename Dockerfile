ARG NODE_VERSION=22-alpine


# Stage 1: Dependencies Installation Stage
FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund 


# Stage 2: Build Next.js application in standalone mode
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG CLOUD_STORAGE_HOSTNAME
ENV CLOUD_STORAGE_HOSTNAME=$CLOUD_STORAGE_HOSTNAME

RUN npm run build


# Stage 3: Run Next.js application
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]