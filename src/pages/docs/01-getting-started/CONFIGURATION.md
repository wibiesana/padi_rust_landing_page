# ⚙️ Configuration Guide

Padi Rust Framework uses environment variables loaded from the `.env` file via `padi_core::env::load()`.

---

## 📋 Environment Variables Overview

| Key | Default | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | Application environment mode (`development`, `production`, `test`) |
| `APP_DEBUG` | `true` | Enable detailed stack traces, debug logs, and query details (`true` or `false`) |
| `APP_HOST` | `0.0.0.0` | Host IP address for the Axum HTTP server to bind |
| `APP_PORT` | `8080` | Port for the Axum HTTP server to listen on |
| `DB_DRIVER` | `sqlite` | Database driver (`sqlite`, `mysql`, `pgsql`) |
| `DB_DATABASE` | `database/app.db` | SQLite database file path, or database name for MySQL/Postgres |
| `DATABASE_URL` | - | Direct database connection URL (e.g. `postgres://user:pass@127.0.0.1:5432/padi`) |
| `DB_HOST` | `127.0.0.1` | Database server host (when not using `DATABASE_URL`) |
| `DB_PORT` | `3306` (or `5432`) | Database server port |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | - | Database user password |
| `JWT_SECRET` | - | Secret key for signing and verifying HS256 JWT tokens (minimum 32 characters) |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
| `JWT_EXPIRATION` | `24` | Token expiration time in hours |
| `CORS_ALLOWED_ORIGINS` | `*` | Comma-separated list of allowed CORS origins, or `*` for all |
| `RESPONSE_FORMAT` | `full` | Standardized API response format mode (`full` / `compact`) |
| `ENABLE_COMPRESSION` | `true` | Enable Gzip / compression for response bodies |
| `CACHE_DRIVER` | `file` | Cache driver engine (`file` or memory) |
| `CACHE_TTL` | `300` | Default cache expiration time in seconds |

---

## 🔒 Production Recommendations

1. **Environment Mode:** Set `APP_ENV=production` and `APP_DEBUG=false` to protect internal error traces.
2. **Cryptographic Secrets:** Ensure `JWT_SECRET` is at least 32 characters long with high entropy. The framework will reject default or weak secrets.
3. **Restricted CORS:** Specify your exact client domains (e.g., `CORS_ALLOWED_ORIGINS="https://app.yourdomain.com"`).
4. **Database URL:** For production databases (PostgreSQL or MySQL), configure `DATABASE_URL` to utilize optimized connection pools.
5. **Port / Host Overrides:** When launching the server in production or container environments, you can override host and port directly:
   ```bash
   padi serve --port=3000 --host=127.0.0.1
   ```
