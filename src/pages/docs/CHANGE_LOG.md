# 📜 Changelog

All notable changes to the **Padi REST API Go Framework** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🌟 Added

#### Real-time & Code Generation

- **CLI Real-Time CRUD Generator Integration (`--realtime` / `-r`)**:
  - Added `--realtime` (and short alias `-r`) flag to `padi generate:crud` (`padi g`) and `padi generate:all` (`padi ga`).
  - Added interactive terminal prompt (`Enable Real-time SSE broadcasting hooks for this CRUD? [y/N]`) when running without flags.
  - Automatically injects `realtime.Publish` broadcasting hooks into generated Base Controllers on `Store` (`CREATE`), `Update` (`UPDATE`), and `Destroy` (`DELETE`) operations.
  - Automatically manages import of `github.com/wibiesana/padi_go_core/realtime` in generated base controllers.
- **Out-of-the-Box Request Eager Loading Helper**:
  - Added `activerecord.LoadRelationsFromRequest(r *http.Request, items interface{}) error` to automatically parse `?with=relation1,relation2` query parameters, trim values, and eagerly load relations in a single clean line.
- **Generator Core Extension**:
  - Added `WithRealtime(enabled bool) *Generator` method to `generator.Generator` struct.
  - Added unit test coverage for real-time scaffolding in `generator_test.go`.
- **Real-Time SSE Documentation**:
  - Added comprehensive guide in `REALTIME.md` covering CLI generator flags, route & controller setup, Vue 3 / Vanilla JS / React client integration, zero-config in-memory architecture, and Nginx production reverse proxy configuration.

#### Config

- Added `IsDebug() bool` — single authoritative helper that returns `true` when `APP_DEBUG=true` **or** `APP_ENV` is `development`, `dev`, or `local`. Eliminates the need for inline multi-condition debug checks throughout the codebase.

#### ActiveRecord

- **`HideFields(items interface{})`** — fully implemented (was previously a no-op placeholder). Uses reflection to zero-out struct fields listed in `Hidden() []string` by matching `db` tag, `json` tag, or field name. Accepts `*[]T`, `[]T`, or a single model pointer.
- **`GetWith(m Model) []string`** — now returns loaded relation keys from `RelationContainer` instead of always returning `nil`.
- **`placeholder(driver, idx) string`** — new internal helper centralising SQL positional-placeholder generation (`?` vs `$N`) used across all write operations.
- **`isNonZeroID(v interface{}) bool`** — new internal helper replacing repeated manual type-switch blocks for primary key detection. Covers `uint`, `uint32`, `uint64`, `int`, `int32`, `int64`, `string`, and reflection fallback for unusual types.

#### Template (`padi_go_template`)

- **Graceful Shutdown (`main.go`)**: Server now traps `SIGINT`/`SIGTERM` via `signal.NotifyContext` and calls `server.Shutdown(ctx)` with a 30-second timeout, ensuring in-flight requests finish before exit.

---

### ⚡ Refactored & Clean Architecture

#### DRY & Code Quality

- **DRY Generated Base Controllers**:
  - Replaced repeated 8-line `?with=` string parsing loops in `Index`, `All`, and `Show` with a clean one-liner `_ = activerecord.LoadRelationsFromRequest(r, &records)`.
  - Removed unnecessary `import "strings"` and `import "database/sql"` from generated controllers.
  - Unified error handling across `Show`, `Update`, and `Destroy` to cleanly distinguish between database server errors (500) and record not found (404).
- **Zero Direct `database/sql` Leakage in Controllers**:
  - Removed unnecessary `"database/sql"` imports across generated Base Controllers and sample template controllers.
  - Simplified not-found handling to idiomatic `activerecord.FindOrFail[T](id)` in `Show`, `Update`, and `Destroy` — eliminates the double-check pattern (`Find` + `nil` guard).

#### `auth/auth.go` — Eliminated 3× Config Boilerplate

- Extracted private `getConfig() *config.Config` helper. `GenerateToken`, `GenerateTokenWithExpiry`, and `ValidateToken` no longer each repeat the `if cfg == nil { cfg = config.Load() }` pattern.

#### `middleware/middleware.go` — Debug Check & Rate Limiter

- `Logger` and `Recoverer` now call `config.IsDebug()` instead of the inline three-condition check.
- **`X-Forwarded-For` IP sanitisation**: added `strings.TrimSpace()` around the extracted IP to prevent whitespace-padded keys breaking the rate-limiter bucket map.
- **Rate-limiter memory leak fix**: added `init()` background goroutine that sweeps expired client buckets every minute, preventing unbounded map growth under long-running deployments.

