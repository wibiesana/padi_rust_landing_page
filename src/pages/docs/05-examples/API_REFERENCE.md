# 📋 API Quick Reference

A fast cheatsheet for Padi Rust REST API.

---

## 🌾 Endpoints Reference

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register new user account | ❌ |
| `POST` | `/auth/login` | Login and obtain Bearer JWT token | ❌ |
| `POST` | `/auth/refresh` | Refresh existing JWT token | ✅ |
| `POST` | `/auth/logout` | Client logout / invalidate session | ✅ |
| `GET` | `/auth/me` | Fetch authenticated user profile | ✅ |
| `POST` | `/auth/password/forgot` | Request password reset token | ❌ |
| `POST` | `/auth/password/reset` | Reset password using token | ❌ |

---

### 📦 Standard CRUD Endpoints

| Method | Endpoint | Return Key | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/<resource>?page=1&per_page=15` | `"items": [...]`, `"meta": {...}` | List paginated entities with sort |
| `GET` | `/<resource>/all` | `"items": [...]` | List all unpaginated entities |
| `GET` | `/<resource>/{id}` | `"item": {...}` | Retrieve single entity by ID |
| `POST` | `/<resource>` | `"item": {...}` | Create new entity (Status: 201 Created) |
| `PUT` | `/<resource>/{id}` | `"item": {...}` | Update existing entity |
| `DELETE` | `/<resource>/{id}` | - | Delete entity (Status: 204 No Content) |

---

## 💻 CLI Commands

```bash
# Start server
padi serve
# Or: cargo run

# Database migrations
padi migrate
padi migrate:rollback
padi migrate:status

# Scaffolding
padi g <table_name>
padi ga

# Make individual components
padi make:controller <Name>
padi make:model <table_name>
padi make:resource <Name>
padi make:migration <name>

# Queue Worker
padi queue:work

# Interactive Setup Wizard
padi init
```
