# 📄 Pagination & Search Guide

## 📊 Industrial-Grade Data Streaming & Pagination

Padi REST API Go Framework provides a high-performance pagination engine built into both **ActiveRecord** (`activerecord.Paginate[T]`) and the **Query Builder** (`query.Paginate`).

---

## 📋 Table of Contents

- [📊 Industrial-Grade Data Streaming & Pagination](#industrial-grade-data-streaming--pagination)
- [📦 Response Structure](#response-structure)
- [🛠️ ActiveRecord Pagination](#activerecord-pagination)
- [🔍 Query Parameters](#query-parameters)
- [📑 Query Builder Pagination](#query-builder-pagination)
- [⭐ Best Practices](#best-practices)

---

## 📦 Response Structure

All paginated responses in Padi follow a deterministic format:

```json
{
  "status": 200,
  "success": true,
  "message": "Product list retrieved successfully",
  "items": [
    {
      "id": 1,
      "name": "Mechanical Keyboard",
      "price": 1200000,
      "category": "Electronics"
    },
    {
      "id": 2,
      "name": "Wireless Mouse",
      "price": 450000,
      "category": "Electronics"
    }
  ],
  "meta": {
    "total": 50,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4,
    "from": 1,
    "to": 15
  }
}
```

---

## 🛠️ ActiveRecord Pagination

Inside your controller, extract query parameters using `query.ParseOptions(r)` and call `activerecord.Paginate`:

```go
package controllers

import (
	"net/http"

	models "padi-template/app/Models"
	resources "padi-template/app/Resources"
	"github.com/wibiesana/padi_go_core/activerecord"
	"github.com/wibiesana/padi_go_core/query"
	"github.com/wibiesana/padi_go_core/response"
)

func (c *ProductController) Index(w http.ResponseWriter, r *http.Request) {
	// Parse page, per_page, search, sort, order from URL query string
	opts := query.ParseOptions(r)

	// Searchable database columns
	searchColumns := []string{"name", "description", "category"}

	meta, records, err := activerecord.Paginate[models.Product](opts, searchColumns...)
	if err != nil {
		response.InternalServerError(w, "Failed to retrieve products")
		return
	}

	res := resources.NewProductResource()
	response.Paginated(w, res.ToMapCollection(records), meta, "Product list retrieved successfully")
}
```

---

## 🔍 Query Parameters

| Parameter | Type | Default | Example | Description |
| :--- | :---: | :---: | :--- | :--- |
| `page` | `int` | `1` | `?page=2` | Current page number |
| `per_page` | `int` | `15` | `?per_page=25` | Number of items per page (Max: 100) |
| `search` | `string` | `""` | `?search=Keyboard` | Substring search across designated columns |
| `sort` | `string` | `"id"` | `?sort=price` | Column to sort by |
| `order` | `string` | `"DESC"` | `?order=ASC` | Sort direction (`ASC` or `DESC`) |

---

## 📑 Query Builder Pagination

When building custom complex queries with joins and conditional filters:

```go
var products []models.Product

meta, err := query.New("products").
	Where("status", "active").
	Where("price", ">=", 100000).
	OrderBy("created_at", "DESC").
	Paginate(1, 20, &products)

if err != nil {
	response.InternalServerError(w, "Query error")
	return
}

response.Paginated(w, products, meta, "Filtered products retrieved")
```

---

## ⭐ Best Practices

1. **Index Search Columns**: Ensure all columns passed to `searchColumns...` have database indexes.
2. **Cap `per_page`**: Limit `per_page` to prevent clients from requesting millions of rows in a single query.
3. **Use Resources**: Pass the paginated records through `res.ToMapCollection(records)` to ensure consistent transformations.