#### `response/response.go` — Accurate Execution Time

- `appendDebugInfo` and all `sendResponse` call sites now accept `*http.Request` to read `padi_request_start_time` from the request context (set by `Logger` middleware), yielding accurate sub-millisecond execution times instead of a synthetic snapshot.
- `appendDebugInfo` and `Error` now call `config.IsDebug()` instead of the inline multi-condition check.

#### `query/query.go` — Removed Duplicate Logic

- Extracted `isEmpty(val interface{}) bool` — shared by `FilterWhere` and `OrFilterWhere`.
- Extracted `addWhereNot(connector, column, args...)` internal method — `WhereNot`, `AndWhereNot`, and `OrWhereNot` are now one-liner delegating calls, removing ~60 lines of duplicated logic.
- `Find(connectionName ...string)` now documents the unused parameter with a clear `// TODO` comment instead of silently ignoring it.

#### `activerecord/activerecord.go` — SQL Safety & DRY

- **Column quoting in `UPDATE` SET clauses**: column names are now quoted (`` `col` `` for MySQL/SQLite, `"col"` for PostgreSQL) to prevent issues with reserved words or unconventional column names.
- All placeholder generation (`?` / `$N`) in `Save`, `DeleteModel`, `SoftDelete`, `BatchInsert`, and `Upsert` consolidated into the new `placeholder()` helper.
- `Save()` isUpdate detection replaced by `isNonZeroID()`, eliminating five separate type assertions.

#### `AuthController.go` (template) — Removed Duplicate Utility

- Removed local `generateSecureRandomString` function (was a copy-paste of `auth.GenerateSecureRandomString`). Now calls `auth.GenerateSecureRandomString(32)` directly.

---

### 🐛 Fixed

- **`database/GetDB()` crash behaviour**: replaced `log.Fatalf` (hard `os.Exit`) with `panic(message)` so the `Recoverer` middleware can capture the failure, log a proper stack trace, and return a clean 500 response instead of abruptly killing the process.
- **Silent login update failure**: `_ = user.Save()` in `AuthController.Login` replaced with `log.Printf("[WARN] ...")` so errors during last-login / remember-token persistence are surfaced rather than silently discarded.

---

## [0.0.2] - 2026-09-02

### 🌟 Added

#### ActiveRecord

- **Out-of-the-Box Eager Loading & Generic Fluent Querying**:
  - Added `ModelQuery[T]` fluent query builder (`NewModelQuery[T]()`).
  - Added `With(relations...)` with support for nested recursive relations (e.g. `comments.author`) and column filtering (e.g. `user:id,username`).
  - Added `Get()`, `First()`, `Find(id)`, `Paginate(opts, searchCols)`, `GetMaps()`, `PaginateMaps(opts, searchCols)`.
  - Added `AllWithOpts[T](opts, searchCols...)` and `AllWithOptsWithContext[T](ctx, opts, searchCols...)` supporting search keyword, sort column, and sort direction on unpaginated collection queries (`GET /{resource}/all?search=&sort=id&order=desc`).
  - Added relationship declarations: `BelongsTo`, `HasOne`, `HasMany`, `BelongsToMany`.
  - Added `RegisterRelationModels` and model registry for automatic reflection instantiation of nested relation structs.
  - Added `structTypeInfo` reflection metadata cache (`map[reflect.Type]*structTypeInfo` guarded by `sync.RWMutex`) providing $O(1)$ struct field mapping and eliminating repeated reflective inspection across loops.
  - Added `buildInPlaceholders` buffer helper to build `?, ?, ?` or `$1, $2, $3` SQL in-place without slice allocations.
  - Added lazy `initMu()` helper ensuring pointer-mutex safety across struct value copies.
- **Predictable Insertion-Ordered JSON Serialization**:
  - Introduced `activerecord.Map` (`OrderedMap`) ensuring that JSON keys are serialized in exact schema order (table columns first, relation objects second, and flattened display fields at the bottom), replacing default alphabetical sorting.
- **Automated Audit Trail & Blameable Behavior**:
  - Context-aware `activerecord.Save(m, r.Context())` automatically populates `created_by` and `updated_by` from the active JWT user session without boilerplate.
  - Automatic `created_at` and `updated_at` timestamps on INSERT and UPDATE operations across all database drivers.
  - Intelligent type detection supporting both `DATETIME`/`TIMESTAMP` (`time.Time`, `*time.Time`) and `INTEGER` UNIX epoch seconds (`int64`, `*int64`, `uint`).
  - Model-level configurable audit toggle: `UseAudit() bool` to turn audit features on or off per model.
  - Custom column mappings via `AuditFields() map[string]string` for custom timestamp and author column names.

