# 🚀 Quick Start - Run This!

## ⚡ Speed to Market: Zero to API in Seconds

Experience the ultimate developer fast-track. **Padi REST API Framework for Go** is engineered for **Instant Productivity**, allowing you to go from a clean slate to a fully-functional, secure, and industrial-grade REST API in less than 60 seconds.

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

- **Go 1.22+**
- **Database (Optional):** SQLite (built-in, no server required), MySQL/MariaDB, or PostgreSQL

---

## 🤖 Quick Installation

Clone or initialize a new project using the template:

```bash
git clone https://github.com/wibiesana/padi_go.git my-app
cd my-app
go mod tidy
```

Copy the environment file:

```bash
cp .env.example .env
```

Run database migrations:

```bash
go run cmd/padi/main.go migrate
```

Start the API server:

```bash
go run cmd/padi/main.go serve
```

Visit: `http://localhost:8080`

---

## 🗄️ Database Support

- ✅ **SQLite** (Native pure Go driver via `modernc.org/sqlite` - no CGO required)
- ✅ **MySQL / MariaDB** (via `go-sql-driver/mysql`)
- ✅ **PostgreSQL** (via `lib/pq`)

---

## 💻 Essential Commands

### 1. Database Migrations

```bash
# Run pending migrations
go run cmd/padi/main.go migrate

# Rollback last migration batch
go run cmd/padi/main.go migrate:rollback
```

### 2. Scaffold Complete CRUD

```bash
# Generate Base Model, Model, Controller, and API collection for a table
go run cmd/padi/main.go generate:crud products
# Or short alias:
go run cmd/padi/main.go g products

# Generate CRUD for all tables in database:
go run cmd/padi/main.go generate:crud-all
```

### 3. Start Background Queue Worker

```bash
# Process background jobs
go run cmd/padi/main.go queue:work
```

---

## 🌾 Project Structure

```
my-app/
├── app/
│   ├── Controllers/       # Concrete controllers (add custom actions here)
│   │   └── Base/          # Auto-generated base controllers (overwritten on sync)
│   ├── Models/            # Concrete models (custom methods & hooks)
│   │   └── Base/          # Auto-generated model schemas (overwritten on sync)
│   └── Routes/
│       └── api.go         # Route registration
├── cmd/
│   └── padi/
│       └── main.go        # Padi CLI tool
├── database/
│   └── migrations/        # Database migration files
├── storage/               # File uploads and cache storage
├── .env                   # Environment configuration
└── go.mod                 # Go module definition
```

---

## 👣 Next Steps

1. Check the [ActiveRecord Guide](../02-core-concepts/ACTIVE_RECORD.md) to learn how to query and manipulate data.
2. Check the [Response Structure Guide](../02-core-concepts/RESPONSE_STRUCTURE.md) for JSON payload standards (`items` vs `item`).
3. Scaffold your first database table with `go run cmd/padi/main.go g <table_name>`.
