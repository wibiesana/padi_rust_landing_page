# 🧪 API Testing Guide

Padi Go Framework is built with pure Go standards, making unit and integration testing fast and frictionless using Go's built-in `testing` and `net/http/httptest` packages.

---

## 📋 Writing Integration Tests

Create integration tests in `app/Controllers/integration_test.go`:

```go
package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"padi-template/app/Routes"
	"github.com/wibiesana/padi_go_core/database"
	"github.com/wibiesana/padi_go_core/router"
)

func setupTestRouter() *router.Router {
	// Initialize in-memory SQLite for instant, isolated tests
	_ = database.InitDB(database.Config{
		Driver:   "sqlite",
		Database: "file:test_mem?mode=memory&cache=shared",
	})

	r := router.New()
	routes.RegisterRoutes(r)
	return r
}

func TestRegisterAndLoginFlow(t *testing.T) {
	r := setupTestRouter()

	// 1. Test User Registration
	regPayload := []byte(`{"name":"Test User","email":"test@example.com","password":"password123"}`)
	req, _ := http.NewRequest("POST", "/auth/register", bytes.NewBuffer(regPayload))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.Mux.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected 201 Created, got %d", w.Code)
	}

	var res struct {
		Success bool `json:"success"`
		Item    struct {
			Token string `json:"token"`
		} `json:"item"`
	}
	_ = json.Unmarshal(w.Body.Bytes(), &res)

	if !res.Success || res.Item.Token == "" {
		t.Fatalf("Failed to retrieve token from register response")
	}
}
```

---

## 🚀 Running Tests

```bash
# Run all tests in the project
go test -v ./...

# Run specific package tests
go test -v ./app/Controllers
```
