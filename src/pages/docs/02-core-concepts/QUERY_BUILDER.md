# 🔍 Query Builder in Padi Rust Framework

## 💎 Fluent, Safe, and Database-Agnostic Querying

The **Padi Query Builder** (`padi_core::query::Query`) provides a fluent, expressive interface to construct and execute database queries safely with automatic parameterized value binding and SQL injection prevention.

---

## 📋 Table of Contents

- [💎 Fluent, Safe, and Database-Agnostic Querying](#fluent-safe-and-database-agnostic-querying)
- [🚀 Basic Usage](#basic-usage)
- [🔍 Selecting Columns & Distinct](#selecting-columns--distinct)
- [🎯 Where Clauses](#where-clauses)
  - [Equality & Comparison Operators](#equality--comparison-operators)
  - [Where In & Where Not In](#where-in--where-not-in)
  - [Where Between](#where-between)
  - [Where Null & Where Not Null](#where-null--where-not-null)
  - [Smart Filtering (`filter_where`)](#smart-filtering-filter_where)
- [🔗 Joins](#joins)
- [📊 Aggregates & Counts](#aggregates--counts)
- [📑 Ordering, Grouping, & Pagination](#ordering-grouping--pagination)
- [🔒 Row Locking (`FOR UPDATE`)](#row-locking-for-update)

---

## 🚀 Basic Usage

Create a query instance using `Query::table("table_name")` or via model `.find_query()`:

```rust
use padi_core::prelude::*;

// Fetch a list of active products
let products: Vec<Value> = Query::table("products")
    .where_eq("status", "active")
    .order_by("price", "DESC")
    .limit(10)
    .get()
    .await?;

// Fetch a single record
let product: Option<Value> = Query::table("products")
    .where_eq("id", 42)
    .first()
    .await?;
```

---

## 🔍 Selecting Columns & Distinct

```rust
// Select specific columns
Query::table("users").select(&["id", "name", "email"]);

// Add extra columns dynamically
let mut q = Query::table("users").select(&["id", "name"]);
q = q.add_select(&["created_at"]);

// Distinct selection
Query::table("users").distinct().select(&["role"]);
```

---

## 🎯 Where Clauses

### Equality & Comparison Operators
```rust
// Equality
Query::table("users").where_eq("status", "active");

// Comparisons: gt (>), gte (>=), lt (<), lte (<=), not_eq (!=)
Query::table("products").where_gte("price", 100);
Query::table("users").where_not_eq("role", "banned");

// Pattern Matching (LIKE / ILIKE)
Query::table("users").where_like("email", "%@example.com");

// OR Conditions
Query::table("products")
    .where_eq("category", "Electronics")
    .or_where_gt("stock", 0);
```

### Where In & Where Not In
```rust
Query::table("orders")
    .where_in("status", &[Val::from("pending"), Val::from("processing")]);

Query::table("users")
    .where_not_in("role", &[Val::from("banned"), Val::from("deleted")]);
```

### Where Between
```rust
Query::table("products").where_between("price", 50, 200);
```

### Where Null & Where Not Null
```rust
Query::table("articles").where_null("deleted_at");
Query::table("users").where_not_null("email_verified_at");
```

### Smart Filtering (`filter_where`)
`filter_where` ignores conditions if the given value is `None`, empty string, or null:
```rust
// Automatically skipped if search_keyword is empty:
let mut q = Query::table("products");
if !keyword.is_empty() {
    q = q.filter_where_like("name", format!("%{}%", keyword));
}
```

---

## 🔗 Joins

```rust
// Inner Join
Query::table("orders")
    .join("users", "orders.user_id", "=", "users.id")
    .select(&["orders.*", "users.name as customer_name"]);

// Left Join
Query::table("articles")
    .left_join("categories", "articles.category_id", "=", "categories.id");
```

---

## 📊 Aggregates & Counts

```rust
// Count matching rows:
let total: u64 = Query::table("users")
    .where_eq("status", "active")
    .count()
    .await?;

// Check if a row exists:
let exists: bool = Query::table("users")
    .where_eq("email", "alex@example.com")
    .exists()
    .await?;

// Pluck column values into a vector:
let ids: Vec<Value> = Query::table("products")
    .where_gt("stock", 0)
    .pluck("id")
    .await?;
```

---

## 📑 Ordering, Grouping, & Pagination

```rust
// Order by column:
Query::table("posts").order_by("created_at", "DESC");

// Group by and Having:
Query::table("orders")
    .select(&["user_id", "COUNT(*) as total_orders"])
    .group_by(&["user_id"])
    .having("total_orders > ?", &[Val::from(5)]);

// Limit and Offset:
Query::table("logs").limit(50).offset(100);

// Built-in pagination:
let paged_result: Value = Query::table("products")
    .where_eq("status", "active")
    .paginate(1, 15)
    .await?;
```

---

## 🔒 Row Locking (`FOR UPDATE`)

For transaction isolation and concurrency protection:
```rust
// Pessimistic write lock:
Query::table("accounts")
    .where_eq("id", 1)
    .lock_for_update()
    .first()
    .await?;

// Shared read lock:
Query::table("inventory")
    .where_eq("item_id", 42)
    .shared_lock()
    .first()
    .await?;
```
