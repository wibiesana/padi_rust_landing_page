# 🐳 Docker Deployment Guide

Deploying Padi Go applications with Docker results in ultra-compact images (< 25MB) using multi-stage builds.

---

## 📄 Dockerfile

```dockerfile
# Stage 1: Build the Go binary
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/padi-server cmd/padi/main.go

# Stage 2: Minimal runtime image
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

COPY --from=builder /app/padi-server .
COPY --from=builder /app/.env.example .env

EXPOSE 8080

CMD ["./padi-server", "serve"]
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
      - DB_CONNECTION=postgres
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=padi_db
      - DB_USERNAME=padi_user
      - DB_PASSWORD=secret
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
