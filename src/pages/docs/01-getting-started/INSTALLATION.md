# 📦 Installation Guide

## 🚀 Getting Started with Padi Rust

Padi Rust Api Framework is distributed as a lightweight, modular Rust project. You can clone the template starter repository or integrate the `padi_core` crate into an existing Rust application.

---

## 📋 System Requirements

- **Rust 1.75+ (2021 Edition)** with `cargo`
- **Git**
- **Database Engine (One of the following):**
  - **SQLite** (Default - embedded via SQLx, zero external server needed)
  - **MySQL / MariaDB 5.7+ / 8.0+**
  - **PostgreSQL 12+**

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Starter Template
```bash
git clone https://github.com/wibiesana/padi_rust.git my-app
cd my-app
```

### 2. Setup Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

Review your `.env` settings:
```env
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8080

# sqlite (default) | mysql | pgsql — or set DATABASE_URL directly
DB_DRIVER=sqlite
DB_DATABASE=database/app.db

# Min 32 chars, random. Weak/default values are rejected.
JWT_SECRET=your-secure-random-secret-key-at-least-32-chars
JWT_ALGORITHM=HS256

CORS_ALLOWED_ORIGINS=*
RESPONSE_FORMAT=full
ENABLE_COMPRESSION=true
CACHE_DRIVER=file
CACHE_TTL=300
```

> 💡 **Tip:** You can also run the interactive setup wizard:
> ```bash
> padi setup
> # or: cargo run -- setup
> ```
> The wizard configures `.env`, tests your database connection, generates a secure JWT key, runs migrations, and can generate initial CRUD scaffolding.

### 3. Run Migrations
Run all pending SQL migrations:
```bash
padi migrate
# or: cargo run -- migrate
```

### 4. Start Server
Run the Axum server:
```bash
padi serve
# or: cargo run
```

Your API is now live at `http://127.0.0.1:8080`!

---

## 🔄 Updating Framework Core (`padi_core`)

Whenever updates are released to the framework core, update your project dependencies:

```bash
cargo update -p padi_core
```

---

## 🐳 Running with Docker (Optional)

You can containerize your Padi Rust application using a multi-stage Docker build:

```dockerfile
# Build stage
FROM rust:1.75-bullseye AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY database ./database
RUN cargo build --release

# Production stage
FROM debian:bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/padi_rust /app/padi_rust
COPY --from=builder /app/database /app/database
COPY --from=builder /app/padi /app/padi
COPY .env.example /app/.env

EXPOSE 8080
CMD ["./padi_rust", "serve"]
```
