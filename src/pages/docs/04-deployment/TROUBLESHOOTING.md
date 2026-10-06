# 🔧 Deployment Troubleshooting Guide

Solutions for common deployment, networking, and runtime issues in Padi Go Framework.

---

## 📋 Common Issues & Resolutions

### 1. Port Conflict (`bind: address already in use`)
- **Cause**: Another process or previous instance is running on `APP_PORT` (default `8080`).
- **Fix**:
  - Change `APP_PORT=8085` in `.env`.
  - Or terminate the conflicting process:
    ```bash
    # Windows
    netstat -ano | findstr :8080
    taskkill /PID <PID> /F

    # Linux / macOS
    lsof -i :8080
    kill -9 <PID>
    ```

---

### 2. Database Connection Refused
- **Cause**: MySQL or PostgreSQL service is not reachable at `DB_HOST:DB_PORT`.
- **Fix**:
  - Verify container/service status: `docker ps` or `systemctl status postgresql`.
  - Check credentials in `.env` (`DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`).
  - For SQLite, ensure the parent directory (`database/`) has read/write permissions.

---

### 3. Migrations Fail (`Table already exists`)
- **Cause**: Table was created manually outside the migration runner.
- **Fix**:
  - Drop the orphan table or rollback the last migration:
    ```bash
    go run cmd/padi/main.go migrate:rollback
    ```

---

### 4. Cross-Origin Request Blocked (CORS)
- **Cause**: Frontend origin is not listed in `CORS_ALLOWED_ORIGINS`.
- **Fix**:
  - Add your frontend domain in `.env`:
    ```env
    CORS_ALLOWED_ORIGINS="http://localhost:3000,https://app.mydomain.com"
    ```

---

### 5. JWT Unauthorized (`401 Unauthorized`)
- **Cause**: `Authorization` header missing or formatted incorrectly.
- **Fix**:
  - Ensure the header value includes the `Bearer ` prefix:
    ```http
    Authorization: Bearer <TOKEN_HERE>
    ```
  - Verify that `JWT_SECRET` matches across server restarts.