#### Auth

- Added HTTP request extraction helpers:
  - `ExtractToken(r *http.Request) string`
  - `User(r *http.Request) *JWTClaims`
  - `UserID(r *http.Request) uint`
  - `UserFromContext(ctx context.Context) *JWTClaims`
  - `UserIDFromContext(ctx context.Context) uint`
  - `Check(r *http.Request) bool`
  - `HasRole(r *http.Request, roles ...string) bool`
- Added `VerifyPassword(p1, p2 string) bool` and `VerifyToken(tokenString string) (*JWTClaims, error)` aliases.
- Added `GenerateTokenWithExpiry(userID uint, email, role string, expiry time.Duration, meta ...map[string]interface{}) (string, error)`.

#### Cache

- Added generic type-safe caching helpers:
  - `GetTyped[T any](key string) (T, bool, error)`
  - `RememberTyped[T any](key string, ttl time.Duration, fallbackFn func() (T, error)) (T, error)`
- Added `Clear()` and `ClearMemory()` for full cache invalidation matching PHP `Cache.php`.

#### Config

- Added `GetEnvFloat(key string, defaultVal float64) float64`.
- Added `GetEnvDuration(key string, defaultVal time.Duration) time.Duration`.
- Added `Current() *Config`, `Env(key, defaultVal) string`, `Get(key, defaultVal) string`, `SetEnv(key, value)`.
- Added environment checkers: `IsProduction() bool`, `IsDevelopment() bool`, `IsTesting() bool`.

#### Database

- Added auto-commit / auto-rollback transaction management:
  - `Transaction(fn func(tx *sql.Tx) error) error`
  - `TransactionContext(ctx context.Context, fn func(tx *sql.Tx) error) error`
- Added raw query execution with query telemetry tracking:
  - `Exec(query string, args ...interface{}) (sql.Result, error)`
  - `ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)`
  - `Query(query string, args ...interface{}) (*sql.Rows, error)`
  - `QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)`
  - `QueryRow(query string, args ...interface{}) *sql.Row`
  - `QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row`
- Added `Ping() error`, `Close() error`, and `Stats() sql.DBStats`.
- **SQL Query Profiler & Execution Tracker**:
  - Live query tracing per HTTP request lifecycle when `APP_DEBUG=true` or in development mode.
  - Returns `query_count` (total queries executed during the request) and `queries` array containing exact SQL queries, bound parameters (`args`), duration in ms, and formatted duration string (e.g. `"0.12 ms"`).

#### Email

- Added multipart MIME attachment handling with base64 streaming.
- Added support for `Cc`, `Bcc`, `ReplyTo`, and `Attachments` in `Message` struct.
- Added `SendHTML(to, subject, htmlBody, attachments...) error`.
- Added `SendText(to, subject, textBody) error`.
- Added `SendTo(toSlice, subject, htmlBody) error`.
- Added `SendTemplate(toSlice, subject, templateStr, data) error` rendering Go `html/template`.
- Added `SendAsync(msg, onComplete...)` for non-blocking background email dispatch.

#### File & Storage

- Added `file.Path(relativePath) string` and `storage.DiskPath(relativePath) string`.
- Added `file.Put(relativePath, bytes)` & `file.PutString(relativePath, text)`.
- Added `file.Get(relativePath)` & `file.GetString(relativePath)`.
- Added `file.SanitizeFileName(name) string`.
- Added `storage.Copy(srcRel, destRel)` & `storage.Move(srcRel, destRel)`.
- Added `storage.MakeDirectory(relDir)` & `storage.DeleteDirectory(relDir)`.
- Added `storage.List(relDir) ([]string, error)`.

#### Generator & Tooling

- Added automatic search, sort, and order parameters parsing for `All` controller action (`c.All(...)`) and Postman/Thunder Client collection generator (`GET /{resource}/all?search=&sort=id&order=desc`).

#### Logger

- Added Printf-style formatted logging methods:
  - `Infof(format string, args...)`
  - `Warningf(format string, args...)` / `Warnf(format string, args...)`
  - `Warn(message string, context...)`
  - `Errorf(format string, args...)`
  - `Debugf(format string, args...)`
  - `Criticalf(format string, args...)`
