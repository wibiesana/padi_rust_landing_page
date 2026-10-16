# 🌾 ActiveRecord in Padi Rust Framework

## 💎 Zero-Bloat, Multi-Database Data Layer

**ActiveRecord** in Padi Rust Framework combines the simplicity and developer experience of the classic ActiveRecord pattern with the speed, memory safety, and concurrency of Rust and SQLx.

---

## 📋 Table of Contents

- [💎 Zero-Bloat, Multi-Database Data Layer](#zero-bloat-multi-database-data-layer)
- [📦 Model Definition (`Model::new`)](#model-definition-modelnew)
- [🔍 Reading Data](#reading-data)
  - [Find by ID / Primary Key](#find-by-id--primary-key)
  - [Find with 404 Error (`find_or_fail`)](#find-with-404-error-find_or_fail)
  - [Find All / List](#find-all--list)
  - [Paging & Search](#paging--search)
  - [Filtered Query (`find_query`)](#filtered-query-find_query)
- [✏️ Writing Data](#writing-data)
  - [Create / Insert](#create--insert)
  - [Update by ID](#update-by-id)
  - [Delete / Delete All](#delete--delete-all)
  - [Batch Insert](#batch-insert)
  - [Upsert](#upsert)
- [🔗 Relationships (`belongs_to`, `has_many`, `has_one`, `belongs_to_many`)](#relationships-belongs_to-has_many-has_one-belongs_to_many)
- [🪝 Lifecycle Hooks](#lifecycle-hooks)
- [🙈 Hidden / Sensitive Fields](#hidden--sensitive-fields)
- [🕒 Automated Audit Trail & Timestamps](#automated-audit-trail--timestamps)

---

## 📦 Model Definition (`Model::new`)

In Padi Rust, models are defined as compile-time constants using `Model::new("table_name")` in `src/models/`:

```rust
use padi_core::prelude::*;

pub const ARTICLES: Model = Model::new("articles")
    .primary_key("id")
    .fillable(&["title", "content", "author_id", "status"])
    .hidden(&["internal_notes"])
    .audit(true)
    .timestamp_format(TimestampFormat::Datetime);
```

### Configurable Model Options:
- `.primary_key("id")`: Custom primary key name (default: `"id"`).
- `.composite_key(&["user_id", "role_id"])`: Composite primary key.
- `.fillable(&["col1", "col2"])`: Mass-assignment protected columns.
- `.hidden(&["password"])`: Columns hidden from serialized output.
- `.audit(true)` / `.timestamps(true)`: Automatic `created_at`, `updated_at`, `created_by`, `updated_by`.
- `.default_order("id DESC")`: Default ordering applied to queries.
- `.relations(&[...])`: Relationship configurations.

---

## 🔍 Reading Data

### Find by ID / Primary Key
Fetch a single record by primary key (`Option<Value>`):
```rust
let article: Option<Value> = ARTICLES.find(1).await?;
if let Some(row) = article {
    println!("Title: {}", row["title"]);
}
```

### Find with 404 Error (`find_or_fail`)
Fetches the record or automatically returns an `ApiError::NotFound`:
```rust
let article: Value = ARTICLES.find_or_fail(id).await?;
```

### Find All / List
Fetch all records matching model filters:
```rust
// Fetch all rows
let articles: Vec<Value> = ARTICLES.all().await?;

// Fetch all with eager-loaded relations
let articles: Vec<Value> = ARTICLES.all_with(&["author", "comments"]).await?;
```

### Paging & Search
ActiveRecord supports built-in pagination and full-text keyword searching:
```rust
// Paginate: page 1, 10 records per page
let paged = ARTICLES.paginate(1, 10).await?;

// Search across specific columns:
let q = ARTICLES.search("rust", &["title", "content"]).await?;
let results = q.get().await?;

// Paginate with conditions:
let paged = ARTICLES.paginate_where(1, 10, &json!({"status": "published"})).await?;
```

### Filtered Query (`find_query`)
Access the fluent query builder directly through the model:
```rust
let results = ARTICLES.find_query()
    .where_eq("status", "published")
    .where_gte("views", 100)
    .order_by("created_at", "DESC")
    .limit(10)
    .get()
    .await?;
```

---

## ✏️ Writing Data

### Create / Insert
Pass a `serde_json::Value` object. Only columns specified in `.fillable()` are written:
```rust
let new_record = ARTICLES.create(&json!({
    "title": "Getting Started with Padi Rust",
    "content": "Padi makes Rust web development effortless.",
    "author_id": 1,
    "status": "published"
})).await?;
```

### Update by ID
Updates the record and automatically touches `updated_at` and `updated_by`:
```rust
let updated_record = ARTICLES.update(id, &json!({
    "title": "Updated Title",
    "status": "draft"
})).await?;
```

### Delete / Delete All
```rust
// Delete single record by ID:
ARTICLES.delete(id).await?;

// Delete records by condition:
ARTICLES.delete_all(&json!({"status": "archived"})).await?;
```

### Batch Insert
Insert multiple rows efficiently:
```rust
let rows = vec![
    json!({"title": "Post 1", "author_id": 1}),
    json!({"title": "Post 2", "author_id": 2}),
];
ARTICLES.batch_insert(&rows).await?;
```

### Upsert
Insert or update existing records on duplicate primary key / unique constraint:
```rust
ARTICLES.upsert(&json!({
    "id": 1,
    "title": "New or Updated Post"
}), &["id"]).await?;
```

---

## 🔗 Relationships (`belongs_to`, `has_many`, `has_one`, `belongs_to_many`)

Relationships are defined on the `Model` constant via fn pointers `|| MODEL` to prevent static cycles:

```rust
use padi_core::prelude::*;
use crate::models::{COMMENTS, USERS};

pub const ARTICLES: Model = Model::new("articles")
    .fillable(&["title", "content", "author_id"])
    .relations(&[
        Relation::belongs_to("author", || USERS, "author_id", "id"),
        Relation::has_many("comments", || COMMENTS, "article_id", "id"),
    ]);
```

### Supported Relation Types:
1. **`Relation::belongs_to(name, || TARGET, foreign_key, owner_key)`**:
   Example: An article belongs to an author user.
2. **`Relation::has_many(name, || TARGET, foreign_key, local_key)`**:
   Example: An article has many comments.
3. **`Relation::has_one(name, || TARGET, foreign_key, local_key)`**:
   Example: A user has one profile.
4. **`Relation::belongs_to_many(name, || TARGET, pivot_table, foreign_key, related_key, local_key)`**:
   Example: A user belongs to many roles via a pivot table.

### Eager Loading Relations:
```rust
// Load relations via all_with
let articles = ARTICLES.all_with(&["author", "comments"]).await?;

// Or load relations manually onto existing rows:
let mut article = ARTICLES.find_or_fail(id).await?;
ARTICLES.load_relations(&mut article, &["author", "comments"]).await?;
```

---

## 🪝 Lifecycle Hooks

ActiveRecord provides hook function pointers for model lifecycle events:
- `.before_save(|row| ...)`: Mutate row data before insert/update.
- `.after_save(|row| ...)`: Trigger side-effects after persistence.
- `.after_load(|row| ...)`: Modify row data after reading from database.
- `.before_delete(|id| ...)`: Validate before deletion.
- `.after_delete(|id| ...)`: Cleanup related resources.

```rust
pub const USERS: Model = Model::new("users")
    .fillable(&["name", "email", "password"])
    .before_save(|row| {
        // Automatically trim whitespace or enforce uppercase
        if let Some(email) = row.get("email").and_then(|v| v.as_str()) {
            row["email"] = json!(email.to_lowercase());
        }
        Ok(())
    });
```

---

## 🙈 Hidden / Sensitive Fields

Columns listed in `.hidden(&["password", "remember_token"])` are automatically stripped during serialization or when calling `ARTICLES.hide_fields(&mut row)`.

---

## 🕒 Automated Audit Trail & Timestamps

When `.audit(true)` is enabled:
- `created_at` and `updated_at` are automatically populated.
- When executing inside an authenticated request via `auth.run_as(async { ... })`, `created_by` and `updated_by` are automatically filled with the authenticated user ID.
