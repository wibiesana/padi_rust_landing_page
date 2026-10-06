# 🛡️ Security Best Practices & Hardening

Security guidelines and built-in protections provided by Padi REST API Go Framework.

---

## 📋 Table of Contents

- [🛡️ Security Best Practices & Hardening](#security-best-practices--hardening)
- [🔒 1. SQL Injection Prevention](#1-sql-injection-prevention)
- [🔑 2. Password Hashing (Bcrypt)](#2-password-hashing-bcrypt)
- [🎫 3. Stateless JWT Bearer Token Security](#3-stateless-jwt-bearer-token-security)
- [🚦 4. Rate Limiting Middleware](#4-rate-limiting-middleware)
- [🌐 5. CORS Hardening](#5-cors-hardening)
- [🛡️ 6. Input Validation & Sanitization](#6-input-validation--sanitization)

---

## 🔒 1. SQL Injection Prevention

The Padi Query Builder and ActiveRecord utilize prepared statements with parameterized inputs (`?` or `$1, $2`), completely neutralizing SQL injection risks:

```go
// Always parameterized
query.New("users").Where("email", userSuppliedEmail).First(&user)
```

In addition, column names in `UPDATE` SET clauses are **automatically quoted** (`` `col` `` for MySQL/SQLite, `"col"` for PostgreSQL) to prevent reserved-word conflicts and identifier injection from unusual column names.

---

## 🔑 2. Password Hashing (Bcrypt)

All user passwords are encrypted using Bcrypt with adaptive work factors:

```go
import "github.com/wibiesana/padi_go_core/auth"

// Hash password
hashed, _ := auth.HashPassword(plainPassword)

// Verify password
isValid := auth.VerifyPassword(hashed, inputPassword)
```

---

## 🎫 3. Stateless JWT Bearer Token Security

Tokens use HMAC SHA-256 signatures with configured expiration:

- Signed using `JWT_SECRET` from `.env`.
- Transmitted in HTTP Header: `Authorization: Bearer <token>`.
- Inspected by `middleware.AuthRequired`.

---

## 🚦 4. Rate Limiting Middleware

Protect your API against brute-force and DDoS attacks by enabling the rate limiter in `app/Routes/api.go`:

```go
// Allow maximum 60 requests per minute per IP
r.Use(middleware.RateLimit(60, 60))
```

> **IP Identification**: The rate limiter reads `X-Forwarded-For` (first IP only, whitespace-trimmed) with fallback to `RemoteAddr`. Expired IP buckets are swept every minute by a background goroutine to prevent unbounded memory growth under long-running deployments.

---

## 🌐 5. CORS Hardening

In production, never use `CORS_ALLOWED_ORIGINS="*"`. Instead, restrict to trusted frontend domains:

```env
CORS_ALLOWED_ORIGINS="https://app.yourdomain.com,https://admin.yourdomain.com"
```

---

## 🛡️ 6. Input Validation & Sanitization

Always validate request payloads using `validator.BindJSON`:

```go
type CreateArticleRequest struct {
	Title   string `json:"title" validate:"required,min=5,max=200"`
	Content string `json:"content" validate:"required"`
	Email   string `json:"author_email" validate:"required,email"`
}
```
