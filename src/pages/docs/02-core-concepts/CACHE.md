# ⚡ Cache Engine Guide

The Padi Cache module (`padi_core::cache::Cache`) provides high-performance, two-tier caching with **L1 (In-Memory)** and **L2 (File Storage)** architectures.

---

## ⚙️ Configuration (.env)

```env
# Cache driver: file | memory
CACHE_DRIVER=file

# Default cache TTL in seconds
CACHE_TTL=300

# Cache directory (default: storage/cache)
CACHE_DIR=storage/cache

# Max L1 in-memory entries before LRU eviction
CACHE_L1_MAX=1000

# Max L1 memory allocation in MB (0 = disabled)
CACHE_L1_MAX_MEMORY_MB=64
```

---

## 🛠️ Usage Examples

### 1. Set & Get
```rust
use padi_core::prelude::*;

// Store item with TTL (None = default CACHE_TTL, Some(600) = 10 minutes, Some(0) = forever)
Cache::set("trending_products", &json!([{"id": 1, "name": "Keyboard"}]), Some(600));

// Retrieve item
if let Some(data) = Cache::get("trending_products") {
    println!("Cache hit: {:?}", data);
}

// Retrieve or fallback
let val = Cache::get_or("site_name", json!("Padi Framework"));
```

### 2. Has — Check Existence
```rust
if Cache::has("user:42:profile") {
    // Key exists and is valid
}
```

### 3. Remember (Cache-Aside Pattern)
Checks if the key exists. On cache miss, it executes the async closure, stores the result in cache, and returns it:

```rust
let stats = Cache::remember("dashboard_stats", Some(900), || async {
    // Expensive calculation or database query
    let total_users = USERS.count().await.unwrap_or(0);
    json!({ "total_users": total_users })
}).await;
```

### 4. Atomic Counters (Increment & Decrement)
```rust
// Increment by 1
let count = Cache::increment("page_views", 1);

// Decrement by 5
let remaining = Cache::decrement("rate_limit_quota", 5);
```

### 5. Invalidation & Deletion
```rust
// Delete single key
Cache::delete("trending_products");
// Or alias:
Cache::forget("trending_products");

// Delete multiple keys
Cache::delete_many(&["key1", "key2", "key3"]);

// Flush entire cache
Cache::clear();
// Or alias:
Cache::flush();
```

---

## 📁 Storage Architecture

- **L1 In-Memory:** Thread-safe `RwLock<HashMap>` for sub-microsecond cache hits.
- **L2 File Storage:** Atomic writes (temporary write + rename), keys are hashed with SHA-256 and bucketed across 256 subdirectories (`storage/cache/xx/<hash>.cache`).
- **Expired Entry Sweeping:** Call `Cache::cleanup()` to clean expired file entries on disk.
