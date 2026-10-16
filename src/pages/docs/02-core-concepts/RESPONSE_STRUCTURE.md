# API Response Structure & Deterministic Formats

## 💎 Deterministic API Excellence

The Padi Rust Framework Response Engine (`padi_core::response`) is designed with clarity and consistency at its core. It establishes a deterministic, predictable payload structure for frontend consumers, mobile apps, and third-party integrations.

---

## 📋 Table of Contents

- [💎 Deterministic API Excellence](#deterministic-api-excellence)
- [📦 Standard Response Specification](#standard-response-specification)
  - [1. Single Entity (`item`)](#1-single-entity-item)
  - [2. Multiple Entities / Collections (`items`)](#2-multiple-entities--collections-items)
  - [3. Paginated Collections (`items` + `meta`)](#3-paginated-collections-items--meta)
  - [4. Error Responses](#4-error-responses)
- [⚙️ Response Format Modes (`RESPONSE_FORMAT`)](#response-format-modes-response_format)
- [🛠️ Rust Handler Response Helpers](#rust-handler-response-helpers)

---

## 📦 Standard Response Specification

### 1. Single Entity (`item`)
Used by **Show** (`GET /<resource>/{id}`), **Store** (`POST /<resource>`), and **Update** (`PUT /<resource>/{id}`):

```json
{
  "code": 200,
  "status": "OK",
  "message": "Product retrieved successfully",
  "item": {
    "id": 1,
    "name": "Mechanical Keyboard",
    "price": 89.99,
    "stock": 42,
    "created_at": "2026-10-16 14:00:00",
    "updated_at": "2026-10-16 14:00:00"
  },
  "execution_time": "1.12ms"
}
```

### 2. Multiple Entities / Collections (`items`)
Used by **All** (`GET /<resource>/all`):

```json
{
  "code": 200,
  "status": "OK",
  "message": "Success",
  "items": [
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
  "execution_time": "2.05ms"
}
```

### 3. Paginated Collections (`items` + `meta`)
Used by **Index** (`GET /<resource>?page=1&per_page=15`):

```json
{
  "code": 200,
  "status": "OK",
  "message": "Success",
  "items": [
    {
      "id": 1,
      "name": "Mechanical Keyboard",
      "price": 89.99
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 45,
    "page_count": 3
  },
  "execution_time": "3.14ms"
}
```

### 4. Error Responses
Used when a request fails validation, authentication, or triggers an error:

```json
{
  "code": 422,
  "status": "VALIDATION_FAILED",
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  },
  "execution_time": "0.95ms"
}
```

---

## ⚙️ Response Format Modes (`RESPONSE_FORMAT`)

Padi supports 3 formatting styles via `.env` variable `RESPONSE_FORMAT`:

| Mode | Key In `.env` | Behavior |
| :--- | :--- | :--- |
| **Full (Default)** | `RESPONSE_FORMAT=full` | Envelopes payload with `code`, `status`, `message`, `item`/`items`, `meta`, and `execution_time`. |
| **Simple** | `RESPONSE_FORMAT=simple` | Emits `{ "status": 200, "data": ... }`. |
| **Raw** | `RESPONSE_FORMAT=raw` | Outputs raw entity or array directly without envelope. |

---

## 🛠️ Rust Handler Response Helpers

In your controller handlers, return `ApiResult` using the standard helpers:

```rust
use padi_core::prelude::*;

// 200 OK
pub async fn get_item() -> ApiResult {
    ok(json!({"id": 1, "name": "Test"}))
}

// 200 OK with custom message
pub async fn custom_message() -> ApiResult {
    ok_msg(json!({"id": 1}), "Custom success message")
}

// 201 Created
pub async fn create_item() -> ApiResult {
    created(json!({"id": 2, "name": "New Item"}))
}

// 204 No Content
pub async fn delete_item() -> ApiResult {
    no_content()
}

// Low-level responses
pub async fn download() -> AxumResponse {
    Response::download("storage/reports/annual.pdf", "report.pdf")
}
```
