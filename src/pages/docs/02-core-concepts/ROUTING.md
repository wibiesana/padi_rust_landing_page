# 🛣️ Routing Guide

Padi Rust Framework uses **Axum Router** powered by Tokio and Tower under the hood. All routes are modular, zero-cost, and type-safe.

---

## 📋 Table of Contents

- [🚀 Route Registration Architecture](#route-registration-architecture)
- [📦 Resource Routing](#resource-routing)
- [🛡️ Route Nesting & Groups](#route-nesting--groups)
- [🔀 Path Parameters](#path-parameters)
- [📡 Realtime SSE & Static Serving](#realtime-sse--static-serving)

---

## 🚀 Route Registration Architecture

In Padi Rust, the main router is defined in `src/routes/mod.rs` and composed using nested sub-routers:

```rust
// src/routes/mod.rs
use padi_core::prelude::*;

mod auth;
mod site;
mod users;
mod products;

pub fn api() -> Router {
    Router::new()
        .merge(site::routes())
        .nest("/auth", auth::routes())
        .nest("/users", users::routes())
        .nest("/products", products::routes())
}
```

The router is mounted into the application in `src/main.rs`:
```rust
Application::new(root, routes::api()).run().await
```

---

## 📦 Resource Routing

Each resource defines its routes in `src/routes/<resource>.rs`:

```rust
// src/routes/products.rs
use padi_core::prelude::*;
use crate::controllers::products;

pub fn routes() -> Router {
    Router::new()
        .route("/", get(products::index).post(products::store))
        .route("/all", get(products::all))
        .route("/{id}", get(products::show).put(products::update).delete(products::destroy))
}
```

This maps standard REST operations cleanly:
- `GET /products`: `products::index` (paginated collection)
- `GET /products/all`: `products::all` (unpaginated list)
- `POST /products`: `products::store` (create record)
- `GET /products/{id}`: `products::show` (single record)
- `PUT /products/{id}`: `products::update` (update record)
- `DELETE /products/{id}`: `products::destroy` (delete record)

---

## 🛡️ Route Nesting & Groups

You can group routes under prefixes or API versions using Axum or `RouterExt`:

```rust
use padi_core::prelude::*;

// Using standard Axum nesting:
Router::new()
    .nest("/api/v1", api_v1_routes)

// Or using Padi RouterExt:
Router::new()
    .version("v1", |r| {
        r.nest("/users", users::routes())
         .nest("/products", products::routes())
    })
```

---

## 🔀 Path Parameters

Path parameters are matched with `{param_name}` in the route definition and extracted with `Path(val): Path<T>`:

```rust
// Route definition
.route("/{id}", get(show_handler))

// Handler function:
pub async fn show_handler(Path(id): Path<i64>) -> ApiResult {
    let item = PRODUCTS.find_or_fail(id).await?;
    ok(ProductResource::wrap(&item))
}
```

---

## 📡 Realtime SSE & Static Serving

Padi provides built-in handlers for Realtime Server-Sent Events (SSE):

```rust
use padi_core::prelude::*;

// In your router:
Router::new()
    .route("/realtime", get(Realtime::sse_handler))
```

Clients can subscribe to topics via `http://localhost:8080/realtime?topic=orders`.
