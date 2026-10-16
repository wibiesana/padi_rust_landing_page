# 🔐 Authentication & Security

## 🛡️ Fortified Identity Management

Security is a cornerstone of Padi Rust REST API. The Authentication system (`padi_core::auth`) is built on industry-standard JSON Web Tokens (JWT) with HMAC SHA-256 signatures, stateless Bearer headers, Bcrypt password hashing (`padi_core::hash`), and Axum request extractors (`AuthUser`).

---

## 📋 Table of Contents

- [🛡️ Fortified Identity Management](#fortified-identity-management)
- [⚡ Quick Start Flows](#quick-start-flows)
- [🔑 Endpoints Specification](#endpoints-specification)
- [🔍 The `AuthUser` Extractor](#the-authuser-extractor)
- [🔒 Password Hashing (`hash::make` & `hash::check`)](#password-hashing-hashmake--hashcheck)
- [🛡️ Protecting Custom Endpoints](#protecting-custom-endpoints)

---

## ⚡ Quick Start Flows

### 1. Register a New User
```bash
curl -X POST http://127.0.0.1:8080/auth/register \
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
  "code": 201,
  "status": "CREATED",
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
curl -X POST http://127.0.0.1:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK):**
```json
{
  "code": 200,
  "status": "OK",
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
curl -X GET http://127.0.0.1:8080/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "code": 200,
  "status": "OK",
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

## 🔑 Endpoints Specification

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Authenticate credentials and receive JWT |
| `POST` | `/auth/refresh` | Bearer Token | Refresh expiring JWT token |
| `POST` | `/auth/logout` | Bearer Token | Invalidate session client-side |
| `GET` | `/auth/me` | Bearer Token | Retrieve currently authenticated user |

---

## 🔍 The `AuthUser` Extractor

In Padi Rust, simply adding `auth: AuthUser` to any controller handler signature automatically secures the endpoint. Axum intercepts the request, validates the Bearer token, and extracts the user claims. If the token is missing or invalid, it returns `401 Unauthorized` automatically:

```rust
use padi_core::prelude::*;

pub async fn my_protected_handler(auth: AuthUser) -> ApiResult {
    let user_id = auth.user_id().unwrap_or(0);
    let role = auth.role().unwrap_or("user");

    ok(json!({
        "message": "Access granted",
        "user_id": user_id,
        "role": role
    }))
}
```

---

## 🔒 Password Hashing (`hash::make` & `hash::check`)

Padi Rust uses Bcrypt password hashing:

```rust
use padi_core::hash;

// Hash plain-text password:
let hashed = hash::make("userPassword123");

// Verify password:
let is_valid = hash::check("userPassword123", &hashed);
```

---

## 🛡️ Protecting Custom Endpoints

To require specific roles, use `auth.require_role`:

```rust
pub async fn admin_only_handler(auth: AuthUser) -> ApiResult {
    // Returns 403 Forbidden if user is not admin
    auth.require_role(&["admin"])?;

    ok(json!({"admin_data": "secret stats"}))
}
```
