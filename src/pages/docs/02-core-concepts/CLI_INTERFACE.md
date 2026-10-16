# 💻 CLI Interface Guide

Padi Rust Framework includes a built-in CLI console engine (`padi_core::console::Console`). It can be invoked via the root wrapper scripts:
- **Windows:** `padi <command>` (via `padi.bat`)
- **Linux / macOS:** `./padi <command>`
- **Cargo:** `cargo run -- <command>`

---

## 📋 Available Commands

### 1. Interactive Setup Wizard (`padi init` or `padi setup`)
```bash
padi init
```
Interactively configures your database (SQLite, MySQL, or PostgreSQL), tests credentials, generates a cryptographically secure 32-character `JWT_SECRET`, writes `.env`, runs migrations, and prompts to scaffold CRUD automatically.

### 2. Start HTTP Server (`padi serve`)
```bash
padi serve
# Or via Cargo:
cargo run

# With host or port overrides:
padi serve --port=3000 --host=127.0.0.1
```
Starts the Axum REST API server at `http://<APP_HOST>:<APP_PORT>`.

### 3. Database Migrations (`padi migrate`)
```bash
# Run all pending migrations:
padi migrate

# Run migrations for specific tables only:
padi migrate --tables=users,products

# Rollback last migration batch:
padi migrate:rollback
# Rollback multiple steps:
padi migrate:rollback --step=2

# Check migration status:
padi migrate:status
```

### 4. Code Generation (CRUD Scaffolding)
```bash
# Scaffold single database table (Model, Resource, Controller, Route):
padi g <table_name>
# Or full command:
padi generate:crud <table_name>

# Scaffold ALL database tables in one go:
padi ga
# Or full command:
padi generate:crud-all

# Force overwrite existing generated files:
padi g <table_name> --force
```

### 5. Make Individual Components
```bash
# Create a new controller template in src/controllers/
padi make:controller Product

# Create a new model from database table schema:
padi make:model products

# Create an API resource serializer in src/resources/
padi make:resource Product

# Create a timestamped SQL migration file in database/migrations/
padi make:migration create_products_table
```

### 6. Background Queue Worker (`padi queue:work`)
```bash
# Start background worker loop on default queue:
padi queue:work

# Listen to a specific queue:
padi queue:work emails

# Process a single job and exit:
padi queue:work --once

# Stop automatically when all pending jobs have been executed:
padi queue:work --stop-when-empty
```

### 7. Compile Release Binary
```bash
cargo build --release
```
Produces an optimized binary at `./target/release/padi_rust`.