- Added `RotateLogs(retentionDays ...int)` manual trigger.

#### Query Builder

- Added generic type-safe execution functions:
  - `query.GetAll[T any](q *Query) ([]T, error)`
  - `query.GetFirst[T any](q *Query) (*T, error)`
  - `query.GetOne[T any](q *Query) (*T, error)`

#### Queue

- Added generic type-safe job handler:
  - `queue.RegisterTyped[T any](name string, handler func(data T) error)`
- Added delayed dispatching:
  - `queue.PushLater(delay time.Duration, jobName string, data interface{}, queueName...) error`
  - `queue.Later(delay time.Duration, jobName string, data interface{}, queueName...) error`
- Added queue monitoring & worker control:
  - `queue.Size(queueName...) (int64, error)`
  - `queue.Clear(queueName...) error`
  - `queue.WorkWithContext(ctx context.Context, queueName string, maxJobs int)`

#### Realtime

- Added `PublishBatch(events []Event)` for multi-event broadcasts.
- Added `Broadcast(data interface{})` to broadcast across all active topics.
- Added `SubscriberCount(topic string) int` and `Topics() []string`.
- Added dynamic URL query parameter fallback (`?topic=` / `?topics=`) in `SubscribeSSE()`.

#### Response

- Added `response.NoContent(w)` (HTTP 204).
- Added `response.Conflict(w, message, errors...)` (HTTP 409).
- Added `response.TooManyRequests(w, message...)` (HTTP 429).
- Added `response.Download(w, r, filePath, customName...)` with `Content-Disposition`.

#### Router

- Added `*router.Router` directly exposing HTTP verbs (`Get`, `Post`, `Put`, `Patch`, `Delete`, `Any`, `Static`, `Group`, `Use`), removing direct `chi` imports in user code.
- Added `r.Any(pattern, handler)` matching all HTTP methods.
- Added `r.Static(pattern, rootDir)` serving local filesystem assets.
- Added parameter extractors: `ParamInt`, `QueryParamFloat`, `QueryParamBool`, `QueryParamSlice`.

#### Validator

- Added generic one-line request binding and validation:
  - `validator.Bind[T any](r *http.Request) (*T, ValidationErrorDetails, error)`
- Added fluent `FormValidator` builder:
  - `v := validator.New(r)` / `validator.New(dataMap)`
  - `v.Required(...)`, `v.Email(...)`, `v.Min(...)`, `v.Max(...)`
  - `v.Passes()`, `v.Fails()`, `v.Errors()`

#### Migrator

- Added `MigrationStatus` struct and `migrator.Status(db) ([]MigrationStatus, error)`.
- Added `migrator.Reset(db)` and `migrator.Fresh(db)`.
- Added `migrator.ClearRegistry()` for test isolation.

#### Generator & Tooling

- **Automatic Clean Relation Objects**:
  - Automatically inspects foreign key columns (`_id`, `created_by`, `updated_by`) and discovers referenced tables.
  - Auto-generates clean, structured relation objects (e.g. `createdBy`, `teacher`, `semester`) into `BaseResource.ToMap()`, eliminating redundant flattened string keys for cleaner JSON payloads.
- **Hidden / Sensitive Field Protection (`json:"-"`)**:
  - Code generator and core models automatically set `json:"-"` on sensitive attributes (`password`, `remember_token`, secret keys) ensuring zero accidental data leaks in JSON API responses (matching PHP `$hidden`).
- **Postman / Thunder Client Global Token Automation**:
  - Generated API collections include root-level `Bearer {{token}}` configuration, allowing child requests to automatically inherit authorization without manual header configuration.
  - Test scripts in Authentication API (`Login`, `Register`, `Refresh`) automatically persist JWT tokens across Global (`pm.globals`), Environment (`pm.environment`), and Collection scopes.
- **Setup Wizard**:
  - Added `wizard_test.go` unit test suite for setup wizard instantiation and configuration creation.

---

### ⚡ Performance & DRY Improvements

- **Reflection Metadata Caching**: Eliminated repeated struct inspection by caching parsed fields in `sync.RWMutex`-guarded type metadata maps across ActiveRecord and Query Builder.
- **Zero-Allocation Placeholder Generator**: Implemented `buildInPlaceholders` buffer for fast SQL `IN (...)` queries.
- **String Concat Optimization**: Replaced temporary `+ "\r\n"` string allocations in base64 attachment writer loop with sequential `WriteString` calls.
- **Database Iterator Safety**: Added `rows.Err()` check on all `for rows.Next()` loops.

