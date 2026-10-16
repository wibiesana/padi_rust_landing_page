# 🌾 Padi Rust Api Framework

**Version:** {{APP_VERSION}}  
**Status:** Production Ready for Rust 2021 Edition (Axum & Tokio) ✅

---

## 📋 Table of Contents

- [🚀 Quick Start](#quick-start)
- [📚 Documentation Index](#documentation-index)
- [✨ Key Features](#key-features)
- [🛠️ System Requirements](#system-requirements)
- [📁 Project Structure](#project-structure)
- [📝 License](#license)

---

## 🚀 Quick Start

Get your high-performance Rust REST API running in 60 seconds!

```bash
# 1. Clone starter template
git clone https://github.com/wibiesana/padi_rust.git my-api
cd my-api

# 2. Setup environment
cp .env.example .env

# 3. Run database migrations
padi migrate
# atau: cargo run -- migrate

# 4. Start API server
padi serve
# atau: cargo run
```

Visit: `http://127.0.0.1:8080`

**📖 Detailed Guide:** [Quick Start Guide →](01-getting-started/QUICK_START.md)

---

## 📚 Documentation Index

### 🎯 1. Getting Started
- **[Quick Start](01-getting-started/QUICK_START.md)**: Setup and run in under 60 seconds with Cargo & Axum.
- **[Installation](01-getting-started/INSTALLATION.md)**: Prerequisites, dependencies, and database drivers.
- **[Configuration](01-getting-started/CONFIGURATION.md)**: Environment variables and `.env` setup.
- **[Setup Methods](01-getting-started/SETUP_METHODS.md)**: Padi CLI workflow, commands, and interactive wizard.
- **[First Steps](01-getting-started/FIRST_STEPS.md)**: JWT registration, login, and protected routes.

### 📖 2. Core Concepts
- **[ActiveRecord](02-core-concepts/ACTIVE_RECORD.md)**: Multi-database ORM (`Model::new`, `all`, `find_or_fail`, `paginate`, `create`, `update`, `delete`).
- **[Query Builder](02-core-concepts/QUERY_BUILDER.md)**: Fluent SQL query builder (`where_`, `filter_where`, `search`, `join`).
- **[Response Structure](02-core-concepts/RESPONSE_STRUCTURE.md)**: Deterministic JSON output (`item` vs `items`, metadata, execution time).
- **[Routing](02-core-concepts/ROUTING.md)**: Blazing-fast Axum routing with fluent nested routes.
- **[Controllers](02-core-concepts/CONTROLLERS.md)**: Handler functions with type-safe Axum extractors (`AuthUser`, `Params`, `Path`, `Body`).
- **[Models](02-core-concepts/MODELS.md)**: Compile-time constant model definitions with `.fillable()` and `.hidden()`.
- **[API Resources](02-core-concepts/RESOURCES.md)**: Resource transformation layer (`Resource::wrap` and `Resource::wraps`).
- **[Authentication & JWT](02-core-concepts/AUTHENTICATION.md)**: Stateless Bearer JWT tokens with `AuthUser` extractor.
- **[Middleware](02-core-concepts/MIDDLEWARE.md)**: Request logger, panic recoverer, CORS, and compression.
- **[Database](02-core-concepts/DATABASE.md)**: SQLx connection pooling for SQLite, MySQL, and PostgreSQL.
- **[Queue System](02-core-concepts/QUEUE.md)**: Asynchronous background worker and job dispatcher (`Queue::push`, `Queue::work`).
- **[Cache Engine](02-core-concepts/CACHE.md)**: Thread-safe cache engine with `remember` closures.
- **[File Storage](02-core-concepts/FILE_UPLOAD.md)**: Secure multipart file uploads with extension and MIME validation.
- **[Email](02-core-concepts/EMAIL.md)**: Asynchronous SMTP transactional mailer.
- **[Role-Based Access Control](02-core-concepts/RBAC.md)**: `auth.require_role(&["admin"])` and permission checks.
- **[User Model](02-core-concepts/USER_MODEL.md)**: Built-in user identity schema with Bcrypt hashing.
- **[CLI Interface](02-core-concepts/CLI_INTERFACE.md)**: Code generator CLI (`padi g <table_name>`, `padi ga`).

### 🎯 3. Advanced Topics
- **[Realtime SSE](03-advanced/REALTIME.md)**: Server-Sent Events real-time event broadcasting (`Realtime::publish`).
- **[Pagination](03-advanced/PAGINATION.md)**: Standardized pagination with `items`, `page`, `per_page`, and `total`.
- **[Frontend Integration](03-advanced/FRONTEND_INTEGRATION.md)**: React, Next.js, Vue 3, Quasar, and Flutter examples.
- **[CORS](03-advanced/CORS.md)**: Cross-origin security and preflight options.
- **[Multi-Database](03-advanced/MULTI_DATABASE.md)**: SQLite, MySQL, and PostgreSQL configuration via SQLx.
- **[API Collections](03-advanced/API_COLLECTION_GUIDE.md)**: API endpoint references and testing guide.
- **[API Testing](03-advanced/API_TESTING.md)**: Testing endpoints with Rust integration tests.
- **[Error Handling](03-advanced/ERROR_HANDLING.md)**: Standardized `ApiError` status codes and crash prevention.
- **[Security](03-advanced/SECURITY.md)**: Security hardening, JWT protection, and input sanitization.

### 🚀 4. Deployment
- **[Docker Deployment](04-deployment/DOCKER.md)**: Multi-stage Rust container builds.
- **[Production Hardening](04-deployment/PRODUCTION.md)**: Systemd service and Nginx reverse proxy.
- **[Performance](04-deployment/PERFORMANCE.md)**: Low-latency benchmarks and Tokio threadpool tuning.
- **[Troubleshooting](04-deployment/TROUBLESHOOTING.md)**: Diagnosing port conflicts, database connectivity, and CORS.

---

## 🛠️ System Requirements

- **Rust 1.75+ (2021 Edition)** with Cargo.
- **Database Engine:** SQLite (default file database via SQLx - no server required), MySQL/MariaDB, or PostgreSQL.
- **Operating System:** Linux, macOS, or Windows.

---

## 📁 Project Structure

```
my-api/
├── Cargo.toml            # Dependencies and package configuration
├── database/
│   ├── app.db            # Default SQLite database
│   └── migrations/       # SQL migration files
├── padi                  # CLI wrapper script (Linux / macOS)
├── padi.bat              # CLI wrapper script (Windows)
├── src/
│   ├── controllers/      # Route controllers (auth, users, custom)
│   │   └── mod.rs
│   ├── models/           # ActiveRecord Models (USERS, custom)
│   │   └── mod.rs
│   ├── resources/        # API Resources / response serializers
│   │   └── mod.rs
│   ├── routes/           # Axum router configuration
│   │   ├── auth.rs
│   │   ├── site.rs
│   │   ├── users.rs
│   │   └── mod.rs
│   └── main.rs           # Entry point and CLI console runner
├── storage/              # Cache, logs, and uploaded files
└── .env                  # Environment configuration
```

---

## 📝 License

Licensed under the [MIT License](LICENSE). Open source and free for commercial use.
