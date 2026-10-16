# 🗄️ Multi-Database Support Guide

Padi Rust Framework seamlessly connects to **SQLite**, **MySQL/MariaDB**, and **PostgreSQL** using SQLx asynchronous connection pools.

---

## 📋 Database Configuration

Configure your database driver in `.env`:

```env
# 1. SQLite (Default embedded file database)
DB_DRIVER=sqlite
DB_DATABASE=database/app.db

# 2. PostgreSQL
# DB_DRIVER=pgsql
# DATABASE_URL=postgres://user:password@127.0.0.1:5432/padi_db
# Or individual fields:
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=padi_db
# DB_USERNAME=postgres
# DB_PASSWORD=secret

# 3. MySQL / MariaDB
# DB_DRIVER=mysql
# DATABASE_URL=mysql://root:secret@127.0.0.1:3306/padi_db
```

---

## 🛠️ Database Engine Specifics

| Feature | SQLite | MySQL / MariaDB | PostgreSQL |
| :--- | :---: | :---: | :---: |
| **Driver Engine** | SQLx AnyPool | SQLx AnyPool | SQLx AnyPool |
| **Default Location** | `database/app.db` | Server Host & Port | Server Host & Port |
| **Primary Key Syntax** | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT AUTO_INCREMENT PRIMARY KEY` | `SERIAL PRIMARY KEY` |
| **Concurrency Mode** | WAL mode enabled | Asynchronous connection pool | Asynchronous connection pool |

---

## ⚡ Cross-Database Query Builder Syntax

The Padi Query Builder (`Query::table(...)`) and ActiveRecord ORM automatically handle driver nuances:
- Placeholder syntax and quoting are handled consistently.
- Schema introspection (`padi g <table_name>`) automatically switches between SQLite `PRAGMA table_info`, MySQL `information_schema.columns`, and PostgreSQL `information_schema.columns`.
