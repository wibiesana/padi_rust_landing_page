# ⚡ Cache Engine Guide

The Padi Cache package (`github.com/wibiesana/padi_go_core/cache`) provides thread-safe, multi-tier caching with a **L1 (memory) + L2 (Redis | File)** architecture — equivalent to the PHP `Cache` class.

---

## ⚙️ Configuration (.env)

```env
# Cache driver: memory | file | redis
CACHE_DRIVER=file

# Max L1 in-memory entries before eviction (oldest 25% removed)
CACHE_L1_MAX=1000

# Redis (only when CACHE_DRIVER=redis)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

---

## 🛠️ Usage Examples

### 1. Set & Get

```go
import (
    "time"
    "github.com/wibiesana/padi_go_core/cache"
)

// Store item for 10 minutes
cache.Set("trending_articles", articles, 10*time.Minute)

// Retrieve item
var cachedArticles []Article
if cache.Get("trending_articles", &cachedArticles) {
    // Cache hit — use cachedArticles
}
```

### 2. Has — Check Existence Without Fetching

```go
if cache.Has("user:42:profile") {
    // Key exists and is not expired
}
```

### 3. RememberTyped (Type-Safe Generic Cache-Aside Pattern)

`cache.RememberTyped[T]` checks if the key exists. On miss, it calls the closure, caches the result, and returns it directly as type `T`:

```go
stats, err := cache.RememberTyped[DashboardStats]("dashboard_stats", 15*time.Minute, func() (DashboardStats, error) {
    // Expensive query — executed only on cache miss
    return computeHeavyStats()
})

// Or with GetTyped[T]:
cachedStats, hit, err := cache.GetTyped[DashboardStats]("dashboard_stats")
if hit {
    // Use cachedStats directly
}
```

### 4. Increment & Decrement (Atomic Counters)

```go
// Atomic increment (works with memory, file, and Redis drivers)
newCount, _ := cache.Increment("page_views:home")

// Increment by a custom step
cache.Increment("api_calls", 5)

// Decrement
cache.Decrement("remaining_quota")
```

### 5. Delete Single / Multiple Keys

```go
// Single
cache.Delete("trending_articles")

// Multiple at once (single Redis DEL command when using redis driver)
cache.DeleteMany([]string{"key1", "key2", "key3"})
```

### 6. Flush All & Cleanup Expired

```go
// Flush all cached items (L1 + L2)
cache.Flush()

// Remove expired file cache entries (file driver only)
// Redis handles TTL natively, no cleanup needed
deleted := cache.Cleanup()
```

---

## 📦 Cache API Reference

| Function | Description |
| :--- | :--- |
| `cache.Set(key, val, ttl)` | Store value with TTL (`0` = forever) |
| `cache.Get(key, &target)` | Retrieve value — returns `bool` (hit/miss) |
| `cache.Has(key)` | Check if key exists without fetching |
| `cache.Remember(key, ttl, &target, fn)` | Get-or-compute-and-store pattern |
| `cache.Increment(key, step...)` | Atomically increment numeric value |
| `cache.Decrement(key, step...)` | Atomically decrement numeric value |
| `cache.Delete(key)` | Remove single key |
| `cache.DeleteMany(keys)` | Remove multiple keys at once |
| `cache.Flush()` | Clear all entries |
| `cache.Cleanup()` | Purge expired file cache entries |
| `cache.GetMemorySize()` | L1 entry count (monitoring) |

---

## 🔒 Thread Safety & Reliability

- **L1 Memory**: Guarded by `sync.RWMutex` — concurrent-safe for high-throughput APIs.
- **L2 File**: Uses **atomic writes** (`temp file → rename`) to prevent partial reads under concurrent access.
- **L2 Redis**: Uses `go-redis/v9` with native atomic `INCRBY` and `DEL` commands.
- **Eviction**: When L1 exceeds `CACHE_L1_MAX`, the oldest 25% of entries are evicted automatically.
