# 🚀 Setup Methods & CLI Workflow

## 🤖 Adaptive Development with Padi Rust

Padi Rust Api Framework provides an intuitive setup and development workflow, whether you prefer automated commands via the `padi` CLI or standard `cargo run` invocations.

---

## 📋 Table of Contents

- [🤖 Adaptive Development with Padi Rust](#adaptive-development-with-padi-rust)
- [✨ The Padi CLI Tool](#the-padi-cli-tool)
- [🛠️ Quick Setup Workflow](#quick-setup-workflow)
- [⚙️ Building for Production](#building-for-production)
- [📊 CLI Commands Cheatsheet](#cli-commands-cheatsheet)
- [📝 Summary](#summary)

---

## ✨ The Padi CLI Tool

Padi includes a built-in CLI console engine powered by `padi_core::Console`. Wrapper scripts are included at the root of the project:
- **Windows:** `padi.bat` (allows running `padi <command>`)
- **Linux / macOS:** `padi` (executable shell script: `./padi <command>`)
- **Direct Cargo:** `cargo run -- <command>`

### Quick Start:

```bash
# 1. Setup .env
cp .env.example .env

# 2. Run migrations
padi migrate
# or: cargo run -- migrate

# 3. Start Axum HTTP Server
padi serve
# or: cargo run
```

---

## 🛠️ Quick Setup Workflow

### 1. Interactive Setup Wizard (`padi setup` or `padi init`)
Padi includes a rich interactive setup wizard that helps you initialize your application:
```bash
padi init
```
The wizard will:
- Check or create your `.env` configuration.
- Prompt for your database driver (`sqlite`, `mysql`, `pgsql`).
- Generate a secure, high-entropy 32-character `JWT_SECRET`.
- Test the database connection.
- Run pending database migrations automatically.
- Offer to scaffold CRUD for existing database tables.

### 2. Configure Database Manually (`.env`)
```env
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8080

# SQLite (Zero server setup required)
DB_DRIVER=sqlite
DB_DATABASE=database/app.db

# Or PostgreSQL:
# DB_DRIVER=pgsql
# DATABASE_URL=postgres://user:password@127.0.0.1:5432/padi_db
```

### 3. Generate Scaffolding (CRUD)
```bash
# Generate Model, Resource, Controller, and Route for a single table:
padi g products

# Generate CRUD for ALL tables in your database at once:
padi ga
```

When you generate CRUD:
1. `src/models/<singular>.rs` is generated with introspected table columns and added to `src/models/mod.rs`.
2. `src/resources/<singular>.rs` is generated and registered in `src/resources/mod.rs`.
3. `src/controllers/<plural>.rs` is created with `index`, `all`, `show`, `store`, `update`, and `destroy` handlers.
4. `src/routes/<plural>.rs` is created and nested into `src/routes/mod.rs`.

---

## ⚙️ Building for Production

To produce an optimized, standalone binary executable:

```bash
# 1. Compile release binary
cargo build --release

# 2. Run the compiled binary
./target/release/padi_rust serve
# Or with port/host flags:
./target/release/padi_rust serve --port=3000 --host=0.0.0.0
```

---

## 📊 CLI Commands Cheatsheet

| Command | Alias | Description |
| :--- | :--- | :--- |
| `padi help` | `list`, `-h` | Display help and list all available CLI commands |
| `padi serve` | - | Start the Padi Axum REST API server (`--port=...`, `--host=...`) |
| `padi init` | `setup` | Launch interactive Setup Wizard (DB, JWT, Migrations) |
| `padi migrate` | - | Run all pending migrations (`--table=...` or `--tables=...`) |
| `padi migrate:rollback` | - | Rollback last batch of migrations (`--step=<n>`) |
| `padi migrate:status` | - | Display migration execution status |
| `padi generate:crud <table_name>` | `g` | Scaffold Model, Resource, Controller, and Route for a table |
| `padi generate:crud-all` | `ga` | Scaffold complete CRUD for all tables in the database |
| `padi make:controller <name>` | - | Generate a blank controller template in `src/controllers/` |
| `padi make:model <table_name>` | - | Generate an ActiveRecord model from database table schema |
| `padi make:resource <name>` | - | Generate an API resource serializer in `src/resources/` |
| `padi make:migration <name>` | - | Generate a timestamped `.sql` migration file in `database/migrations/` |
| `padi queue:work [queue_name]` | `queue` | Start processing background queue jobs (`--once`, `--stop-when-empty`) |

---

## 📝 Summary

- **Fastest Setup**: `cp .env.example .env` $\rightarrow$ `padi migrate` $\rightarrow$ `padi serve`.
- **Zero-Config Database**: SQLite is embedded by default via SQLx at `database/app.db`.
- **Instant Scaffolding**: Generate complete CRUD for your entire database with one command: `padi ga`.
