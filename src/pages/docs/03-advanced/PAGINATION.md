# 📄 Pagination & Search Guide

## 📊 Industrial-Grade Data Streaming & Pagination

Padi Rust Framework provides a high-performance pagination engine built into both **ActiveRecord** (`PRODUCTS.paginate(page, per_page)`) and the **Query Builder** (`Query::table(...).paginate(...)`).

---

## 📋 Table of Contents

- [📊 Industrial-Grade Data Streaming & Pagination](#industrial-grade-data-streaming--pagination)
- [📦 Response Structure](#response-structure)
- [🛠️ ActiveRecord Pagination in Handlers](#activerecord-pagination-in-handlers)
- [🔍 Query Parameters](#query-parameters)
- [📑 Query Builder Pagination](#query-builder-pagination)

---

## 📦 Response Structure

All paginated responses in Padi follow a deterministic format:

```json
{
  "success": true,
  "message": "Success",
  "message_code": "SUCCESS",
  "item": {
    "data": [
      {
        "id": 1,
        "name": "Mechanical Keyboard",
        "price": 89.99
      },
      {
        "id": 2,
        "name": "Wireless Mouse",
        "price": 49.99
      }
    ],
    "meta": {
      "total": 50,
      "per_page": 15,
      "current_page": 1,
      "last_page": 4,
      "from": 1,
      "to": 15
    }
  }
}
```

---

## 🛠️ ActiveRecord Pagination in Handlers

Use the `p: Params` extractor in your controller handler to parse `page` and `per_page` query strings:

```rust
use padi_core::prelude::*;
use crate::{models::PRODUCTS, resources::ProductResource};

pub async fn index(_auth: AuthUser, p: Params) -> ApiResult {
    // Extracts ?page=1&per_page=15 (defaults: page 1, per_page 15)
    let (page, per_page) = p.pagination();

    // Fetch paginated envelope from ActiveRecord
    let paginated = PRODUCTS.paginate(page, per_page).await?;

    // Transform collection via ProductResource
    ok(ProductResource::wraps(&paginated))
}
```

---

## 🔍 Query Parameters

| Parameter | Type | Default | Example | Description |
| :--- | :---: | :---: | :--- | :--- |
| `page` | `i64` | `1` | `?page=2` | Current page number |
| `per_page` | `i64` | `15` | `?per_page=25` | Number of items per page |
| `sort` | `string` | `"id"` | `?sort=price` | Column to sort by |
| `order` | `string` | `"asc"` | `?order=desc` | Direction (`asc` or `desc`) |

---

## 📑 Query Builder Pagination

When building complex queries with joins and filters, call `.paginate(page, per_page)` directly on `Query`:

```rust
use padi_core::prelude::*;

pub async fn search_products(p: Params) -> ApiResult {
    let (page, per) = p.pagination();
    let category = p.get("category").unwrap_or("Electronics");

    let paged_data = Query::table("products")
        .where_eq("category", category)
        .where_gt("stock", 0)
        .order_by("price", "ASC")
        .paginate(page, per)
        .await?;

    ok(paged_data)
}
```
