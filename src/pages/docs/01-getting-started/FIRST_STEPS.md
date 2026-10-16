# 👣 First Steps Guide

Welcome! This guide walks you through your first API calls with Padi Rust Framework.

---

## 1. Register a User

Send a `POST` request to `/auth/register`:

```bash
curl -X POST http://127.0.0.1:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Dev",
    "email": "alex@example.com",
    "password": "password123"
  }'
```

**Response (201 Created):**
```json
{
  "status": 201,
  "success": true,
  "message": "User registered successfully",
  "item": {
    "user": {
      "id": 1,
      "name": "Alex Dev",
      "email": "alex@example.com",
      "role": "user",
      "created_at": "2026-10-16 14:00:00",
      "updated_at": "2026-10-16 14:00:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Authenticate & Login

Send a `POST` request to `/auth/login`:

```bash
curl -X POST http://127.0.0.1:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "password123"
  }'
```

The response includes the signed JWT Bearer token valid for all protected routes.

---

## 3. Access Protected Route (`/auth/me`)

Send a `GET` request with the Bearer JWT token in the `Authorization` header:

```bash
curl -X GET http://127.0.0.1:8080/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "status": 200,
  "success": true,
  "message": "User profile retrieved",
  "item": {
    "id": 1,
    "name": "Alex Dev",
    "email": "alex@example.com",
    "role": "user",
    "created_at": "2026-10-16 14:00:00",
    "updated_at": "2026-10-16 14:00:00"
  }
}
```

---

## 4. Scaffold Your First Custom Resource

### Step A: Create and Run a Migration
```bash
# Generate a new migration file:
padi make:migration create_products_table
```

Edit the generated file in `database/migrations/<timestamp>_create_products_table.sql`:
```sql
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at VARCHAR(19),
    updated_at VARCHAR(19)
);

-- +down
DROP TABLE IF EXISTS products;
```

Run the migration:
```bash
padi migrate
```

### Step B: Generate CRUD
Run the Padi Generator for the `products` table:

```bash
padi g products
```

This automatically generates and links:
- **Model:** `src/models/product.rs` (introspects table columns and registers in `src/models/mod.rs`)
- **Resource:** `src/resources/product.rs` (registered in `src/resources/mod.rs`)
- **Controller:** `src/controllers/products.rs` (registered in `src/controllers/mod.rs`)
- **Route:** `src/routes/products.rs` (automatically mounted in `src/routes/mod.rs` via `.nest("/products", products::routes())`)

### Step C: Test Your New API Endpoints
- **List products (paginated):**
  ```bash
  curl http://127.0.0.1:8080/products?page=1&per_page=10 \
    -H "Authorization: Bearer <TOKEN>"
  ```
- **Fetch all products (unpaginated):**
  ```bash
  curl http://127.0.0.1:8080/products/all \
    -H "Authorization: Bearer <TOKEN>"
  ```
- **Create a product:**
  ```bash
  curl -X POST http://127.0.0.1:8080/products \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{"name": "Mechanical Keyboard", "price": 99.99, "stock": 50}'
  ```
- **Show product details:**
  ```bash
  curl http://127.0.0.1:8080/products/1 \
    -H "Authorization: Bearer <TOKEN>"
  ```
- **Update a product:**
  ```bash
  curl -X PUT http://127.0.0.1:8080/products/1 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{"price": 89.99}'
  ```
- **Delete a product:**
  ```bash
  curl -X DELETE http://127.0.0.1:8080/products/1 \
    -H "Authorization: Bearer <TOKEN>"
  ```
