# 🛡️ Middleware Guide

## 🛣️ Standard HTTP Interception

Middleware in Padi Go Framework uses the idiomatic Go `func(next http.Handler) http.Handler` signature. It seamlessly integrates with the Chi router for global, group, and route-level filtering.

---

## 📋 Table of Contents

- [🛣️ Standard HTTP Interception](#standard-http-interception)
- [🛠️ Writing Custom Middleware](#writing-custom-middleware)
- [📍 Registering Middleware](#registering-middleware)
  - [Global Middleware](#global-middleware)
  - [Route Group Middleware](#route-group-middleware)
- [📦 Built-in Middleware](#built-in-middleware)

---

## 🛠️ Writing Custom Middleware

Creating custom middleware in Go is straightforward:

```go
package middleware

import (
	"net/http"
	"github.com/wibiesana/padi_go_core/response"
)

func ApiKeyHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-KEY")
		if apiKey != "expected-secret-key" {
			response.Forbidden(w, "Invalid or missing API key")
			return // Stops propagation
		}

		// Continue downstream
		next.ServeHTTP(w, r)
	})
}
```

---

## 📍 Registering Middleware

Middlewares are registered on `router.Router` or Chi route groups in `app/Routes/api.go`:

### Global Middleware
```go
func RegisterRoutes(r *router.Router) {
	// Applied to every request
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Cors())
}
```

### Route Group Middleware
```go
// Protected admin endpoints
r.Group(func(admin router.Route) {
	admin.Use(middleware.Auth)
	admin.Use(middleware.RequireRole("admin", "superadmin"))

	admin.Get("/admin/dashboard", adminCtrl.Dashboard)
})
```

---

## 📦 Built-in Middleware

| Middleware | Description |
| :--- | :--- |
| `middleware.Auth` / `middleware.AuthRequired` | Validates Bearer JWT tokens and sets `UserClaims` in request context |
| `middleware.RequireRole(roles...)` | Restricts access to users with specified roles (e.g. `"admin"`) |
| `middleware.SecurityHeaders` | Injects standard security headers (`nosniff`, `DENY`, `X-XSS-Protection`) |
| `middleware.CORS(cfg)` | Configures CORS headers based on `.env` `CORS_ALLOWED_ORIGINS` |
| `middleware.RateLimit(limit, window)` | In-memory token-bucket rate limiter per client IP. IP extracted from `X-Forwarded-For` (sanitised) or `RemoteAddr`. Expired buckets cleaned up automatically every minute to prevent memory leaks. |
| `middleware.Logger` | Structured HTTP request logger with latency, status code, and query telemetry. Stores request start time in context for accurate `execution_time` reporting. |
| `middleware.Recoverer` | Recovers from runtime panics (including `database.GetDB()` initialisation failures) and returns a clean 500 JSON with debug stack trace in development mode. |

---

## ⚙️ Debug Mode Check

All middleware that adapts its behaviour in development (`Logger` showing query telemetry, `Recoverer` including stack traces) uses `config.IsDebug()` — a single authoritative check that returns `true` when:
- `APP_DEBUG=true`, **or**
- `APP_ENV` is `development`, `dev`, or `local`

This means you never need to scatter `cfg.AppDebug || cfg.AppEnv == "development"` checks manually in your own middleware.