---

### 🐛 Fixed

- Fixed `go vet` lock-by-value warning on `ActiveRecord` struct by converting `relationsMu sync.RWMutex` to pointer `*sync.RWMutex` with lazy `initMu()`.
- Fixed `rows.Err()` check missing after `for rows.Next()` loop in `migrator.Status`.

---

## [0.0.1] - 2026-09-01

### ✨ Added

- **Debug Telemetry Engine (`package response`, `package middleware`)**:
  - Automatically appends structured `debug` telemetry on all API responses when `APP_DEBUG=true` or in development mode (`APP_ENV=development` / `local`).
  - Measures execution time dynamically (`execution_time` in sub-millisecond precision, e.g. `0.24 ms`).
  - Reports current peak memory allocation (`memory_usage`), active goroutine count (`goroutines`), and environment context.
  - Zero-overhead in production mode (`APP_DEBUG=false` & `APP_ENV=production` short-circuits instantly with zero memory allocation).
- **Auto Stack Trace in Exception / Panic Recovery**:
  - Panic recoverer and 500 error responses capture runtime stack trace lines into `debug.trace` array during development.
- **Production Build Command (`padi build`)**:
  - Compiles optimized production binary with `-ldflags "-s -w"` automatically named according to `APP_NAME` in `.env` (e.g. `padi-rest-api-go.exe` on Windows or `padi-rest-api-go` on Linux).

### ⚡ Enhanced

- **API Collection (`user_api_collection.json`)**:
  - Removed `/v1` prefix across all generated collection requests to match default routing.
  - Added collection variables (`base_url`, `token`).
  - Added automated test script to extract and set JWT bearer token across collection variables, environment, and globals upon `Register` or `Login`.
  - Added full Auth endpoint suite (`Register`, `Login`, `Me`, `Forgot Password`, `Reset Password`).
  - Protected `Users` endpoints with `Authorization: Bearer {{token}}`.
- **Git Ignore**:
  - Fixed binary ignore pattern to `/padi` to prevent ignoring `cmd/padi/` source files.

---

### ✨ Added

- **`package logger`** — Daily rotating file logger:
  - Structured log levels: `Info`, `Warning`, `Error`, `Debug`, `Critical`.
  - Dual output: `stdout` (container-friendly) + daily rotating file (`storage/logs/app-YYYY-MM-DD.log`).
  - Error and Critical entries additionally written to `storage/logs/error-YYYY-MM-DD.log`.
  - Automatic cleanup of log files older than **14 days**.
  - Optional JSON context: `logger.Error("msg", map[string]interface{}{"key": "val"})`.

### ⚡ Enhanced

#### Cache (`package cache`)

- Added `cache.Has(key)` — check key existence without fetching value.
- Added `cache.DeleteMany(keys)` — remove multiple keys in a single Redis `DEL` command.
- Added `cache.Increment(key, step...)` — atomic numeric increment (Redis: native `INCRBY`; file/memory: mutex-guarded read-modify-write).
- Added `cache.Decrement(key, step...)` — atomic numeric decrement.
- Added `cache.Cleanup()` — purge expired entries from file cache (Redis handles TTL natively).
- Added `cache.GetMemorySize()` — L1 entry count for monitoring.
- **Fixed**: File driver now uses **atomic writes** (`tmp file → os.Rename`) to prevent partial reads under concurrent access.
- **Fixed**: L1 memory eviction now removes oldest 25% when `CACHE_L1_MAX` is reached (previously no eviction).

#### Storage / File Upload (`package storage` / `package file`)

- Added `storage.URLOrNull(r, path)` — returns empty string for empty paths; safe to use directly on nullable DB columns.
- Added `file.URLOrNull(r, path)` — same via the `file` package alias.
- Added **MIME content sniffing** — reads first 512 bytes via `http.DetectContentType` to block executables and scripts disguised as images.

#### Queue (`package queue`)

- **Fixed**: Replaced `if-else if` chain with idiomatic `switch driver` in `ensureQueueTable` (linter suggestion).

#### ActiveRecord / Migrator (`package activerecord`, `package migrator`)

- **Fixed**: Added `rows.Err()` checks in all `sql.Rows` loops to catch deferred scan errors (linter suggestion).

#### Documentation

- Added full **Logger** guide (`LOGGER.md`) with usage, log file structure, and API reference.
- Updated **Cache** guide (`CACHE.md`) with all new methods and configuration examples.
- Updated **File Upload** guide (`FILE_UPLOAD.md`) with `URLOrNull` and MIME sniffing security table.

