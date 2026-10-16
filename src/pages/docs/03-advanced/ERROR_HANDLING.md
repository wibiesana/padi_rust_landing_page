# 🛑 Error Handling & Panic Recovery

## 🛡️ Resilient, Structured Error Handling

In Padi Rust Framework, errors and thread panics are handled gracefully using `padi_core::error::ApiError`, structured JSON responses, and panic recovery middleware layers.

---

## 📋 Table of Contents

- [🛡️ Resilient, Structured Error Handling](#resilient-structured-error-handling)
- [📦 Standard Error Format](#standard-error-format)
- [🛠️ The `ApiError` Type](#the-apierror-type)
- [🚨 Panic Recovery](#panic-recovery)
- [📝 Input Validation Errors](#input-validation-errors)

---

## 📦 Standard Error Format

All error responses from Padi APIs conform to a deterministic structure:

```json
{
  "code": 404,
  "status": "NOT_FOUND",
  "message": "Product not found",
  "execution_time": "1.05ms"
}
```

Validation failures return structured field-level errors:

```json
{
  "code": 422,
  "status": "VALIDATION_FAILED",
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field must be a valid email address.",
      "The email has already been taken."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  },
  "execution_time": "0.91ms"
}
```

---

## 🛠️ The `ApiError` Type

Handlers return `ApiResult` (which is `Result<ApiResponse, ApiError>`). Use standard constructors:

```rust
use padi_core::prelude::*;

// 400 Bad Request
return Err(ApiError::bad_request("Invalid ID parameter"));

// 401 Unauthorized
return Err(ApiError::unauthorized("Invalid token or credentials"));

// 403 Forbidden
return Err(ApiError::forbidden("Insufficient permissions"));

// 404 Not Found
return Err(ApiError::not_found("Resource not found"));

// 422 Validation Error
return Err(ApiError::unprocessable("The given data was invalid."));

// 500 Internal Server Error
return Err(ApiError::internal("Failed to connect to database"));
```

Because `ApiError` implements `From<sqlx::Error>`, database errors can be propagated cleanly using the standard Rust `?` operator:
```rust
let record = PRODUCTS.find_or_fail(id).await?;
```

---

## 🚨 Panic Recovery

The built-in Tower catch-panic layer intercepts unexpected thread panics across worker threads, logs the stack trace to `storage/logs/error.log`, and prevents the application process from terminating.

The client receives a clean 500 JSON response:
```json
{
  "code": 500,
  "status": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error",
  "execution_time": "0.45ms"
}
```

In development mode (`APP_ENV=development` or `APP_DEBUG=true`), internal error details are surfaced to assist debugging.

---

## 📝 Input Validation Errors

`padi_core::validator::Validator` automatically formats validation failures into the standardized 422 JSON payload:

```rust
let d = Validator::new(
    &body,
    &[
        ("name", "required|string|min:2|max:100"),
        ("email", "required|email|unique:users,email"),
        ("password", "required|string|min:8"),
    ],
)
.validate()
.await?;
```
