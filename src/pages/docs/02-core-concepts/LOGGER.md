# 📋 Logger Guide

The Padi Logger module (`padi_core::logger::Logger`) provides high-performance, non-blocking, structured logging powered by `tracing-subscriber` and `tracing-appender`.

Logs are written simultaneously to:
1. **stdout** (formatted with ANSI color coding for terminal debugging and container environments).
2. **Rolling file `storage/logs/app.log`** (captures all `INFO`, `WARN`, `ERROR` events).
3. **Dedicated error file `storage/logs/error.log`** (captures only `ERROR` level events).

Logs older than 14 days are cleaned up automatically on startup.

---

## 🛠️ Usage

```rust
use padi_core::prelude::*;

// Standard logging:
Logger::info("Application started on port 8080");

// Logging with JSON context metadata:
Logger::info_with("User logged in", &json!({
    "user_id": 42,
    "ip": "127.0.0.1"
}));

// Warning:
Logger::warn("Rate limit threshold approached");

// Error logging:
Logger::error_with("Payment gateway failure", &json!({
    "gateway": "stripe",
    "attempt": 3,
    "error": "connection timeout"
}));
```

---

## 📁 Storage Directory Structure

```
storage/
└── logs/
    ├── app.log.2026-10-16       # All events
    └── error.log.2026-10-16     # ERROR events only
```

---

## 📦 Logger API Reference

| Function | Level | Description |
| :--- | :---: | :--- |
| `Logger::info(msg)` | `INFO` | General operational message |
| `Logger::info_with(msg, &ctx)` | `INFO` | Operational message with structured JSON context |
| `Logger::warn(msg)` | `WARN` | Warning event |
| `Logger::warn_with(msg, &ctx)` | `WARN` | Warning with structured JSON context |
| `Logger::error(msg)` | `ERROR` | Error requiring attention (written to `error.log`) |
| `Logger::error_with(msg, &ctx)` | `ERROR` | Error with structured JSON context |
| `Logger::debug(msg)` | `DEBUG` | Detailed diagnostic information |
