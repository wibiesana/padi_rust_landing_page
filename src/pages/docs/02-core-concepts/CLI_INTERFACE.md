# 💻 CLI Interface Guide

Padi Framework includes a powerful CLI utility (`cmd/padi/main.go`) built with Cobra.

---

## 📋 Available Commands

### 1. Interactive Setup Wizard
```bash
go run cmd/padi/main.go init
```
Interactively configures your database (SQLite, MySQL, or PostgreSQL), tests credentials, generates secure 64-character JWT secrets, writes `.env`, and executes migrations automatically.

### 2. Start Server
```bash
go run cmd/padi/main.go serve
```
Starts the API server at `http://localhost:<APP_PORT>`.

### 2. Database Migrations
```bash
# Run all pending migrations
go run cmd/padi/main.go migrate

# Rollback latest migration batch
go run cmd/padi/main.go migrate:rollback
```

### 3. Generate CRUD
```bash
# Scaffold single database table
go run cmd/padi/main.go generate:crud <table_name>
# Short alias:
go run cmd/padi/main.go g <table_name>

# Scaffold with Real-time SSE broadcasting enabled automatically:
go run cmd/padi/main.go generate:crud <table_name> --realtime
# Or with short flag:
go run cmd/padi/main.go g <table_name> -r

# Scaffold all database tables at once:
go run cmd/padi/main.go generate:crud-all
# Short alias:
go run cmd/padi/main.go ga

# Scaffold all database tables with Real-time SSE enabled:
go run cmd/padi/main.go ga -r
```


### 4. Background Queue Worker
```bash
# Start queue processor listening on default queue
go run cmd/padi/main.go queue:work

# Listen on a specific queue
go run cmd/padi/main.go queue:work emails
```

### 5. Make Generators
```bash
# Create a new model
go run cmd/padi/main.go make:model Product

# Create a new controller
go run cmd/padi/main.go make:controller ProductController

# Create a timestamped migration file
go run cmd/padi/main.go make:migration create_products_table
```

### 6. Build Production Binary
```bash
go run cmd/padi/main.go build
```
Compiles a stripped, production-ready binary (`-ldflags "-s -w"`) named automatically after `APP_NAME` in your `.env` file (e.g. `padi-rest-api-go.exe` on Windows or `padi-rest-api-go` on Linux).