---

### 🚀 Initial Release - Padi Go REST API Framework

The complete port and modernization of the Padi Framework into pure **Go 1.22+**.

#### ✨ Core Highlights

- **Zero-Allocation Radix Routing**: Ultra-fast routing engine built on top of [Chi](https://github.com/go-chi/chi) with direct root route registration (no forced `/v1` prefix).
- **Generic ActiveRecord ORM (`package activerecord`)**:
  - Type-safe generic data access: `Find[T](id)`, `FindOrFail[T](id)`, `All[T]()`, `FindBy[T](col, val)`, `Paginate[T](opts, searchCols...)`.
  - Automatic `Save` (insert vs update detection based on primary key), `BatchInsert`, `Update`, `Delete`, and `DeleteModel`.
  - Schema relations: `HasOne`, `HasMany`, `BelongsTo`, and `BelongsToMany`.
  - Lifecycle hooks support: `BeforeSaver`, `AfterSaver`, `BeforeDeleter`, `AfterDeleter`.
- **Fluent Query Builder (`package query`)**:
  - Expressive query construction: `Where`, `AndWhere`, `OrWhere`, `WhereIn`, `WhereNotIn`, `WhereBetween`, `WhereNull`, `WhereNotNull`, `FilterWhere`, `Search`.
  - Joins: `Join`, `LeftJoin`, `RightJoin`.
  - Aggregates: `Count`, `Exists`, `Sum`, `Avg`, `Min`, `Max`.
  - Pagination: `Paginate(page, perPage, &dest)`.
- **Deterministic Response Standard (`package response`)**:
  - `response.Item` / `response.Created` for single entities (`item`).
  - `response.Items` for collection lists (`items`).
  - `response.Paginated` for paginated collections (`items` + `meta`).
  - Standard error helpers: `BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `UnprocessableEntity`, `InternalServerError`.
- **Two-Tier Architecture**:
  - **Models**: `app/Models/Base/` (auto-generated) and `app/Models/` (custom business logic).
  - **Resources**: `app/Resources/Base/` (auto-generated) and `app/Resources/` (custom transformation layer, safe from regeneration overwrites).
  - **Controllers**: `app/Controllers/Base/` (auto-generated) and `app/Controllers/` (custom actions).
- **Multi-Database Support**:
  - Pure Go SQLite (`modernc.org/sqlite` - 100% CGO-free).
  - PostgreSQL (`github.com/lib/pq`).
  - MySQL / MariaDB (`github.com/go-sql-driver/mysql`).
- **Padi CLI Tool (`cmd/padi/main.go`)**:
  - `padi init`: Interactive Setup Wizard (Database selection, credentials test, cryptographic JWT generation, `.env` file writer, and auto-migration).
  - `padi serve`: Start high-speed HTTP API server.
  - `padi migrate` & `padi migrate:rollback`: Run and rollback SQL migrations.
  - `padi g <table_name>`: Scaffold Base/Concrete Models, Controllers, Resources, and Postman API collection.
  - `padi ga`: Scaffold CRUD for all database tables at once.
  - `padi queue:work`: Asynchronous background queue worker.
  - `padi make:*`: Generate blank models, controllers, and timestamped migrations.
- **Built-in Security & Auth**:
  - Stateless Bearer JWT tokens (`package auth`).
  - Bcrypt password hashing.
  - Structured input validation (`package validator`).
  - Role-based authorization (`middleware.RequireRole`).
  - CORS and token-bucket Rate Limiter middleware.
  - Panic recovery middleware (`middleware.Recoverer`).
- **File Upload & Storage (`package storage` / `package file`)**:
  - Convenient one-liner uploads directly from `http.Request`: `storage.Upload(r, "avatar", opts)`.
  - Batch multi-file uploads: `storage.UploadMultiple(r, "photos", opts)`.
  - Randomized cryptographic filename hashing (`YYYYMMDD_<hash>.<ext>`).
  - Strict dangerous extension blacklist (`.exe`, `.bat`, `.php`, `.sh`, `.py`, `.js`, etc.).
  - File helpers: `storage.URL`, `storage.Exists`, `storage.Size`, `storage.MimeType`, `storage.Delete`.
- **Real-Time, Queue & Mail**:
  - Server-Sent Events (SSE) Pub/Sub broadcaster (`package realtime`).
  - Database-backed asynchronous queue processing (`package queue`).
  - Native SMTP email client and queued email processing (`package email`).
