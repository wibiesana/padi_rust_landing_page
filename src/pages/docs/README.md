# 🌾 PADI REST API GO Framework

**Version:** {{APP_VERSION}}  
**Status:** Production Ready for Go 1.22+ ✅

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

Get your high-performance Go REST API running in 60 seconds!

```bash
# 1. Clone starter template
git clone https://github.com/wibiesana/padi_go.git my-api
cd my-api

# 2. Download dependencies
go mod tidy

# 3. Setup environment
cp .env.example .env

# 4. Run database migrations
go run cmd/padi/main.go migrate

# 5. Start API server
go run cmd/padi/main.go serve
```

Visit: `http://localhost:8080`

**📖 Detailed Guide:** [Quick Start Guide →](01-getting-started/QUICK_START.md)

---

## 📚 Documentation Index

### 🎯 1. Getting Started
- **[Quick Start](01-getting-started/QUICK_START.md)**: Setup and run in under 60 seconds.
- **[Installation](01-getting-started/INSTALLATION.md)**: Dependencies and database drivers.
- **[Configuration](01-getting-started/CONFIGURATION.md)**: Environment variables and `.env` setup.
- **[Setup Methods](01-getting-started/SETUP_METHODS.md)**: Padi CLI workflow and commands.
- **[First Steps](01-getting-started/FIRST_STEPS.md)**: JWT registration, login, and protected routes.

### 📖 2. Core Concepts
- **[ActiveRecord](02-core-concepts/ACTIVE_RECORD.md)**: Type-safe generic ORM (`Find[T]`, `All[T]`, `Paginate[T]`, `Save`, `Delete`).
- **[Query Builder](02-core-concepts/QUERY_BUILDER.md)**: Fluent SQL builder (`Where`, `FilterWhere`, `Search`, `Joins`).
- **[Response Structure](02-core-concepts/RESPONSE_STRUCTURE.md)**: Deterministic JSON output (`items` vs `item`).
- **[Routing](02-core-concepts/ROUTING.md)**: Fast Chi routing with direct root endpoints.
- **[Controllers](02-core-concepts/CONTROLLERS.md)**: Base & Concrete Controller architecture.
- **[Models](02-core-concepts/MODELS.md)**: Base & Concrete Model architecture.
- **[API Resources](02-core-concepts/RESOURCES.md)**: Base & Concrete Resource transformation layer.
- **[Authentication & JWT](02-core-concepts/AUTHENTICATION.md)**: Stateless Bearer JWT tokens and password hashing.
- **[Middleware](02-core-concepts/MIDDLEWARE.md)**: Request logger, panic recoverer, CORS, and rate limiting.
- **[Database](02-core-concepts/DATABASE.md)**: Connection pooling for SQLite, MySQL, and PostgreSQL.
- **[Queue System](02-core-concepts/QUEUE.md)**: Background job processing and workers.
- **[Cache Engine](02-core-concepts/CACHE.md)**: Thread-safe in-memory caching and remember closures.
- **[File Storage](02-core-concepts/FILE_UPLOAD.md)**: Secure multipart uploads with extension validation.
- **[Email](02-core-concepts/EMAIL.md)**: Transactional SMTP & queued email dispatching.
- **[Role-Based Access Control](02-core-concepts/RBAC.md)**: Route & controller-level authorization.
- **[User Model](02-core-concepts/USER_MODEL.md)**: User identity and authentication schema.
- **[CLI Interface](02-core-concepts/CLI_INTERFACE.md)**: Scaffolding with `go run cmd/padi/main.go g <table_name>`.

### 🎯 3. Advanced Topics
- **[Realtime SSE](03-advanced/REALTIME.md)**: Server-Sent Events real-time event broadcasting.
- **[Pagination](03-advanced/PAGINATION.md)**: Streamlined pagination with `items` and `meta`.
- **[Frontend Integration](03-advanced/FRONTEND_INTEGRATION.md)**: React, Next.js, Vue 3, Quasar, and Flutter examples.
- **[CORS](03-advanced/CORS.md)**: Cross-origin security and preflight options.
- **[Multi-Database](03-advanced/MULTI_DATABASE.md)**: SQLite, MySQL, and PostgreSQL configuration.
- **[API Collections](03-advanced/API_COLLECTION_GUIDE.md)**: Auto-generated Postman and Thunder Client collections.
- **[API Testing](03-advanced/API_TESTING.md)**: Testing endpoints with Go `testing` and `net/http/httptest`.
- **[Error Handling](03-advanced/ERROR_HANDLING.md)**: Standardized HTTP status codes and panic recovery.
- **[Security](03-advanced/SECURITY.md)**: Security hardening and protection against common attacks.

### 🚀 4. Deployment
- **[Docker Deployment](04-deployment/DOCKER.md)**: Multi-stage alpine container builds (< 25MB).
- **[Production Hardening](04-deployment/PRODUCTION.md)**: Systemd service and Nginx reverse proxy.
- **[Performance](04-deployment/PERFORMANCE.md)**: Low-latency benchmarks and connection pool tuning.
- **[Troubleshooting](04-deployment/TROUBLESHOOTING.md)**: Diagnosing port conflicts, database connectivity, and CORS.

---

## 🛠️ System Requirements

- **Go 1.22+**
- **Database Engine:** Pure Go SQLite (default), MySQL/MariaDB, or PostgreSQL.
- **Operating System:** Linux, macOS, or Windows.

---

## 📁 Project Structure

```
my-api/
├── app/
│   ├── Controllers/       # Concrete controllers (custom logic)
│   │   └── Base/          # Auto-generated CRUD base controllers
│   ├── Models/            # Concrete models (custom methods & hooks)
│   │   └── Base/          # Auto-generated model schemas
│   ├── Resources/         # Concrete resources (custom output transformations)
│   │   └── Base/          # Auto-generated resource mappers
│   └── Routes/
│       └── api.go         # Route registration
├── cmd/
│   └── padi/
│       └── main.go        # Padi CLI
├── database/
│   └── migrations/        # SQL migration files
├── storage/               # File uploads and logs
├── .env                   # Configuration
└── go.mod                 # Go module definition
```

---

## 📝 License

MIT License. Open source and free for commercial use.
