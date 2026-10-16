# 🎮 Controllers Guide

Controllers in Padi Rust Framework are asynchronous Axum request handlers that encapsulate business logic, input validation, and response formatting.

---

## 📋 Architecture

Controllers reside in `src/controllers/` as modular handler functions. Each resource file exposes standard CRUD handler functions:
- `index`: Paginated listing (`GET /<resource>`)
- `all`: Unpaginated list (`GET /<resource>/all`)
- `show`: Single record details (`GET /<resource>/{id}`)
- `store`: Create new record (`POST /<resource>`)
- `update`: Update record (`PUT /<resource>/{id}`)
- `destroy`: Delete record (`DELETE /<resource>/{id}`)

---

## 🛠️ Example Controller (`src/controllers/products.rs`)

```rust
use padi_core::prelude::*;
use crate::{models::PRODUCTS, resources::ProductResource};

/// GET /products?page=1&per_page=10
pub async fn index(_auth: AuthUser, p: Params) -> ApiResult {
    let (page, per) = p.pagination();
    ok(ProductResource::wraps(&PRODUCTS.paginate(page, per).await?))
}

/// GET /products/all
pub async fn all(_auth: AuthUser) -> ApiResult {
    ok(ProductResource::wraps(&json!(PRODUCTS.all().await?)))
}

/// GET /products/{id}
pub async fn show(_auth: AuthUser, Path(id): Path<i64>) -> ApiResult {
    ok(ProductResource::wrap(&PRODUCTS.find_or_fail(id).await?))
}

/// POST /products
pub async fn store(auth: AuthUser, Body(body): Body) -> ApiResult {
    // Role check: only admin can create products
    auth.require_role(&["admin"])?;

    // Input validation
    let d = Validator::new(
        &body,
        &[
            ("name", "required|string|min:2|max:100"),
            ("price", "required|numeric|min:0"),
            ("stock", "required|integer|min:0"),
        ],
    )
    .validate()
    .await?;

    let record = PRODUCTS.create(&d).await?;
    created(ProductResource::wrap(&record))
}

/// PUT /products/{id}
pub async fn update(auth: AuthUser, Path(id): Path<i64>, Body(body): Body) -> ApiResult {
    auth.require_role(&["admin"])?;

    let d = Validator::new(
        &body,
        &[
            ("name", "sometimes|string|min:2|max:100"),
            ("price", "sometimes|numeric|min:0"),
            ("stock", "sometimes|integer|min:0"),
        ],
    )
    .validate()
    .await?;

    let record = PRODUCTS.update(id, &d).await?;
    ok(ProductResource::wrap(&record))
}

/// DELETE /products/{id}
pub async fn destroy(auth: AuthUser, Path(id): Path<i64>) -> ApiResult {
    auth.require_role(&["admin"])?;
    PRODUCTS.delete(id).await?;
    no_content()
}
```

---

## 📥 Type-Safe Axum Extractors

| Extractor | Type | Description |
| :--- | :--- | :--- |
| `auth: AuthUser` | `AuthUser` | Decodes JWT Bearer token; enforces authentication (returns 401 if missing/invalid) |
| `p: Params` | `Params` | Parses URL query strings (`p.get("filter")`, `p.pagination()`) |
| `Path(id): Path<i64>` | `Path<T>` | Extracts URL path parameter |
| `Body(body): Body` | `Body` | Parses request JSON body into `serde_json::Value` |

---

## 📤 Standard Response Helpers

| Helper | HTTP Status | Use Case |
| :--- | :--- | :--- |
| `ok(data)` | 200 OK | Successful retrieve or update operations |
| `ok_msg(data, "message")` | 200 OK | Successful operation with custom message |
| `created(data)` | 201 Created | Newly created resource |
| `no_content()` | 204 No Content | Successful deletion without payload |
| `Response::json(data, 200)` | Custom | Low-level JSON builder |
| `Response::download(path, name)` | 200 OK | File download stream |

---

## ⚡ Generating Controllers via CLI

```bash
# Generate controller scaffold:
padi make:controller Product

# Or generate complete CRUD (Model + Resource + Controller + Route):
padi g products
```
