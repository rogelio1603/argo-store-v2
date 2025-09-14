FROM node:22.15.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22.15.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.15.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 8000
CMD ["npm","run","start","--","-p","8000"]