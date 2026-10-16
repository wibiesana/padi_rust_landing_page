# 📦 API Resources & Transformation Guide

## 💎 Elegant Data Transformation & Presentation Layer

**API Resources** in Padi Rust Framework (`padi_core::resource::Resource`) provide a dedicated transformation layer between raw database rows and the JSON response returned to client applications.

Resources ensure that:
1. Sensitive internal database columns (e.g. hashed passwords, internal flags) are never exposed.
2. Formats (such as dates, currency, numbers) are standardized.
3. Computed and virtual properties (e.g., `full_name`, formatted price) can be computed cleanly.
4. Nested relationships are formatted conditionally with `when_loaded`.

---

## 📋 Table of Contents

- [💎 Elegant Data Transformation & Presentation Layer](#elegant-data-transformation--presentation-layer)
- [🏗️ Resource Implementation](#resource-implementation)
- [🎮 Controller Usage (`wrap` & `wraps`)](#controller-usage-wrap--wraps)
- [🔗 Conditional Relations (`when_loaded`)](#conditional-relations-when_loaded)
- [⚡ Generating Resources via CLI](#generating-resources-via-cli)

---

## 🏗️ Resource Implementation

Resources implement the `Resource` trait from `padi_core::prelude::*`:

```rust
// src/resources/user.rs
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

Re-export through `src/resources/mod.rs`:
```rust
pub mod user;
pub use user::UserResource;
```

---

## 🎮 Controller Usage (`wrap` & `wraps`)

The `Resource` trait automatically provides two high-level methods:

### 1. `Resource::wrap(&item)` (Single Entity)
Transforms a single entity into the API shape. If the item is null, it returns an empty object `{}`:
```rust
pub async fn show(_auth: AuthUser, Path(id): Path<i64>) -> ApiResult {
    let row = USERS.find_or_fail(id).await?;
    ok(UserResource::wrap(&row))
}
```

### 2. `Resource::wraps(&items)` (Collections & Pagination)
Transforms a collection. It automatically detects and handles both flat arrays (`Vec<Value>`) and paginated query results (`{ "data": [...], "meta": {...} }`):

```rust
// Flat collection:
pub async fn all(_auth: AuthUser) -> ApiResult {
    ok(UserResource::wraps(&json!(USERS.all().await?)))
}

// Paginated collection:
pub async fn index(_auth: AuthUser, p: Params) -> ApiResult {
    let (page, per) = p.pagination();
    ok(UserResource::wraps(&USERS.paginate(page, per).await?))
}
```

---

## 🔗 Conditional Relations (`when_loaded`)

Use `when_loaded` or `when_loaded_then` to only include relational data when it has been eagerly loaded:

```rust
impl Resource for ArticleResource {
    fn to_array(a: &Value) -> Value {
        let mut out = json!({
            "id": a["id"],
            "title": a["title"],
            "content": a["content"],
            "author_id": a["author_id"],
        });

        // Only include author if loaded by with/all_with:
        if let Some(author) = when_loaded(a, "author") {
            out["author"] = UserResource::wrap(&author);
        }

        // Only include comments if loaded:
        if let Some(comments) = when_loaded(a, "comments") {
            out["comments"] = CommentResource::wraps(&comments);
        }

        out
    }
}
```

---

## ⚡ Generating Resources via CLI

```bash
# Generate resource struct template:
padi make:resource Product

# Or generate full CRUD:
padi g products
```
