# 🔍 Query Builder in Padi Go Framework

## 💎 Fluent, Safe, and Database-Agnostic Querying

The **Padi Query Builder** provides a fluent, expressive interface to construct and execute database queries safely with automatic parameter binding and SQL injection prevention.

---

## 📋 Table of Contents

- [💎 Fluent, Safe, and Database-Agnostic Querying](#fluent-safe-and-database-agnostic-querying)
- [🚀 Basic Usage](#basic-usage)
- [🔍 Selecting Columns & Distinct](#selecting-columns--distinct)
- [🎯 Where Clauses](#where-clauses)
  - [Simple Where & Multiple Conditions](#simple-where--multiple-conditions)
  - [WhereIn & WhereNotIn](#wherein--wherenotin)
  - [WhereBetween & WhereNotBetween](#wherebetween--wherenotbetween)
  - [WhereNull & WhereNotNull](#wherenull--wherenotnull)
  - [WhereNot (Negated Conditions)](#wherenot-negated-conditions)
  - [FilterWhere & OrFilterWhere (Smart Optional Filters)](#filterwhere--orFilterwhere-smart-optional-filters)
  - [Search (Multi-Column Search)](#search-multi-column-search)
- [🔗 Joins](#joins)
- [📊 Aggregates (Count, Sum, Avg, Min, Max)](#aggregates-count-sum-avg-min-max)
- [📑 Ordering, Grouping, & Pagination](#ordering-grouping--pagination)
- [⚡ Direct Mutation (Insert, Update, Delete)](#direct-mutation-insert-update-delete)

---

## 🚀 Basic Usage

### 1. Type-Safe Generic Execution (`GetAll` & `GetFirst`)
```go
import "github.com/wibiesana/padi_go_core/query"

// Query products and return directly as []Product
products, err := query.GetAll[Product](
    query.New("products").
        Where("status", "active").
        OrderBy("price", "DESC").
        Limit(10),
)

// Query single product as *Product
product, err := query.GetFirst[Product](
    query.New("products").Where("id", 42),
)
```

### 2. Traditional Scan into Struct Slice
```go
var products []Product
err := query.New("products").
    Where("status", "active").
    OrderBy("price", "DESC").
    Limit(10).
    All(&products)
```

---

## 🔍 Selecting Columns & Distinct

```go
// Select specific columns
query.New("users").Select("id", "name", "email")

// Add select dynamically
q := query.New("users").Select("id", "name")
q.AddSelect("created_at")

// Distinct query
query.New("users").Distinct().Select("role")
```

---

## 🎯 Where Clauses

### Simple Where & Multiple Conditions
```go
// Equality
query.New("users").Where("status", "active")

// Custom Operators (<, >, <=, >=, !=, LIKE, ILIKE)
query.New("products").Where("price", ">=", 100)
query.New("users").Where("email", "LIKE", "%@gmail.com")

// Multiple WHERE (AND / OR)
query.New("products").
    Where("category", "Electronics").
    AndWhere("price", "<", 500).
    OrWhere("is_featured", true)
```

### WhereIn & WhereNotIn
```go
// Slice or variadic parameters
query.New("orders").WhereIn("status", "pending", "processing", "shipped")
query.New("users").WhereNotIn("role", "banned", "deleted")
```

### WhereBetween & WhereNotBetween
```go
query.New("products").WhereBetween("price", 50.0, 200.0)
query.New("logs").WhereNotBetween("created_at", "2026-01-01", "2026-01-31")
```

### WhereNull & WhereNotNull
```go
query.New("users").WhereNull("deleted_at")
query.New("orders").WhereNotNull("shipped_at")
```

### WhereNot (Negated Conditions)
`WhereNot`, `AndWhereNot`, and `OrWhereNot` add negated `NOT (col op val)` conditions:

```go
// NOT (status = 'banned') — default equality operator
query.New("users").WhereNot("status", "banned")

// NOT (price >= 1000) — custom operator
query.New("products").WhereNot("price", ">=", 1000)

// Chaining AND NOT / OR NOT
query.New("orders").
    Where("user_id", userID).
    AndWhereNot("status", "cancelled").
    OrWhereNot("status", "refunded")
```

### FilterWhere & OrFilterWhere (Smart Optional Filters)
`FilterWhere` automatically skips a condition when the value is considered empty: `nil`, empty string `""`, or empty slice/map. This makes building search forms effortless — no manual `if` checks required:

```go
// Each condition is only added if the value is non-empty.
// An empty searchCategory or 0 minPrice simply produces no SQL clause.
query.New("products").
    FilterWhere("category", searchCategory).
    FilterWhere("status", searchStatus).
    FilterWhere("price", ">=", minPrice) // skipped when minPrice == 0 or nil

// OrFilterWhere adds OR conditions with the same skip logic
query.New("users").
    Where("role", "admin").
    OrFilterWhere("email", searchEmail)
```

> **Tip**: `FilterWhere` uses `isEmpty()` internally — it handles `nil`, `""`, and zero-length slices/maps uniformly, so you never need to guard optional filters manually.

### Search (Multi-Column Search)
```go
// Searches across multiple columns with ILIKE / LIKE
query.New("articles").Search("Golang Tutorial", "title", "content", "tags")
```

---

## 🔗 Joins

```go
// Inner Join
query.New("articles").
    Join("users", "users.id", "=", "articles.author_id")

// Left Join
query.New("articles").
    LeftJoin("categories", "categories.id", "=", "articles.category_id")

// Right Join
query.New("users").
    RightJoin("orders", "orders.user_id", "=", "users.id")
```

---

## 📊 Aggregates (Count, Sum, Avg, Min, Max)

```go
// 1. Count
count, err := query.New("users").Where("status", "active").Count()

// 2. Exists
exists, err := query.New("users").Where("email", "john@example.com").Exists()

// 3. Sum
totalRevenue, err := query.New("orders").Where("status", "paid").Sum("total_amount")

// 4. Average
avgPrice, err := query.New("products").Avg("price")

// 5. Min & Max
minPrice, err := query.New("products").Min("price")
maxPrice, err := query.New("products").Max("price")
```

---

## 📑 Ordering, Grouping, & Pagination

```go
// Ordering
query.New("products").
    OrderBy("created_at", "DESC").
    AddOrderBy("price", "ASC")

// GroupBy & Having
query.New("orders").
    Select("user_id", "COUNT(*) as total_orders").
    GroupBy("user_id").
    Having("COUNT(*)", ">", 5)

// Pagination Helper
var items []Product
meta, err := query.New("products").
    Where("status", "active").
    Paginate(1, 15, &items)
// meta contains: Total, PerPage, CurrentPage, LastPage, From, To
```

---

## ⚡ Direct Mutation (Insert, Update, Delete)

```go
// Direct Insert
newID, err := query.New("logs").Insert(map[string]interface{}{
    "action":     "user_login",
    "ip_address": "127.0.0.1",
    "created_at": time.Now(),
})

// Direct Update
affectedRows, err := query.New("users").
    Where("status", "pending").
    Where("created_at", "<", time.Now().AddDate(0, -1, 0)).
    Update(map[string]interface{}{
        "status": "expired",
    })

// Direct Delete
deletedRows, err := query.New("sessions").
    Where("expired_at", "<", time.Now()).
    Delete()
```
