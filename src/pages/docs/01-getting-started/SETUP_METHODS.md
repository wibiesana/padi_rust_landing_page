# 🚀 Setup Methods & CLI Workflow

## 🤖 Adaptive Development with Padi Go

Padi REST API Framework for Go provides an intuitive setup and development workflow, whether you prefer automated commands via `cmd/padi/main.go` or manual project orchestration.

---

## 📋 Table of Contents

- [🤖 Adaptive Development with Padi Go](#adaptive-development-with-padi-go)
- [✨ The Padi Go CLI Tool](#the-padi-go-cli-tool)
- [🛠️ Quick Setup Workflow](#quick-setup-workflow)
- [⚙️ Manual Configuration](#manual-configuration)
- [📊 CLI Commands Cheatsheet](#cli-commands-cheatsheet)
- [📝 Summary](#summary)

---

## ✨ The Padi Go CLI Tool

Padi includes a built-in CLI engine at `cmd/padi/main.go` powered by Cobra. It gives you a clean and unified tool for managing the entire API lifecycle.

### Quick Start:

```bash
# 1. Download dependencies
go mod tidy

# 2. Setup .env
cp .env.example .env

# 3. Run migrations
go run cmd/padi/main.go migrate

# 4. Start HTTP Server
go run cmd/padi/main.go serve
```

---

## 🛠️ Quick Setup Workflow

### 1. Configure Database Connection (`.env`)
Padi supports SQLite, PostgreSQL, and MySQL:

```env
APP_NAME="Padi REST API"
APP_ENV=development
APP_PORT=8080

# SQLite (Zero server setup required)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Or PostgreSQL:
# DB_CONNECTION=postgres
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=padi_db
# DB_USERNAME=postgres
# DB_PASSWORD=secret
```

### 2. Run Database Migrations
```bash
go run cmd/padi/main.go migrate
```

### 3. Generate Scaffolding (CRUD)
```bash
# Generate Base/Custom Models, Controllers, and Postman specs for a table:
go run cmd/padi/main.go g products

# Or generate for all tables in your database:
go run cmd/padi/main.go ga
```

---

## ⚙️ Manual Configuration

If you prefer building a binary executable instead of using `go run`:

```bash
# 1. Build the Padi CLI binary
go build -o padi.exe cmd/padi/main.go

# 2. Run commands directly using the binary:
./padi.exe migrate
./padi.exe g users
./padi.exe serve
```

---

## 📊 CLI Commands Cheatsheet

| Command | Alias | Description |
| :--- | :--- | :--- |
| `go run cmd/padi/main.go init` | - | Launch Interactive Setup Wizard (Database, JWT, Migrations) |
| `go run cmd/padi/main.go serve` | - | Start the Padi REST API HTTP server |
| `go run cmd/padi/main.go migrate` | - | Run all pending database migrations |
| `go run cmd/padi/main.go migrate:rollback` | - | Rollback the latest batch of migrations |
| `go run cmd/padi/main.go generate:crud <table_name>` | `g` | Scaffold Base/Custom Model, Controller, and Collection |
| `go run cmd/padi/main.go generate:crud-all` | `ga` | Scaffold CRUD for all tables in the database |
| `go run cmd/padi/main.go queue:work [queue_name]` | `queue` | Start processing background queue jobs |
| `go run cmd/padi/main.go make:model <name>` | - | Generate a blank model template |
| `go run cmd/padi/main.go make:controller <name>` | - | Generate a blank controller template |
| `go run cmd/padi/main.go make:migration <name>` | - | Generate a timestamped migration file |

---

## 📝 Summary

- **Fastest Setup**: `go mod tidy` $\rightarrow$ `cp .env.example .env` $\rightarrow$ `go run cmd/padi/main.go migrate` $\rightarrow$ `go run cmd/padi/main.go serve`.
- **Pure Go SQLite**: No CGO or external database server needed for local development.
- **Scaffolding**: Single command CRUD generation with `go run cmd/padi/main.go g <table_name>`.
