# 🗄️ Multi-Database Support Guide

Padi Go Framework seamlessly connects to SQLite, MySQL/MariaDB, and PostgreSQL.

---

## 📋 Database Configuration

Configure your database connection in `.env`:

```env
# 1. SQLite (Native Go modernc.org/sqlite - no CGO required)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# 2. PostgreSQL (lib/pq)
# DB_CONNECTION=postgres
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=padi_db
# DB_USERNAME=postgres
# DB_PASSWORD=secret

# 3. MySQL / MariaDB (go-sql-driver/mysql)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=padi_db
# DB_USERNAME=root
# DB_PASSWORD=secret
```

---

## 🛠️ Database Engine Specifics

| Feature | SQLite | MySQL / MariaDB | PostgreSQL |
| :--- | :---: | :---: | :---: |
| **Driver Package** | `modernc.org/sqlite` | `go-sql-driver/mysql` | `lib/pq` |
| **CGO Required** | ❌ No (Pure Go) | ❌ No | ❌ No |
| **Auto Increment PK** | `INTEGER PRIMARY KEY` | `INT AUTO_INCREMENT` | `SERIAL PRIMARY KEY` |
| **Parameter Placeholder** | `?` | `?` | `$1, $2, $3...` (Auto-converted by Query Builder) |
| **Concurrency Mode** | WAL mode enabled | Connection Pool | Connection Pool |

---

## ⚡ Cross-Database Query Builder Syntax

The Padi Query Builder automatically adapts SQL syntax across engines (e.g. converting `?` placeholders to `$1, $2` for PostgreSQL automatically when executing queries).

```go
var users []models.User
err := query.New("users").
    Where("status", "active").
    Limit(10).
    All(&users)
```
