# ⚙️ Configuration Guide

Padi Go Framework uses environment variables loaded from `.env` files via the `github.com/wibiesana/padi_go_core/config` package.

---

## 📋 Environment Variables Overview

| Key | Default | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `Padi REST API` | Name of your API application |
| `APP_ENV` | `development` | Environment mode (`development`, `dev`, `local`, `staging`, `production`) |
| `APP_PORT` | `8080` | HTTP port to listen on |
| `APP_DEBUG` | `true` | Enable detailed stack traces and debugging logs. Use `config.IsDebug()` in code to check this combined with `APP_ENV`. |
| `APP_KEY` | - | 32-character application encryption key |
| `JWT_SECRET` | - | Secret key used for signing HS256 JWT tokens |
| `JWT_EXPIRATION` | `24` | Token expiration time in hours |
| `DB_CONNECTION` | `sqlite` | Database driver (`sqlite`, `mysql`, `postgres`) |
| `DB_HOST` | `127.0.0.1` | Database server host |
| `DB_PORT` | `3306` (or `5432`) | Database server port |
| `DB_DATABASE` | `database/database.sqlite` | Database name or SQLite file path |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | - | Database user password |
| `CORS_ALLOWED_ORIGINS` | `*` | Comma-separated allowed CORS origins |
| `RATE_LIMIT_REQUESTS` | `60` | Max requests allowed per IP |
| `RATE_LIMIT_WINDOW` | `60` | Rate limiting window in seconds |

---

## 🔒 Production Recommendations

1. Set `APP_ENV=production` and `APP_DEBUG=false`.
2. Generate cryptographically random strings for `APP_KEY` and `JWT_SECRET`.
3. Specify explicit CORS domains (e.g. `CORS_ALLOWED_ORIGINS="https://app.yourdomain.com"`).
4. Use connection pooling with PostgreSQL or MySQL in high-throughput environments.

> **Tip**: Use `config.IsDebug()` in your own code instead of manually checking `cfg.AppDebug || cfg.AppEnv == "development"`. It covers `development`, `dev`, and `local` automatically.
