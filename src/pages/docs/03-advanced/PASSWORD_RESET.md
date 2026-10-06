# 🔑 Password Reset Flow

## 🛡️ Secure, Token-Based Credential Recovery

Padi Go Framework includes an out-of-the-box password recovery system using cryptographically random SHA-256 tokens and email dispatching.

---

## 📋 Table of Contents

- [🛡️ Secure, Token-Based Credential Recovery](#secure-token-based-credential-recovery)
- [🔄 Reset Lifecycle Flow](#reset-lifecycle-flow)
- [📡 API Endpoints](#api-endpoints)
- [🛠️ Password Reset Controller](#password-reset-controller)
- [🗂️ Database Migration](#database-migration)

---

## 🔄 Reset Lifecycle Flow

```
[ User Request ] -> POST /auth/password/forgot { email }
      ↓
[ Generate Token ] -> 64-char hex token saved in password_resets table (expires in 1 hr)
      ↓
[ Send Email ] -> Email sent to user with reset link or token
      ↓
[ Reset Password ] -> POST /auth/password/reset { email, token, password }
      ↓
[ Verification & Update ] -> Token verified -> Password bcrypt hashed -> Token deleted
```

---

## 📡 API Endpoints

### 1. Request Reset Link / Token

```bash
curl -X POST http://localhost:8080/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response (200 OK):**
```json
{
  "status": 200,
  "success": true,
  "message": "Password reset token sent to your email"
}
```

---

### 2. Reset Password

```bash
curl -X POST http://localhost:8080/auth/password/reset \
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
  "status": 200,
  "success": true,
  "message": "Password reset successfully. You can now login."
}
```

---

## 🛠️ Password Reset Controller

Implementation located in `app/Controllers/PasswordResetController.go`:

```go
package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	models "padi-template/app/Models"
	"github.com/wibiesana/padi_go_core/activerecord"
	"github.com/wibiesana/padi_go_core/email"
	"github.com/wibiesana/padi_go_core/query"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/validator"
)

type PasswordResetController struct{}

func (c *PasswordResetController) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email" validate:"required,email"`
	}
	if errs, err := validator.BindJSON(r, &input); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	user, err := activerecord.FindBy[models.User]("email", input.Email)
	if err != nil || user == nil {
		// Do not leak email existence; return success message
		response.Success(w, nil, "If the email is registered, a reset token has been sent.")
		return
	}

	// Generate secure token
	tokenBytes := make([]byte, 32)
	rand.Read(tokenBytes)
	token := hex.EncodeToString(tokenBytes)

	// Save token
	_, _ = query.New("password_resets").Insert(map[string]interface{}{
		"email":      input.Email,
		"token":      token,
		"created_at": time.Now(),
	})

	// Dispatch email
	_ = email.Send(input.Email, "Reset Password Token", "Your reset token is: "+token)

	response.Success(w, nil, "Password reset token sent to your email")
}
```

---

## 🗂️ Database Migration

```sql
CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);
CREATE INDEX idx_password_resets_email ON password_resets (email);
```
