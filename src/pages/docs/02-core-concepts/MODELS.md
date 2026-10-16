# 📦 Models Guide

Models in Padi Rust Framework represent your database entities and business logic layer, defined using constant `Model` builders from `padi_core::active_record`.

---

## 📋 Model Structure

In Padi Rust, models are defined in `src/models/` and re-exported through `src/models/mod.rs`.

### Model Definition (`src/models/user.rs`)

```rust
use padi_core::prelude::*;

pub const USERS: Model = Model::new("users")
    .primary_key("id")
    .fillable(&["name", "email", "password", "role"])
    .hidden(&["password"])
    .audit(true)
    .timestamp_format(TimestampFormat::Datetime);
```

### Module Re-Export (`src/models/mod.rs`)
```rust
pub mod user;
pub mod product;

pub use user::USERS;
pub use product::PRODUCTS;
```

---

## 🛠️ Model Configuration Methods

| Method | Type | Description |
| :--- | :--- | :--- |
| `Model::new("table")` | `&'static str` | Defines the database table name |
| `.primary_key("id")` | `&'static str` | Primary key column (default: `"id"`) |
| `.composite_key(&[...])` | `&[&str]` | Composite primary key columns |
| `.fillable(&[...])` | `&[&str]` | Whitelisted columns allowed for create and update mass-assignment |
| `.hidden(&[...])` | `&[&str]` | Sensitive columns stripped from output (e.g. passwords) |
| `.audit(true)` | `bool` | Auto-manages `created_at`, `updated_at`, `created_by`, `updated_by` |
| `.timestamp_format(f)` | `TimestampFormat` | `Datetime` (`YYYY-MM-DD HH:MM:SS`) or `Epoch` |
| `.default_order("id DESC")` | `&'static str` | Default SQL `ORDER BY` applied to all select queries |
| `.relations(&[...])` | `&[Relation]` | Relationships (`belongs_to`, `has_many`, `has_one`, `belongs_to_many`) |

---

## ⚡ Generating Models via CLI

You can generate models automatically by introspecting your database schema:

```bash
# Generate model from database table schema:
padi make:model products

# Or generate complete CRUD (Model, Resource, Controller, Route):
padi g products
```

The generator inspects column names from SQLite, MySQL, or PostgreSQL, and automatically filters non-fillable audit columns like `id`, `created_at`, and `updated_at`.
