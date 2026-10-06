# 🗄️ Database Orchestration & Transactions

## 🏗️ Industrial-Grade Persistence & Atomic Integrity

The Padi Database Layer (`github.com/wibiesana/padi_go_core/database`) provides a unified, thread-safe connection pooling system and atomic transaction management across **SQLite**, **PostgreSQL**, and **MySQL/MariaDB**.

---

## 📋 Table of Contents

- [🏗️ Industrial-Grade Persistence & Atomic Integrity](#industrial-grade-persistence--atomic-integrity)
- [⚙️ Database Configuration](#database-configuration)
- [🛡️ Transaction Management](#transaction-management)
  - [⚡ Automatic Transactions (`database.Transaction`)](#automatic-transactions-databasetransaction)
  - [🛠️ Manual Transactions (`Begin`, `Commit`, `Rollback`)](#manual-transactions-begin-commit-rollback)
- [🏊 Connection Pool Optimization](#connection-pool-optimization)
- [🔍 Supported Drivers](#supported-drivers)
- [✨ Architectural Benefits](#architectural-benefits)

---

## ⚙️ Database Configuration

Database credentials are read from `.env` and initialized via `database.InitDB`:

```env
# 1. SQLite (Pure Go driver - no CGO required)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# 2. PostgreSQL
# DB_CONNECTION=postgres
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=padi_db
# DB_USERNAME=postgres
# DB_PASSWORD=secret

# 3. MySQL / MariaDB
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=padi_db
# DB_USERNAME=root
# DB_PASSWORD=secret
```

---

## 🛡️ Transaction Management

Ensure **Absolute Atomicity** for your critical financial and multi-step operations.

### ⚡ Automatic Transactions (`database.Transaction`)
The recommended approach. Automatically commits if the closure returns `nil`, and automatically rolls back if an error occurs or a panic is caught:

```go
import (
	"database/sql"
	"github.com/wibiesana/padi_go_core/database"
)

err := database.Transaction(func(tx *sql.Tx) error {
	// Step 1: Create Order
	res, err := tx.Exec("INSERT INTO orders (total, user_id) VALUES (?, ?)", 150000, userID)
	if err != nil {
		return err // Automatically rolls back
	}
	orderID, _ := res.LastInsertId()

	// Step 2: Deduct Stock
	_, err = tx.Exec("UPDATE products SET stock = stock - 1 WHERE id = ?", productID)
	if err != nil {
		return err // Automatically rolls back
	}

	// Step 3: Insert Order Item
	_, err = tx.Exec("INSERT INTO order_items (order_id, product_id) VALUES (?, ?)", orderID, productID)
	return err
})

if err != nil {
	log.Printf("Transaction failed and rolled back: %v", err)
}
```

---

### 🛠️ Manual Transactions (`Begin`, `Commit`, `Rollback`)

Use for surgical control over the transaction lifecycle:

```go
tx, err := database.Begin()
if err != nil {
	return err
}
defer tx.Rollback() // Safe no-op if Commit() succeeds

// Execute queries on tx
_, err = tx.Exec("UPDATE wallets SET balance = balance - ? WHERE user_id = ?", amount, senderID)
if err != nil {
	return err
}

_, err = tx.Exec("UPDATE wallets SET balance = balance + ? WHERE user_id = ?", amount, receiverID)
if err != nil {
	return err
}

// Explicit Commit
return tx.Commit()
```

---

## 🏊 Connection Pool Optimization

Padi automatically configures healthy production defaults for `sql.DB`:

```go
db := database.GetDB()

// Max idle connections retained in pool
db.SetMaxIdleConns(25)

// Max open connections to database server
db.SetMaxOpenConns(100)

// Maximum amount of time a connection may be reused
db.SetConnMaxLifetime(15 * time.Minute)
```

---

## 🔍 Supported Drivers

| Driver | Go Package | Notes |
| :--- | :--- | :--- |
| **SQLite** | `modernc.org/sqlite` | Pure Go, 100% CGO-free, cross-compilation friendly |
| **PostgreSQL** | `github.com/lib/pq` | Enterprise analytical indexing, JSONB support |
| **MySQL / MariaDB** | `github.com/go-sql-driver/mysql` | High-throughput web workloads, connection pooling |

---

## ✨ Architectural Benefits

1. **Zero-CGO SQLite**: Compile anywhere (Windows, macOS, Linux Alpine) with `CGO_ENABLED=0` without installing GCC.
2. **Safe Generics**: Query Builder and ActiveRecord seamlessly integrate with `*sql.DB` and `*sql.Tx`.
3. **Panic Safety**: Automatic transaction rollback prevents dangling database locks upon runtime panics.
4. **Recoverable Initialisation Failure**: `database.GetDB()` uses `panic` (instead of `log.Fatalf`) when a connection cannot be established, so the `middleware.Recoverer` can intercept the failure, log a proper stack trace, and return a clean `500` JSON response rather than abruptly killing the server process.
