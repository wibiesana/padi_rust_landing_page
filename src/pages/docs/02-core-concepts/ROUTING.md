# 🛣️ Routing Guide

Padi Go Framework uses the ultra-fast, zero-allocation **Chi Router** under the hood. All routes are registered directly without forced version prefixes.

---

## 📋 Table of Contents

- [🚀 Direct Route Registration](#direct-route-registration)
- [📦 Resource Routing](#resource-routing)
- [🛡️ Middleware & Route Groups](#middleware--route-groups)
- [🔀 URL Parameters](#url-parameters)
- [📡 Realtime & Static File Serving](#realtime--static-file-serving)

---

## 🚀 Direct Route Registration

Routes are configured in `app/Routes/api.go`:

```go
package routes

import (
	"net/http"

	controllers "padi-template/app/Controllers"
	"github.com/wibiesana/padi_go_core/middleware"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/router"
	"github.com/go-chi/chi/v5"
)

func RegisterRoutes(r *router.Router) {
	// Root / Health check
	r.Mux.Get("/", func(w http.ResponseWriter, req *http.Request) {
		response.Success(w, map[string]string{"status": "running"}, "Welcome to Padi Go REST API 🌾")
	})

	// Public Auth Endpoints
	authCtrl := controllers.NewAuthController()
	r.Mux.Route("/auth", func(auth chi.Router) {
		auth.Post("/register", authCtrl.Register)
		auth.Post("/login", authCtrl.Login)

		// Protected Auth Endpoints
		auth.Group(func(protected chi.Router) {
			protected.Use(middleware.AuthRequired)
			protected.Get("/me", authCtrl.Me)
		})
	})
}
```

---

## 📦 Resource Routing

Mounting full RESTful CRUD routes:

```go
userCtrl := controllers.NewUserController()

r.Mux.Route("/users", func(r chi.Router) {
	r.Get("/", userCtrl.Index)        // GET /users (Paginated -> 'items' & 'meta')
	r.Get("/all", userCtrl.All)      // GET /users/all (All -> 'items')
	r.Post("/", userCtrl.Store)      // POST /users (Create -> 'item')
	r.Get("/{id}", userCtrl.Show)    // GET /users/{id} (Show -> 'item')
	r.Put("/{id}", userCtrl.Update)  // PUT /users/{id} (Update -> 'item')
	r.Delete("/{id}", userCtrl.Destroy) // DELETE /users/{id} (Delete)
})
```

---

## 🛡️ Middleware & Route Groups

Apply middleware to specific groups easily:

```go
r.Mux.Group(func(admin chi.Router) {
	admin.Use(middleware.AuthRequired)

	admin.Get("/admin/stats", adminCtrl.GetStats)
	admin.Post("/admin/settings", adminCtrl.UpdateSettings)
})
```

---

## 🔀 URL Parameters

Extract parameters using `router.Param` helpers:

```go
func (c *ArticleController) Show(w http.ResponseWriter, r *http.Request) {
	// Extract numeric ID
	id, err := router.ParamUint(r, "id")
	if err != nil {
		response.BadRequest(w, "Invalid ID parameter")
		return
	}

	// Extract string slug
	slug := router.Param(r, "slug")
}
```
