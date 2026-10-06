# 🛑 Error Handling & Panic Recovery

## 🛡️ Resilient, Structured Error Handling

In Padi Go Framework, errors and panics are handled gracefully using standardized HTTP status codes, structured JSON responses, and panic recovery middleware.

---

## 📋 Table of Contents

- [🛡️ Resilient, Structured Error Handling](#resilient-structured-error-handling)
- [📦 Standard Error Format](#standard-error-format)
- [🛠️ Error Response Helpers](#error-response-helpers)
- [🚨 Panic Recovery Middleware](#panic-recovery-middleware)
- [📝 Input Validation Errors](#input-validation-errors)

---

## 📦 Standard Error Format

All error responses from Padi APIs conform to a predictable structure:

```json
{
  "status": 404,
  "success": false,
  "message": "Product not found"
}
```

Validation failures return structured field-level errors:

```json
{
  "status": 422,
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "The email field must be a valid email address",
    "password": "Password must be at least 6 characters long"
  }
}
```

---

## 🛠️ Error Response Helpers

The `github.com/wibiesana/padi_go_core/response` package provides standard error functions:

```go
import "github.com/wibiesana/padi_go_core/response"

// 400 Bad Request
response.BadRequest(w, "Invalid ID parameter")

// 401 Unauthorized
response.Unauthorized(w, "Authentication required")

// 403 Forbidden
response.Forbidden(w, "Insufficient permissions")

// 404 Not Found
response.NotFound(w, "Article not found")

// 422 Unprocessable Entity (Validation Error)
response.UnprocessableEntity(w, validationErrors, "Validation failed")

// 500 Internal Server Error
response.InternalServerError(w, "Database connection failure")
```

---

## 🚨 Panic Recovery Middleware

The `middleware.Recoverer` middleware intercepts any runtime panics in HTTP goroutines, logs the stack trace, and prevents server crashes:

```go
r.Use(middleware.Recoverer)
```

When an unhandled panic occurs — including infrastructure panics such as a database initialisation failure from `database.GetDB()` — the client receives a clean 500 JSON response:

```json
{
  "status": 500,
  "success": false,
  "message": "Internal server error"
}
```

In **development mode** (`config.IsDebug()` returns `true`), the response also includes a `debug.trace` array with filtered stack frames so you can pinpoint the exact cause.

---

## 📝 Input Validation Errors

Use `validator.BindJSON` to automatically parse and validate request bodies:

```go
func (c *UserController) Store(w http.ResponseWriter, r *http.Request) {
	var item models.User
	if errs, err := validator.BindJSON(r, &item); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	// ...
}
```
