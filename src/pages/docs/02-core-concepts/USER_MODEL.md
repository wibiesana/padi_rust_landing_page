# 👤 User Model & Identity Schema

## 🛡️ Industrial-Grade Identity & Security Foundation

The User Model in Padi Rust Framework serves as the central identity entity. It is defined in `src/models/user.rs` using `padi_core::active_record::Model` and serialized via `UserResource` in `src/resources/user.rs`.

---

## 📋 Table of Contents

- [🛡️ Industrial-Grade Identity & Security Foundation](#industrial-grade-identity--security-foundation)
- [📦 Model Definition (`src/models/user.rs`)](#model-definition-srcmodelsuserrs)
- [🎨 User Resource Serializer (`src/resources/user.rs`)](#user-resource-serializer-srcresourcesuserrs)
- [🗂️ Database Migration Schema](#database-migration-schema)
- [🔒 Security & Password Protection](#security--password-protection)

---

## 📦 Model Definition (`src/models/user.rs`)

```rust
use padi_core::prelude::*;

pub const USERS: Model = Model::new("users")
    .primary_key("id")
    .fillable(&["name", "email", "password", "role"])
    .hidden(&["password"])
    .audit(true)
    .timestamp_format(TimestampFormat::Datetime);
```

Re-exported via `src/models/mod.rs`:
```rust
pub mod user;
pub use user::USERS;
```

---

## 🎨 User Resource Serializer (`src/resources/user.rs`)

`UserResource` transforms the raw database row into the safe public API representation, omitting sensitive internal columns:

```rust
use padi_core::prelude::*;

pub struct UserResource;

impl Resource for UserResource {
    fn to_array(u: &Value) -> Value {
        json!({
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"],
            "created_at": u["created_at"],
            "updated_at": u["updated_at"],
        })
    }
}
```

---

## 🗂️ Database Migration Schema

Initial migration located at `database/migrations/20260101000000_create_users_table.sql`:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at VARCHAR(19),
    updated_at VARCHAR(19)
);

-- +down
DROP TABLE users;
```

---

## 🔒 Security & Password Protection

Passwords are never stored in plain text and are always hidden from serialized output:
1. **Hashing on Registration/Update:**
   ```rust
   let hashed_pw = hash::make(&plain_password);
   ```
2. **Hidden in Model & Resource:**
   - `.hidden(&["password"])` on the `USERS` Model.
   - Omitted from `UserResource::to_array`.
3. **Verification on Login:**
   ```rust
   if hash::check(&plain_password, stored_hash) {
       // Login success
   }
   ```
