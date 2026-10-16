# 🛡️ Security Best Practices & Hardening

Security guidelines and built-in protections provided by Padi Rust Api Framework.

---

## 📋 Table of Contents

- [🛡️ Security Best Practices & Hardening](#security-best-practices--hardening)
- [🔒 1. SQL Injection Prevention](#1-sql-injection-prevention)
- [🔑 2. Password Hashing (Bcrypt)](#2-password-hashing-bcrypt)
- [🎫 3. Stateless JWT Bearer Token Security](#3-stateless-jwt-bearer-token-security)
- [🌐 4. CORS Hardening](#4-cors-hardening)
- [🛡️ 5. Input Validation & Sanitization](#5-input-validation--sanitization)
- [📁 6. File Upload Traversal & Extension Hardening](#6-file-upload-traversal--extension-hardening)

---

## 🔒 1. SQL Injection Prevention

The Padi Query Builder (`Query::table`) and ActiveRecord utilize prepared statements with parameterized inputs (`Val::from(...)`), eliminating SQL injection risks:

```rust
// Inputs are always bound as parameters, never concatenated
Query::table("users")
    .where_eq("email", user_supplied_email)
    .first()
    .await?;
```

In addition, column and table identifiers are strictly validated against injection patterns before query compilation.

---

## 🔑 2. Password Hashing (Bcrypt)

All user passwords are encrypted using Bcrypt via `padi_core::hash`:

```rust
use padi_core::hash;

// Hash password:
let hashed = hash::make(plain_password);

// Verify password:
let is_valid = hash::check(input_password, &hashed);
```

---

## 🎫 3. Stateless JWT Bearer Token Security

Tokens use HMAC SHA-256 signatures with configured expiration:
- Signed using `JWT_SECRET` from `.env` (the framework enforces a minimum of 32 characters and rejects weak or default secrets).
- Transmitted in HTTP Header: `Authorization: Bearer <token>`.
- Verified cryptographically via the `AuthUser` extractor.

---

## 🌐 4. CORS Hardening

In production, avoid wildcards (`*`) and specify your exact domains in `.env`:

```env
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com
```

---

## 🛡️ 5. Input Validation & Sanitization

Always validate incoming request bodies using `Validator`:

```rust
let d = Validator::new(
    &body,
    &[
        ("name", "required|string|min:2|max:100"),
        ("email", "required|email|unique:users,email"),
    ],
)
.validate()
.await?;
```

---

## 📁 6. File Upload Traversal & Extension Hardening

`padi_core::file::File` enforces:
1. **Blacklist of Dangerous Extensions:** `.php`, `.exe`, `.bat`, `.sh`, `.py`, `.js`, `.dll`, etc.
2. **Whitelist Validation:** Rejects any extension not explicitly specified in `UploadOptions.allowed_types`.
3. **Randomized UUIDs:** Filenames are replaced with unguessable UUID v4 strings to prevent enumeration and overwriting attacks.
4. **Path Traversal Protection:** Validates paths to keep files within `storage/uploads`.
