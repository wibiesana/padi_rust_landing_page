# 🌐 Cross-Origin Resource Sharing (CORS)

## 🛡️ Secure Cross-Origin Policy Management

Padi Rust Framework provides built-in CORS handling powered by Tower HTTP's `CorsLayer` with automatic preflight `OPTIONS` resolution.

---

## 📋 Table of Contents

- [🛡️ Secure Cross-Origin Policy Management](#secure-cross-origin-policy-management)
- [⚙️ Configuration (`.env`)](#configuration-env)
- [🛠️ How CORS Operates in Padi Rust](#how-cors-operates-in-padi-rust)
- [🧪 Testing CORS with cURL](#testing-cors-with-curl)

---

## ⚙️ Configuration (`.env`)

Configure allowed domains directly in your `.env` file:

```env
# Allow all origins (Development only)
CORS_ALLOWED_ORIGINS=*

# Specific origins (Recommended for Production)
# CORS_ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
```

---

## 🛠️ How CORS Operates in Padi Rust

When the `Application` boots up in `src/main.rs`, it reads `CORS_ALLOWED_ORIGINS`:
1. If set to `*`, it permits any origin.
2. If set to a comma-separated list of origins, it validates that incoming request `Origin` headers match one of the allowed origins.
3. Automatically permits standard headers: `Authorization`, `Content-Type`, `Accept`, and standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).

---

## 🧪 Testing CORS with cURL

Send an `OPTIONS` preflight check to verify CORS headers:

```bash
curl -I -X OPTIONS http://127.0.0.1:8080/users \
  -H "Origin: https://app.example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type"
```

**Expected Response Headers:**
```http
HTTP/1.1 200 OK
access-control-allow-origin: https://app.example.com
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: authorization, content-type
```
