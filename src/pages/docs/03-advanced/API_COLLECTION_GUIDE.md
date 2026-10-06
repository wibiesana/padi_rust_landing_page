# 📑 API Collections & Postman / Thunder Client Guide

Every time you generate CRUD for a table using `go run cmd/padi/main.go g <table_name>`, Padi automatically creates an API Collection JSON file in `api_collection/<table_name>_api_collection.json`.

---

## 📋 Table of Contents

- [📑 API Collections & Postman / Thunder Client Guide](#api-collections--postman--thunder-client-guide)
- [📦 Generated API Collection Files](#generated-api-collection-files)
- [🚀 Importing into Postman](#importing-into-postman)
- [⚡ Importing into Thunder Client (VS Code)](#importing-into-thunder-client-vs-code)
- [🎯 Direct URL Standard](#direct-url-standard)

---

## 📦 Generated API Collection Files

The file contains ready-to-test requests for all endpoints:

1. **List Paginated (`GET {{base_url}}/<resource>?page=1&per_page=15`)**
2. **List All (`GET {{base_url}}/<resource>/all`)**
3. **Show by ID (`GET {{base_url}}/<resource>/1`)**
4. **Create (`POST {{base_url}}/<resource>`)** with sample JSON payload
5. **Update (`PUT {{base_url}}/<resource>/1`)** with sample JSON payload
6. **Delete (`DELETE {{base_url}}/<resource>/1`)**

---

## 🚀 Importing into Postman

1. Open Postman.
2. Click **Import** (top left).
3. Select `api_collection/<table_name>_api_collection.json`.
4. Set the collection variable `base_url` to `http://localhost:8080`.
5. Set `token` variable to your Bearer JWT token.

---

## ⚡ Importing into Thunder Client (VS Code)

1. Open the Thunder Client extension in VS Code.
2. Go to **Collections** $\rightarrow$ **Import**.
3. Select `api_collection/<table_name>_api_collection.json`.

---

## 🎯 Direct URL Standard

All endpoints use direct root routes:

```
{{base_url}}/products
{{base_url}}/products/all
{{base_url}}/products/1
```
