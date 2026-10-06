# 📦 Installation Guide

## 🚀 Getting Started with Padi Go

Padi REST API Framework is distributed as a lightweight, modular Go project. You can clone the template or integrate the core package into an existing Go application.

---

## 📋 System Requirements

- **Go 1.22+** (with generics support)
- **Git**
- **Database Engine (One of the following):**
  - **SQLite** (Default - pure Go via `modernc.org/sqlite`, zero external dependencies)
  - **MySQL / MariaDB 5.7+ / 8.0+**
  - **PostgreSQL 12+**

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Starter Template
```bash
git clone https://github.com/wibiesana/padi_go.git my-app
cd my-app
```

### 2. Install Go Dependencies
```bash
go mod tidy
```

### 3. Setup Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

Review your `.env` file settings:
```env
APP_NAME="Padi REST API"
APP_ENV=development
APP_PORT=8080
APP_DEBUG=true
APP_KEY=generate-a-secure-32-byte-key
JWT_SECRET=generate-a-secure-jwt-secret
JWT_EXPIRATION=24

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### 4. Run Migrations
```bash
go run cmd/padi/main.go migrate
```

### 5. Start Server
```bash
go run cmd/padi/main.go serve
```

Your API is now live at `http://localhost:8080`!

---

## 🐳 Running with Docker (Optional)

You can also run Padi Go inside a Docker container:

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server cmd/padi/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/server .
COPY --from=builder /app/.env.example .env
EXPOSE 8080
CMD ["./server", "serve"]
```
