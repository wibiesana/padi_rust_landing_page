# 📋 Logger Guide

The Padi Logger package (`github.com/wibiesana/padi_go_core/logger`) provides **daily rotating file logs**

Logs are written to **two destinations simultaneously**:

1. **stdout** — for container and cloud environments
2. **Daily rotating files** — `storage/logs/app-YYYY-MM-DD.log`

`ERROR` and `CRITICAL` entries are additionally written to `storage/logs/error-YYYY-MM-DD.log`.  
Log files older than **14 days are automatically deleted**.

---

## 🛠️ Usage

```go
import "github.com/wibiesana/padi_go_core/logger"

logger.Info("Server started on port 8080")

logger.Warning("Deprecated endpoint called", map[string]interface{}{
    "path":   "/api/v1/old-endpoint",
    "caller": r.RemoteAddr,
})

logger.Error("Database query failed", map[string]interface{}{
    "error": err.Error(),
    "query": "SELECT * FROM users WHERE id = ?",
})

logger.Debug("Cache miss", map[string]interface{}{
    "key": "trending_articles",
})

logger.Critical("Payment gateway unreachable", map[string]interface{}{
    "gateway": "stripe",
    "attempt": 3,
})
```

---

## 📁 Log File Structure

```
storage/
└── logs/
    ├── app-2026-08-31.log      # All log levels
    ├── app-2026-09-01.log
    ├── error-2026-08-31.log    # ERROR + CRITICAL only
    └── error-2026-09-01.log
```

**Log format:**

```
[2026-08-31 20:55:13] INFO: Server started on port 8080
[2026-08-31 21:00:44] ERROR: Database query failed {"error":"connection refused","query":"SELECT * FROM users WHERE id = ?"}
```

---

## 📦 Logger API Reference

| Function                     |   Level    | Description                                   |
| :--------------------------- | :--------: | :-------------------------------------------- |
| `logger.Info(msg, ctx?)`     |   `INFO`   | General informational messages                |
| `logger.Warning(msg, ctx?)`  | `WARNING`  | Non-fatal warnings                            |
| `logger.Error(msg, ctx?)`    |  `ERROR`   | Errors requiring attention                    |
| `logger.Debug(msg, ctx?)`    |  `DEBUG`   | Developer debug information                   |
| `logger.Critical(msg, ctx?)` | `CRITICAL` | Critical failures (also written to error log) |

The optional `ctx` parameter is a `map[string]interface{}` serialized as JSON in the log line.
