# 🎭 Role-Based Access Control (RBAC)

## 🛡️ Granular Authorization & Security Orchestration

Protect your API endpoints with surgical precision. Padi REST API’s Role-Based Access Control (RBAC) combines route-level middleware filtering with fine-grained context checks in Go.

---

## 📋 Table of Contents

- [🛡️ Granular Authorization & Security Orchestration](#granular-authorization--security-orchestration)
- [📖 Overview](#overview)
- [🎭 Route Protection via `middleware.RequireRole`](#route-protection-via-middlewarerequirerole)
- [🛠️ Controller-Level Role & Ownership Verification](#controller-level-role--ownership-verification)
- [⚠️ Error Responses](#error-responses)
- [⭐ Best Practices](#best-practices)

---

## 📖 Overview

Padi Go Framework provides a streamlined approach to RBAC:

- ✅ **`middleware.RequireRole`** for route group protection.
- ✅ **Request Context Claims** for user ID and role inspection.
- ✅ **Owner-based access control** for self-data updates.

---

## 🎭 Route Protection via `middleware.RequireRole`

In `app/Routes/api.go`:

```go
package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/wibiesana/padi_go_core/middleware"
	"github.com/wibiesana/padi_go_core/router"
)

func RegisterRoutes(r *router.Router) {
	// 1. Admin-only Route Group
	r.Mux.Group(func(admin chi.Router) {
		admin.Use(middleware.AuthRequired)
		admin.Use(middleware.RequireRole("admin"))

		admin.Get("/admin/stats", adminCtrl.GetStats)
		admin.Delete("/admin/users/{id}", adminCtrl.DeleteUser)
	})

	// 2. Multi-role Route Group (Admin or Manager)
	r.Mux.Group(func(management chi.Router) {
		management.Use(middleware.AuthRequired)
		management.Use(middleware.RequireRole("admin", "manager"))

		management.Get("/reports", reportCtrl.GetReports)
		management.Post("/products", productCtrl.Store)
	})
}
```

---

## 🛠️ Controller-Level Role & Ownership Verification

Inspect the user's claims directly inside your controller:

```go
package controllers

import (
	"net/http"

	models "padi-template/app/Models"
	"github.com/wibiesana/padi_go_core/activerecord"
	"github.com/wibiesana/padi_go_core/auth"
	"github.com/wibiesana/padi_go_core/middleware"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/router"
	"github.com/wibiesana/padi_go_core/validator"
)

type UserController struct{}

// Helper to extract claims from request context
func (c *UserController) getClaims(r *http.Request) *auth.JWTClaims {
	claims, _ := r.Context().Value(middleware.UserContextKey).(*auth.JWTClaims)
	return claims
}

// Update Profile with Ownership Verification
func (c *UserController) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	id, err := router.ParamUint(r, "id")
	if err != nil {
		response.BadRequest(w, "Invalid ID parameter")
		return
	}

	claims := c.getClaims(r)
	if claims == nil {
		response.Unauthorized(w, "Authentication required")
		return
	}

	// Allow only if user is Admin OR updating their own profile
	if claims.Role != "admin" && claims.UserID != id {
		response.Forbidden(w, "You can only update your own profile")
		return
	}

	user, err := activerecord.Find[models.User](id)
	if err != nil || user == nil {
		response.NotFound(w, "User not found")
		return
	}

	if errs, err := validator.BindJSON(r, user); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	if err := activerecord.Save(user); err != nil {
		response.InternalServerError(w, "Failed to update profile")
		return
	}

	response.Item(w, user, "Profile updated successfully")
}
```

---

## ⚠️ Error Responses

| HTTP Status | Message | Scenario |
| :---: | :--- | :--- |
| **401 Unauthorized** | `Authentication required` | Missing or invalid Bearer JWT token |
| **403 Forbidden** | `Forbidden: insufficient permissions` | User role does not match required roles |
| **403 Forbidden** | `You can only update your own profile` | Ownership check failed |
| **404 Not Found** | `Resource not found` | Target entity does not exist |

---

## ⭐ Best Practices

1. **Defense in Depth**: Combine route-level `middleware.RequireRole` for coarse filtering with controller-level checks for fine-grained resource ownership.
2. **Never Trust URL IDs blindly**: Always verify that the authenticated `claims.UserID` matches the entity's owner ID unless the user has an `admin` role.
3. **Fail Closed**: Return `403 Forbidden` immediately if claims are missing or unauthorized.
