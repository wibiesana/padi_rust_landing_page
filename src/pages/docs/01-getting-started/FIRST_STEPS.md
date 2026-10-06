# 👣 First Steps Guide

Welcome! This guide walks you through your first API calls with Padi Go Framework.

---

## 1. Register a User

Send a `POST` request to `/auth/register`:

```bash
curl -X POST http://localhost:8080/auth/register \
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
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Authenticate & Login

Send a `POST` request to `/auth/login`:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "password123"
  }'
```

---

## 3. Access Protected Route (`/auth/me`)

Send a `GET` request with the Bearer JWT token:

```bash
curl -X GET http://localhost:8080/auth/me \
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
    "role": "user"
  }
}
```

---

## 4. Scaffold Your First Custom Resource

Create a table in your database, then run the Padi Generator:

```bash
go run cmd/padi/main.go g products
```

This generates:
- Base Model (`app/Models/Base/Product.go`)
- Custom Model (`app/Models/Product.go`)
- Base Controller (`app/Controllers/Base/ProductController.go`)
- Custom Controller (`app/Controllers/ProductController.go`)
- Postman Collection (`api_collection/product_api_collection.json`)

Register the route in `app/Routes/api.go`:
```go
prodCtrl := controllers.NewProductController()
r.Mux.Route("/products", func(r chi.Router) {
    r.Get("/", prodCtrl.Index)
    r.Get("/all", prodCtrl.All)
    r.Post("/", prodCtrl.Store)
    r.Get("/{id}", prodCtrl.Show)
    r.Put("/{id}", prodCtrl.Update)
    r.Delete("/{id}", prodCtrl.Destroy)
})
```
