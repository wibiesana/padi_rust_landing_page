# 🔐 Authentication & Security

## 🛡️ Fortified Identity Management

Security is the cornerstone of Padi Go REST API. Our Authentication system is built on industry-standard JSON Web Tokens (JWT) with HMAC SHA-256 signatures, stateless Bearer headers, and bcrypt password hashing.

---

## 📋 Table of Contents

- [🛡️ Fortified Identity Management](#fortified-identity-management)
- [⚡ Quick Start Flows](#quick-start-flows)
- [🔑 Endpoints Specification](#endpoints-specification)
- [🔍 JWT Validation & Context Injection](#jwt-validation--context-injection)
- [🔒 Password Hashing (`auth.HashPassword`)](#password-hashing-authhashpassword)
- [🛡️ Protecting Custom Endpoints](#protecting-custom-endpoints)

---

## ⚡ Quick Start Flows

### 1. Register a New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (201 Created):**
```json
{
  "status": 201,
  "success": true,
  "message": "User registered successfully",
  "item": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK):**
```json
{
  "status": 200,
  "success": true,
  "message": "Login successful",
  "item": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Call Protected Endpoint (`/auth/me`)
```bash
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "status": 200,
  "success": true,
  "message": "User profile retrieved",
  "item": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🔍 JWT Validation & Context Injection

The `middleware.AuthRequired` middleware automatically validates incoming tokens and injects the authenticated user claims into the Go request `context.Context`:

```go
func (c *UserController) GetProfile(w http.ResponseWriter, r *http.Request) {
	// Extract user claims from context
	claims, ok := r.Context().Value(middleware.UserContextKey).(*auth.JWTClaims)
	if !ok || claims == nil {
		response.Unauthorized(w, "Unauthenticated")
		return
	}

	userID := claims.UserID
	userEmail := claims.Email
	userRole := claims.Role

	// ...
}
```

---

## 🔒 Password Hashing (`auth.HashPassword`)

```go
import "github.com/wibiesana/padi_go_core/auth"

// 1. Hash plain password
hashed, err := auth.HashPassword("userSecretPassword")

// 2. Verify hashed password
isValid := auth.VerifyPassword(hashed, "userSecretPassword")
```

---

## 🛡️ Protecting Custom Endpoints

In `app/Routes/api.go`:

```go
r.Mux.Group(func(protected chi.Router) {
	protected.Use(middleware.AuthRequired)

	protected.Get("/admin/reports", reportCtrl.GetReports)
	protected.Post("/admin/settings", settingsCtrl.SaveSettings)
})
```
