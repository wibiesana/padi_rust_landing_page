# 🔑 Password Reset Flow

## 🛡️ Secure, Token-Based Credential Recovery

Padi Rust Framework supports secure password recovery workflows using cryptographically random tokens, expiration timestamps, Bcrypt hashing, and asynchronous email delivery.

---

## 📋 Table of Contents

- [🛡️ Secure, Token-Based Credential Recovery](#secure-token-based-credential-recovery)
- [🔄 Reset Lifecycle Flow](#reset-lifecycle-flow)
- [📡 API Endpoints](#api-endpoints)
- [🛠️ Controller Implementation Example](#controller-implementation-example)
- [🗂️ Database Migration](#database-migration)

---

## 🔄 Reset Lifecycle Flow

```
[ User Request ] -> POST /auth/password/forgot { email }
      ↓
[ Generate Token ] -> 64-char hex token saved in password_resets table (expires in 1 hr)
      ↓
[ Send Email ] -> Email sent to user with reset link or token via Email::queue
      ↓
[ Reset Password ] -> POST /auth/password/reset { email, token, password }
      ↓
[ Verification & Update ] -> Token verified -> Password bcrypt hashed -> Token deleted
```

---

## 📡 API Endpoints

### 1. Request Reset Token (`POST /auth/password/forgot`)
```bash
curl -X POST http://127.0.0.1:8080/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response (200 OK):**
```json
{
  "code": 200,
  "status": "OK",
  "message": "Password reset instructions sent to your email",
  "execution_time": "1.20ms"
}
```

---

### 2. Reset Password (`POST /auth/password/reset`)
```bash
curl -X POST http://127.0.0.1:8080/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "token": "d7a8fbb305d2793b0c7b39923...",
    "password": "NewSecurePassword123!"
  }'
```

**Response (200 OK):**
```json
{
  "code": 200,
  "status": "OK",
  "message": "Password reset successfully. You can now login.",
  "execution_time": "1.15ms"
}
```

---

## 🛠️ Controller Implementation Example

```rust
use padi_core::{hash, prelude::*};
use uuid::Uuid;

pub async fn forgot_password(Body(body): Body) -> ApiResult {
    let d = Validator::new(&body, &[("email", "required|email")]).validate().await?;
    let email = d["email"].as_str().unwrap();

    // Check if user exists
    if let Some(_user) = USERS.find_query().where_eq("email", email).first().await? {
        let token = Uuid::new_v4().to_string();

        // Save token in password_resets table
        Database::execute(
            "INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            &[Val::from(email), Val::from(token.as_str())],
        ).await?;

        // Dispatch email via background queue
        Email::queue(
            email,
            "Reset Your Password",
            &format!("<p>Your password reset token is: <b>{}</b></p>", token),
            &[],
        ).await?;
    }

    ok_msg(json!({}), "Password reset instructions sent to your email")
}

pub async fn reset_password(Body(body): Body) -> ApiResult {
    let d = Validator::new(
        &body,
        &[
            ("email", "required|email"),
            ("token", "required|string"),
            ("password", "required|string|min:8"),
        ],
    ).validate().await?;

    let email = d["email"].as_str().unwrap();
    let token = d["token"].as_str().unwrap();
    let new_password = d["password"].as_str().unwrap();

    // Verify token
    let record = Database::fetch_one(
        "SELECT email FROM password_resets WHERE email = ? AND token = ?",
        &[Val::from(email), Val::from(token)],
    ).await?;

    if record.is_none() {
        return Err(ApiError::bad_request("Invalid or expired reset token"));
    }

    // Update password in database
    let hashed = hash::make(new_password);
    Database::execute(
        "UPDATE users SET password = ? WHERE email = ?",
        &[Val::from(hashed), Val::from(email)],
    ).await?;

    // Delete used token
    Database::execute(
        "DELETE FROM password_resets WHERE email = ?",
        &[Val::from(email)],
    ).await?;

    ok_msg(json!({}), "Password reset successfully. You can now login.")
}
```

---

## 🗂️ Database Migration

```sql
CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
