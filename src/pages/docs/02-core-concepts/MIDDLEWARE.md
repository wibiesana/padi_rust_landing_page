# 🛡️ Middleware Guide

## 🛣️ Tower & Axum Middleware Architecture

Middleware in Padi Rust Framework leverages the battle-tested **Tower** and **Axum** middleware ecosystem. It intercepts, validates, and transforms HTTP requests and responses globally or on specific routes.

---

## 📋 Table of Contents

- [🛣️ Tower & Axum Middleware Architecture](#tower--axum-middleware-architecture)
- [📦 Built-in Middleware Layers](#built-in-middleware-layers)
- [🛠️ Writing Custom Middleware (`middleware::from_fn`)](#writing-custom-middleware-middlewarefrom_fn)
- [📍 Applying Middleware in Routes](#applying-middleware-in-routes)

---

## 📦 Built-in Middleware Layers

Padi automatically configures essential production middleware on startup:

| Layer / Mechanism | Description |
| :--- | :--- |
| **CORS Layer** | Parses `CORS_ALLOWED_ORIGINS` from `.env` (or defaults to `*`), handling preflight `OPTIONS` requests automatically. |
| **Panic Recovery Layer** | Intercepts unexpected thread panics, logs details, and formats them as clean 500 `ApiError` JSON responses instead of crashing the server. |
| **Request Tracing & Logger** | Structured request tracing via `tracing-subscriber` and `tracing-appender`. Logs requests to stdout and writes daily rolling logs to `storage/logs/app.log` and `storage/logs/error.log`. |
| **Response Compression** | Built-in Gzip/Deflate compression enabled when `ENABLE_COMPRESSION=true`. |
| **`AuthUser` Extractor** | Type-safe extractor acting as authentication middleware on any handler that includes `auth: AuthUser`. |

---

## 🛠️ Writing Custom Middleware (`middleware::from_fn`)

You can create custom middleware using Axum's `middleware::from_fn`:

```rust
use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
};
use padi_core::error::ApiError;

pub async fn require_api_key(
    req: Request,
    next: Next,
) -> Result<Response, ApiError> {
    if let Some(key) = req.headers().get("X-API-KEY") {
        if key == "secret-api-key" {
            return Ok(next.run(req).await);
        }
    }

    Err(ApiError::forbidden("Invalid or missing API key"))
}
```

---

## 📍 Applying Middleware in Routes

Register your middleware using `.layer()` on Axum routers:

```rust
use axum::{middleware, Router};

pub fn admin_routes() -> Router {
    Router::new()
        .route("/metrics", get(metrics_handler))
        .layer(middleware::from_fn(require_api_key))
}
```

---

## ⚙️ Debug vs Production Handling

In development mode (`APP_ENV=development` or `APP_DEBUG=true`), `ApiError` includes internal error messages and detailed traces. In production (`APP_ENV=production`), sensitive internal details are hidden to prevent information disclosure.
