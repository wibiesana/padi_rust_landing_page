# 🗄️ Database Orchestration & Transactions

## 🏗️ Multi-Database Persistence & Atomic Integrity

The Padi Database Layer (`padi_core::database::Database`) provides a unified, thread-safe connection pooling system built on **SQLx** supporting **SQLite**, **PostgreSQL**, and **MySQL/MariaDB**.

---

## 📋 Table of Contents

- [🏗️ Multi-Database Persistence & Atomic Integrity](#multi-database-persistence--atomic-integrity)
- [⚙️ Database Configuration](#database-configuration)
- [🛡️ Transaction Management](#transaction-management)
- [🔍 Direct SQL Queries](#direct-sql-queries)
- [🏊 Connection Pool Optimization](#connection-pool-optimization)
- [✨ Supported Drivers](#supported-drivers)

---

## ⚙️ Database Configuration

Configure your database connection via `.env`:

```env
# 1. SQLite (Default embedded database - zero configuration required)
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

The database pool is initialized at application startup:
```rust
Database::connect().await?;
```

---

## 🛡️ Transaction Management

Ensure atomic execution for multi-step database operations using `Database::transaction`:

```rust
use padi_core::prelude::*;

let result = Database::transaction(|tx| Box::pin(async move {
    // Step 1: Create Order
    let order_id = Database::execute_tx(
        tx,
        "INSERT INTO orders (total, user_id) VALUES (?, ?)",
        &[Val::from(150.00), Val::from(user_id)]
    ).await?;

    // Step 2: Deduct Stock
    Database::execute_tx(
        tx,
        "UPDATE products SET stock = stock - 1 WHERE id = ?",
        &[Val::from(product_id)]
    ).await?;

    Ok(order_id)
})).await?;
```

If an error is returned inside the transaction closure, the entire transaction is rolled back automatically.

---

## 🔍 Direct SQL Queries

When raw SQL is needed, use `Database::fetch_all`, `Database::fetch_one`, or `Database::execute`:

```rust
use padi_core::prelude::*;

// Fetch multiple rows:
let rows: Vec<Value> = Database::fetch_all(
    "SELECT id, name, email FROM users WHERE role = ?",
    &[Val::from("admin")]
).await?;

// Fetch a single row:
let row: Option<Value> = Database::fetch_one(
    "SELECT * FROM users WHERE id = ?",
    &[Val::from(1)]
).await?;

// Execute mutation (INSERT, UPDATE, DELETE):
let affected_rows = Database::execute(
    "UPDATE users SET status = ? WHERE id = ?",
    &[Val::from("active"), Val::from(1)]
).await?;
```

All parameters are bound using `Val::from(...)` to guarantee SQL injection safety.

---

## 🏊 Connection Pool Optimization

The connection pool size can be configured in `.env`:
```env
DB_MAX_CONNECTIONS=20
```

SQLx maintains a thread-safe asynchronous pool shared across all Tokio worker threads.

---

## ✨ Supported Drivers

| Driver | Identification | Notes |
| :--- | :--- | :--- |
| **SQLite** | `Database::is_sqlite()` | File database at `database/app.db`. WAL mode enabled for high concurrency. |
| **PostgreSQL** | `Database::is_postgres()` | Recommended for distributed cloud production deployments. |
| **MySQL / MariaDB** | `Database::is_mysql()` | Standard production RDBMS support. |
