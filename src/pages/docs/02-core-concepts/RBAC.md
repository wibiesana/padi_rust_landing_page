# 🎭 Role-Based Access Control (RBAC)

## 🛡️ Granular Authorization & Role Enforcement

Padi Rust Framework provides a clean, ergonomic approach to Role-Based Access Control directly via the `AuthUser` extractor.

---

## 📋 Table of Contents

- [🛡️ Granular Authorization & Role Enforcement](#granular-authorization--role-enforcement)
- [📖 Overview](#overview)
- [🎭 Enforcing Roles in Controllers (`require_role`)](#enforcing-roles-in-controllers-require_role)
- [🛠️ Ownership Verification & Self-Data Checks](#ownership-verification--self-data-checks)
- [⚠️ Error Responses (401 vs 403)](#error-responses-401-vs-403)
- [⭐ Best Practices](#best-practices)

---

## 📖 Overview

In Padi Rust, the authenticated user is injected into handler functions using the `auth: AuthUser` extractor. The extractor provides role inspection methods:

- `auth.require_role(&["admin"])?`: Asserts that the authenticated user possesses one of the allowed roles. If not, returns `403 Forbidden` immediately via the `?` operator.
- `auth.has_role(&["admin", "manager"])`: Checks if the user has any of the given roles, returning a boolean.
- `auth.role()`: Returns the string role from the JWT payload (`Option<&str>`).
- `auth.user_id()`: Returns the numeric user ID (`Option<i64>`).

---

## 🎭 Enforcing Roles in Controllers (`require_role`)

```rust
use padi_core::prelude::*;

// Single role enforcement (Admin only)
pub async fn delete_user(auth: AuthUser, Path(id): Path<i64>) -> ApiResult {
    auth.require_role(&["admin"])?;

    USERS.delete(id).await?;
    no_content()
}

// Multi-role enforcement (Admin or Manager)
pub async fn export_reports(auth: AuthUser) -> ApiResult {
    auth.require_role(&["admin", "manager"])?;

    ok(json!({"report": "Q3 Revenue Summary"}))
}
```

---

## 🛠️ Ownership Verification & Self-Data Checks

When modifying sensitive profile data, verify whether the requester owns the account or has administrative privileges:

```rust
pub async fn update_user(
    auth: AuthUser,
    Path(id): Path<i64>,
    Body(body): Body,
) -> ApiResult {
    // If the authenticated user is NOT the owner of the record, require admin role
    if auth.user_id() != Some(id) {
        auth.require_role(&["admin"])?;
    }

    let d = Validator::new(&body, &[
        ("name", "sometimes|string|min:2|max:100"),
    ]).validate().await?;

    let updated = USERS.update(id, &d).await?;
    ok(UserResource::wrap(&updated))
}
```

---

## ⚠️ Error Responses (401 vs 403)

| Scenario | HTTP Status | Response Code | Description |
| :--- | :--- | :--- | :--- |
| **Missing or Invalid JWT Token** | `401 Unauthorized` | `UNAUTHORIZED` | Token was missing, expired, or failed cryptographic verification. |
| **Insufficient Permissions** | `403 Forbidden` | `FORBIDDEN` | Valid token provided, but user lacks the required role. |

### Forbidden Response Example:
```json
{
  "code": 403,
  "status": "FORBIDDEN",
  "message": "Forbidden: Requires one of role(s): [\"admin\"]",
  "execution_time": "0.62ms"
}
```

---

## ⭐ Best Practices

1. **Fail Closed:** Always perform authorization checks at the beginning of handler functions before any database reads or mutations.
2. **Combine Ownership with Admin Override:** Allow administrators to manage user accounts while restricting ordinary users strictly to their own `user_id`.
3. **Keep Roles Minimal:** Stick to clear, coarse-grained roles (`admin`, `manager`, `user`) in the JWT claims for optimal token size.
