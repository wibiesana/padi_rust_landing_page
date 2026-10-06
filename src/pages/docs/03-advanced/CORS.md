# 🌐 Cross-Origin Resource Sharing (CORS)

## 🛡️ Secure Cross-Origin Policy Management

Padi Go Framework provides built-in CORS handling via `middleware.Cors` with automatic preflight `OPTIONS` resolution.

---

## 📋 Table of Contents

- [🛡️ Secure Cross-Origin Policy Management](#secure-cross-origin-policy-management)
- [⚙️ Configuration (`.env`)](#configuration-env)
- [🛠️ Registering CORS Middleware](#registering-cors-middleware)
- [🔧 Custom CORS Options in Go](#custom-cors-options-in-go)
- [🧪 Testing CORS with cURL](#testing-cors-with-curl)

---

## ⚙️ Configuration (`.env`)

Configure allowed domains directly in your `.env` file:

```env
# Allow all origins (Development only)
CORS_ALLOWED_ORIGINS="*"

# Specific origins (Recommended for Production)
# CORS_ALLOWED_ORIGINS="https://myfrontend.com,https://admin.myfrontend.com"
```

---

## 🛠️ Registering CORS Middleware

CORS middleware is registered on the router in `app/Routes/api.go`:

```go
package routes

import (
	"github.com/wibiesana/padi_go_core/middleware"
	"github.com/wibiesana/padi_go_core/router"
)

func RegisterRoutes(r *router.Router) {
	// Apply global CORS middleware
	r.Use(middleware.Cors())

	// Define routes...
}
```

---

## 🔧 Custom CORS Options in Go

You can supply custom parameters to `middleware.Cors`:

```go
opts := middleware.CorsOptions{
	AllowedOrigins: []string{"https://app.example.com", "http://localhost:3000"},
	AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-Response-Format"},
	ExposedHeaders: []string{"Content-Length", "X-Total-Count"},
	AllowCredentials: true,
	MaxAge: 86400, // Cache preflight for 24 hours
}

r.Use(middleware.Cors(opts))
```

---

## 🧪 Testing CORS with cURL

Send a preflight `OPTIONS` request to verify CORS response headers:

```bash
curl -I -X OPTIONS http://localhost:8080/users \
  -H "Origin: https://myfrontend.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type"
```

**Expected Response Headers:**
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://myfrontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```
