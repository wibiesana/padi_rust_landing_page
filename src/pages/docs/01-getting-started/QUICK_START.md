# 🚀 Quick Start - Run This!

## ⚡ Speed to Market: Zero to API in Seconds

Experience the ultimate developer fast-track. **Padi Rust Api Framework** is engineered for **Instant Productivity**, allowing you to go from a clean slate to a fully-functional, secure, and industrial-grade REST API in less than 60 seconds with Rust, Axum, Tokio, and SQLx.

---

## 📋 Table of Contents

- [⚡ Speed to Market: Zero to API in Seconds](#speed-to-market-zero-to-api-in-seconds)
- [📝 Prerequisites](#prerequisites)
- [🤖 Quick Installation](#quick-installation)
- [🗄️ Database Support](#database-support)
- [💻 Essential Commands](#essential-commands)
- [🌾 Project Structure](#project-structure)
- [👣 Next Steps](#next-steps)

---

## 📝 Prerequisites

- **Rust 1.75+ (2021 Edition)** with Cargo
- **Database (Optional):** SQLite (built-in via SQLx, file located at `database/app.db`), MySQL/MariaDB, or PostgreSQL

---

## 🤖 Quick Installation

Clone the starter template:

```bash
git clone https://github.com/wibiesana/padi_rust.git my-app
cd my-app
```

Copy the environment file:

```bash
cp .env.example .env
```

Run database migrations:

```bash
# Windows:
padi migrate
# Linux / macOS:
./padi migrate
# Or with cargo:
cargo run -- migrate
```

Start the API server:

```bash
# Windows:
padi serve
# Linux / macOS:
./padi serve
# Or with cargo:
cargo run
```

Visit: `http://127.0.0.1:8080`

---

## 🗄️ Database Support

- ✅ **SQLite** (Default - embedded via SQLx, zero setup required, file at `database/app.db`)
- ✅ **MySQL / MariaDB** (via SQLx)
- ✅ **PostgreSQL** (via SQLx)

Configure via `DB_DRIVER` and `DB_DATABASE` or set `DATABASE_URL` directly in `.env`.

---

## 💻 Essential Commands

Use `padi` (Windows: `padi.bat`, Linux/macOS: `./padi`, or `cargo run -- <command>`):

### 1. Database Migrations

```bash
# Run pending migrations
padi migrate

# Rollback last migration batch
padi migrate:rollback

# Show migration status
padi migrate:status
```

### 2. Scaffold Complete CRUD

```bash
# Generate Model, Resource, Controller, and Route for a single table:
padi g products
# Or full command:
padi generate:crud products

# Generate CRUD for ALL tables in the database at once:
padi ga
# Or full command:
padi generate:crud-all
```

### 3. Make Individual Components

```bash
padi make:controller Product
padi make:model products
padi make:resource Product
padi make:migration create_products_table
```

### 4. Background Queue Worker

```bash
# Process background jobs from the queue:
padi queue:work

# Process a single job:
padi queue:work --once

# Stop when queue is empty:
padi queue:work --stop-when-empty
```

---

## 🌾 Project Structure

```
my-app/
├── Cargo.toml            # Rust dependencies & metadata
├── database/
│   ├── app.db            # Default SQLite database
│   └── migrations/       # SQL migration files (.sql)
├── padi                  # CLI wrapper script for Linux / macOS
├── padi.bat              # CLI wrapper script for Windows
├── src/
│   ├── controllers/      # Axum request handlers
│   │   ├── auth.rs       # Login, register, me, refresh, logout
│   │   ├── users.rs      # User management handlers
│   │   └── mod.rs
│   ├── models/           # ActiveRecord Models
│   │   ├── user.rs       # USERS model definition
│   │   └── mod.rs
│   ├── resources/        # API Resources / serializers
│   │   ├── user.rs       # UserResource transformation
│   │   └── mod.rs
│   ├── routes/           # Axum router registration
│   │   ├── auth.rs       # /auth routes
│   │   ├── site.rs       # Root / health routes
│   │   ├── users.rs      # /users routes
│   │   └── mod.rs        # Router entrypoint
│   └── main.rs           # Application runner & CLI dispatcher
├── storage/              # Logs, cache, and uploaded files
└── .env                  # Environment configuration
```

---

## 👣 Next Steps

1. Check the [ActiveRecord Guide](../02-core-concepts/ACTIVE_RECORD.md) to learn how to query and manipulate data in Rust.
2. Check the [Response Structure Guide](../02-core-concepts/RESPONSE_STRUCTURE.md) for JSON payload standards (`item` vs `items`).
3. Scaffold your first database table with `padi g <table_name>`.
