# 📑 API Collections & Testing Tools Guide

Every time you build or scaffold endpoints in Padi Rust Framework, the endpoints adhere to standard REST conventions with deterministic URLs and payloads.

---

## 📋 Table of Contents

- [📑 API Collections & Testing Tools Guide](#api-collections--testing-tools-guide)
- [📦 Standard CRUD Endpoints](#standard-crud-endpoints)
- [🚀 Postman & Thunder Client Configuration](#postman--thunder-client-configuration)
- [🎯 Direct URL Standard](#direct-url-standard)

---

## 📦 Standard CRUD Endpoints

All resources generated or developed in Padi Rust provide the following standard endpoints:

| Action | Method | URL Path | Query Parameters | Description |
| :--- | :---: | :--- | :--- | :--- |
| **List (Paginated)** | `GET` | `/<resource>` | `?page=1&per_page=15` | Retrieves paginated entities with metadata |
| **List All** | `GET` | `/<resource>/all` | - | Retrieves all entities without pagination |
| **Show** | `GET` | `/<resource>/{id}` | - | Retrieves a single entity by ID |
| **Create** | `POST` | `/<resource>` | - | Creates a new record |
| **Update** | `PUT` | `/<resource>/{id}` | - | Updates an existing record |
| **Delete** | `DELETE` | `/<resource>/{id}` | - | Deletes a record |

---

## 🚀 Postman & Thunder Client Configuration

### 1. Environment Variables Setup
Create an environment in Postman or Thunder Client with:
- `base_url`: `http://127.0.0.1:8080`
- `token`: `<YOUR_JWT_TOKEN>`

### 2. Header Presets
Set standard HTTP headers:
- `Content-Type`: `application/json`
- `Authorization`: `Bearer {{token}}`

---

## 🎯 Direct URL Standard

Padi Rust endpoints use clean, direct root paths:

```http
GET {{base_url}}/products?page=1&per_page=10
GET {{base_url}}/products/all
GET {{base_url}}/products/1
POST {{base_url}}/products
PUT {{base_url}}/products/1
DELETE {{base_url}}/products/1
```
