# API Response Structure & Flexible Formats

## 💎 Deterministic API Excellence

The Padi REST API Response Engine is designed with clarity and consistency at its core. It establishes a deterministic, predictable payload structure for frontend consumers, mobile apps, and third-party integrations.

---

## 📋 Table of Contents

- [💎 Deterministic API Excellence](#deterministic-api-excellence)
- [📦 Standard Response Specification](#standard-response-specification)
  - [1. Single Entity (`item`)](#1-single-entity-item)
  - [2. Multiple Entities / Collections (`items`)](#2-multiple-entities--collections-items)
  - [3. Paginated Collections (`items` + `meta`)](#3-paginated-collections-items--meta)
  - [4. Error Responses](#4-error-responses)
- [🛠️ Go Controller Response Helpers](#go-controller-response-helpers)
- [📝 Complete Controller CRUD Example](#complete-controller-crud-example)
- [🌐 Direct Routing Standard](#direct-routing-standard)

---

## 📦 Standard Response Specification

### 1. Single Entity (`item`)
Used by **Show** (`GET /<resource>/{id}`), **Store** (`POST /<resource>`), and **Update** (`PUT /<resource>/{id}`):

```json
{
  "status": 200,
  "success": true,
  "message": "Article retrieved successfully",
  "item": {
    "id": 1,
    "title": "Getting Started with Padi Go",
    "content": "Full article body here...",
    "status": "published",
    "created_at": "2026-08-31T12:00:00Z",
    "updated_at": "2026-08-31T12:00:00Z"
  }
}
```

### 2. Multiple Entities / Collections (`items`)
Used by **All** (`GET /<resource>/all`):

```json
{
  "status": 200,
  "success": true,
  "message": "All Article retrieved successfully",
  "items": [
    {
      "id": 1,
      "title": "First Article",
      "status": "published"
    },
    {
      "id": 2,
      "title": "Second Article",
      "status": "draft"
    }
  ]
}
```

### 3. Paginated Collections (`items` + `meta`)
Used by **Index** (`GET /<resource>?page=1&per_page=15`):

```json
{
  "status": 200,
  "success": true,
  "message": "Article list retrieved successfully",
  "items": [
    {
      "id": 1,
      "title": "First Article",
      "status": "published"
    }
  ],
  "meta": {
    "total": 1,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}
```

### 4. Error Responses
Used when a request fails validation, authorization, or encounters an internal error:

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

## 🛠️ Go Controller Response Helpers

The `github.com/wibiesana/padi_go_core/response` package provides idiomatic helper functions:

| Helper Function | HTTP Code | Output Payload | Usage |
| :--- | :---: | :--- | :--- |
| `response.Item(w, item, msg...)` | `200 OK` | `{"item": ...}` | `Show`, `Update` single entity |
| `response.Created(w, item, msg...)` | `201 Created` | `{"item": ...}` | `Store` created entity |
| `response.Items(w, records, msg...)` | `200 OK` | `{"items": [...]}` | `All` unpaginated collection |
| `response.Paginated(w, records, meta, msg...)` | `200 OK` | `{"items": [...], "meta": {...}}` | `Index` paginated collection |
| `response.BadRequest(w, msg, errs...)` | `400 Bad Request` | `{"success": false, "message": ...}` | Invalid parameters |
| `response.Unauthorized(w, msg...)` | `401 Unauthorized` | `{"success": false, "message": ...}` | Missing or invalid JWT |
| `response.Forbidden(w, msg...)` | `403 Forbidden` | `{"success": false, "message": ...}` | Insufficient role/permissions |
| `response.NotFound(w, msg...)` | `404 Not Found` | `{"success": false, "message": ...}` | Entity does not exist |
| `response.UnprocessableEntity(w, errs, msg...)` | `422 Unprocessable` | `{"success": false, "errors": ...}` | Request validation failure |
| `response.InternalServerError(w, msg...)` | `500 Server Error` | `{"success": false, "message": ...}` | Unexpected database error |

---

## 📝 Complete Controller CRUD Example

```go
package controllers

import (
	"net/http"

	models "padi-template/app/Models"
	"github.com/wibiesana/padi_go_core/activerecord"
	"github.com/wibiesana/padi_go_core/query"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/router"
	"github.com/wibiesana/padi_go_core/validator"
)

type ArticleController struct{}

// 1. Paginated Index (returns 'items' & 'meta')
func (c *ArticleController) Index(w http.ResponseWriter, r *http.Request) {
	opts := query.ParseOptions(r)
	meta, records, err := activerecord.Paginate[models.Article](opts, "title", "content")
	if err != nil {
		response.InternalServerError(w, "Failed to retrieve articles")
		return
	}
	response.Paginated(w, records, meta, "Article list retrieved successfully")
}

// 2. All records (returns 'items')
func (c *ArticleController) All(w http.ResponseWriter, r *http.Request) {
	records, err := activerecord.All[models.Article]()
	if err != nil {
		response.InternalServerError(w, "Failed to retrieve all articles")
		return
	}
	response.Items(w, records, "All Article retrieved successfully")
}

// 3. Show by ID (returns 'item')
func (c *ArticleController) Show(w http.ResponseWriter, r *http.Request) {
	id, err := router.ParamUint(r, "id")
	if err != nil {
		response.BadRequest(w, "Invalid ID parameter")
		return
	}

	// FindOrFail returns an error when record does not exist — no extra nil check needed
	item, err := activerecord.FindOrFail[models.Article](id)
	if err != nil {
		response.NotFound(w, "Article not found")
		return
	}
	response.Item(w, item, "Article retrieved successfully")
}

// 4. Store (returns 'item' with 201 Created)
func (c *ArticleController) Store(w http.ResponseWriter, r *http.Request) {
	var item models.Article
	if errs, err := validator.BindJSON(r, &item); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	if err := activerecord.Save(&item); err != nil {
		response.InternalServerError(w, "Failed to create Article")
		return
	}
	response.Created(w, item, "Article created successfully")
}

// 5. Update (returns 'item')
func (c *ArticleController) Update(w http.ResponseWriter, r *http.Request) {
	id, err := router.ParamUint(r, "id")
	if err != nil {
		response.BadRequest(w, "Invalid ID parameter")
		return
	}

	item, err := activerecord.FindOrFail[models.Article](id)
	if err != nil {
		response.NotFound(w, "Article not found")
		return
	}

	if errs, err := validator.BindJSON(r, item); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	if err := activerecord.Save(item); err != nil {
		response.InternalServerError(w, "Failed to update Article")
		return
	}
	response.Item(w, item, "Article updated successfully")
}
```

---

## 🌐 Direct Routing Standard

All resources are mounted directly onto root routers (no forced `/v1` prefix):

```
GET    /articles               -> Index (Paginated)
GET    /articles/all           -> All (Full Collection)
GET    /articles/{id}          -> Show (Single Entity)
POST   /articles               -> Store (Create Entity)
PUT    /articles/{id}          -> Update (Update Entity)
DELETE /articles/{id}          -> Destroy (Delete Entity)
```

---

## 🔍 Debug Telemetry in Development

When running in development (`APP_DEBUG=true` or `APP_ENV=development`), the Response Engine automatically appends a structured `debug` block to all JSON payloads:

### Successful Response with Telemetry:
```json
{
  "status": 200,
  "success": true,
  "message": "User list retrieved successfully",
  "items": [ ... ],
  "meta": { ... },
  "debug": {
    "execution_time": "0.1823 ms",
    "environment": "development",
    "goroutines": 5,
    "memory_usage": "1.08 MB"
  }
}
```

> ⏱️ **Accurate Execution Time**: `execution_time` is measured from the moment the `Logger` middleware received the request to the time the response is sent — giving a true end-to-end latency, not a synthetic snapshot.

### Exception / Panic 500 Response with Stack Trace:
```json
{
  "status": 500,
  "success": false,
  "message": "Server Error: runtime error: invalid memory address or nil pointer dereference",
  "debug": {
    "environment": "development",
    "execution_time": "0.25 ms",
    "goroutines": 8,
    "memory_usage": "1.25 MB",
    "error": "runtime error: invalid memory address or nil pointer dereference",
    "trace": [
      "goroutine 10 [running]:",
      "padi-template/app/Controllers.(*UserController).Show(...)",
      "d:/work/my_code/padi_go_template/app/Controllers/UserController.go:45 +0x125",
      "net/http.HandlerFunc.ServeHTTP(...)"
    ]
  }
}
```

> 🛡️ **Zero Overhead in Production**:  
> In production environments (`APP_DEBUG=false` and `APP_ENV=production`), the debug engine short-circuits in $< 1\text{ ns}$ without allocating memory, and Go's JSON serializer omits the `debug` field completely.

