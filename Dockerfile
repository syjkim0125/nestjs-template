FROM node:22-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm i -g pnpm

# 루트 package.json만 복사
COPY package.json pnpm-lock.yaml ./

# apps와 libs 디렉토리 생성
RUN mkdir -p apps/auth apps/user apps/user-grpc libs/common libs/user-common

# 의존성 설치
RUN pnpm install

# 소스 복사
COPY . .

# 전체 빌드
RUN pnpm run build:all

# Auth Service
FROM node:22-alpine AS auth
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/auth ./dist
CMD ["node", "dist/src/main.js"]

# User Service
FROM node:22-alpine AS user
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/user ./dist
CMD ["node", "dist/src/main.js"]

# User gRPC Service
FROM node:22-alpine AS user-grpc
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/user-grpc ./dist
COPY --from=builder /app/proto ./proto
EXPOSE 5000
CMD ["node", "dist/src/main.js"] 