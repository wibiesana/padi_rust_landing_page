# 📋 API Quick Reference

A fast cheatsheet for Padi Go REST API.

---

## 🌾 Endpoints Reference

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register new user account | ❌ |
| `POST` | `/auth/login` | Login and obtain Bearer JWT token | ❌ |
| `POST` | `/auth/password/forgot` | Request password reset token | ❌ |
| `POST` | `/auth/password/reset` | Reset password using token | ❌ |
| `GET` | `/auth/me` | Fetch authenticated user profile | ✅ |

---

### 📦 Standard CRUD Endpoints

| Method | Endpoint | Return Key | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/<resource>?page=1&per_page=15` | `"items": [...]`, `"meta": {...}` | List paginated entities with search & sort |
| `GET` | `/<resource>/all` | `"items": [...]` | List all unpaginated entities |
| `GET` | `/<resource>/{id}` | `"item": {...}` | Retrieve single entity by ID |
| `POST` | `/<resource>` | `"item": {...}` | Create new entity (Status: 201 Created) |
| `PUT` | `/<resource>/{id}` | `"item": {...}` | Update existing entity |
| `DELETE` | `/<resource>/{id}` | `"success": true` | Delete entity |

---

## 💻 CLI Commands

```bash
# Start server
go run cmd/padi/main.go serve

# Database migrations
go run cmd/padi/main.go migrate
go run cmd/padi/main.go migrate:rollback

# Scaffolding
go run cmd/padi/main.go g <table_name>
go run cmd/padi/main.go ga

# Queue Worker
go run cmd/padi/main.go queue:work
```
