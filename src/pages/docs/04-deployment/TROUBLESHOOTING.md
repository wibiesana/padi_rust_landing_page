# 🔧 Deployment Troubleshooting Guide

Solutions for common deployment, networking, and runtime issues in Padi Rust Framework.

---

## 📋 Common Issues & Resolutions

### 1. Port Conflict (`os error 10048` or `address already in use`)
- **Cause**: Another process or a previous instance is occupying `APP_PORT` (default: `8080`).
- **Fix**:
  - Run the server with a port override:
    ```bash
    padi serve --port=8085
    ```
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
- **Cause**: MySQL or PostgreSQL service is not reachable at the host and port specified in `DATABASE_URL` or `.env`.
- **Fix**:
  - Verify container/service status: `docker ps` or `systemctl status postgresql`.
  - Check credentials in `.env` (`DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`).
  - For SQLite, ensure the parent directory (`database/`) has read and write permissions.

---

### 3. Migrations Fail (`Table already exists`)
- **Cause**: Table was created manually outside the migration runner.
- **Fix**:
  - Roll back the latest migration batch:
    ```bash
    padi migrate:rollback
    ```

---

### 4. Cross-Origin Request Blocked (CORS)
- **Cause**: Frontend origin is not listed in `CORS_ALLOWED_ORIGINS`.
- **Fix**:
  - Add your frontend domain in `.env`:
    ```env
    CORS_ALLOWED_ORIGINS=http://localhost:3000,https://app.mydomain.com
    ```

---

### 5. JWT Unauthorized (`401 Unauthorized`)
- **Cause**: `Authorization` header missing, or `JWT_SECRET` does not match.
- **Fix**:
  - Ensure the header value includes the `Bearer ` prefix:
    ```http
    Authorization: Bearer <TOKEN_HERE>
    ```
  - Ensure that `JWT_SECRET` in `.env` remains consistent across server restarts and is at least 32 characters long.
