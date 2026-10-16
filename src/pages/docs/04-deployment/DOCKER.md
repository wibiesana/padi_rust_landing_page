# 🐳 Docker Deployment Guide

Deploying Padi Rust applications with Docker results in ultra-compact, high-performance container images using multi-stage builds.

---

## 📄 Dockerfile

```dockerfile
# Stage 1: Build the Rust release binary
FROM rust:1.75-bullseye AS builder

WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
# Create dummy main to compile dependencies first
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy real source code and migrations
COPY src ./src
COPY database ./database

# Build release binary (updates real src)
RUN touch src/main.rs && cargo build --release

# Stage 2: Minimal runtime image
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y ca-certificates libssl-dev tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/padi_rust /app/padi_rust
COPY --from=builder /app/database /app/database
COPY .env.example /app/.env

EXPOSE 8080

CMD ["./padi_rust", "serve"]
```

---

## 📄 docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=production
      - APP_PORT=8080
      - DB_DRIVER=pgsql
      - DATABASE_URL=postgres://padi_user:secret@postgres:5432/padi_db
      - JWT_SECRET=change-this-to-a-cryptographically-secure-32-character-secret
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: padi_db
      POSTGRES_USER: padi_user
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```
