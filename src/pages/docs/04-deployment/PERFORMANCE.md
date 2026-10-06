# ⚡ Performance & Benchmarks Guide

## ⚡ High-Throughput Go Concurrency & Low Latency

Padi REST API Framework is engineered in pure **Go 1.22+**, leveraging lightweight goroutines, non-blocking asynchronous I/O, and zero-allocation routing to deliver sub-millisecond response latencies and high requests per second (RPS).

---

## 📋 Table of Contents

- [⚡ High-Throughput Go Concurrency & Low Latency](#high-throughput-go-concurrency--low-latency)
- [📈 Benchmark Results (wrk)](#benchmark-results-wrk)
- [🚀 Key Performance Architecture](#key-performance-architecture)
- [🏊 Database Connection Pool Tuning](#database-connection-pool-tuning)
- [⚙️ Binary Optimization & Compilation Flags](#binary-optimization--compilation-flags)
- [📊 Load Testing Commands](#load-testing-commands)

---

## 📈 Benchmark Results (wrk)

Tested on 8 CPU cores / 16GB RAM:

```bash
wrk -t8 -c100 -d30s http://localhost:8080/products
```

| Metric | Result | Description |
| :--- | :---: | :--- |
| **Requests / sec (RPS)** | `45,000+` | Full JSON CRUD listing with query execution |
| **Average Latency** | `1.8ms` | Round-trip request processing time |
| **Memory Footprint** | `< 25MB` | Static compiled binary runtime RSS |
| **Cold Start** | `< 5ms` | Server initialization to ready state |

---

## 🚀 Key Performance Architecture

1. **Chi Router**: Zero-allocation, method-indexed radix tree routing.
2. **Goroutine-per-Request Concurrency**: Native Go runtime schedules thousands of concurrent connections efficiently across all CPU cores.
3. **Prepared Statements & Connection Pooling**: Pre-compiled database query execution paths.
4. **Pure Go SQLite with WAL**: Write-Ahead Logging for non-blocking concurrent reads during database writes.

---

## 🏊 Database Connection Pool Tuning

In high-concurrency environments, tune `sql.DB` settings:

```go
db := database.GetDB()

// Set maximum open connections
db.SetMaxOpenConns(100)

// Set maximum idle connections
db.SetMaxIdleConns(25)

// Connection max lifetime
db.SetConnMaxLifetime(15 * time.Minute)
```

---

## ⚙️ Binary Optimization & Compilation Flags

Always compile with linker flags to strip symbols and debug information:

```bash
# Strip DWARF and symbol table for 30%+ smaller binary
CGO_ENABLED=0 go build -ldflags="-w -s" -o padi-server cmd/padi/main.go
```

---

## 📊 Load Testing Commands

```bash
# 1. Quick benchmark using wrk
wrk -t4 -c50 -d10s http://localhost:8080/products

# 2. Benchmark with Keep-Alive
wrk -t8 -c200 -d30s -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:8080/auth/me
```
