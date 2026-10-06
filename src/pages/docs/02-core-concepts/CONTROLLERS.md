# 🎮 Controllers Guide

Controllers in Padi Go Framework encapsulate the HTTP request handling logic for your RESTful resources.

---

## 📋 Architecture

Padi uses a clean **Base Controller** & **Concrete Controller** inheritance structure:

1. **`app/Controllers/Base/<Resource>Controller.go`**:
   - Generated and updated automatically by the Padi CLI.
   - Contains standard CRUD actions (`Index`, `All`, `Show`, `Store`, `Update`, `Destroy`).
   - Uses `github.com/wibiesana/padi_go_core/response` standard methods.
2. **`app/Controllers/<Resource>Controller.go`**:
   - Generated once.
   - Embeds the base controller struct.
   - You can add custom handlers, override base actions, or apply custom validation logic here.

---

## 🛠️ Example Controller Structure

```go
package controllers

import (
	"net/http"

	base "padi-template/app/Controllers/Base"
	models "padi-template/app/Models"
	"github.com/wibiesana/padi_go_core/activerecord"
	"github.com/wibiesana/padi_go_core/response"
)

type ArticleController struct {
	base.ArticleController
}

func NewArticleController() *ArticleController {
	return &ArticleController{}
}

// Custom Action Example: Publish Article
func (c *ArticleController) Publish(w http.ResponseWriter, r *http.Request) {
	id, err := router.ParamUint(r, "id")
	if err != nil {
		response.BadRequest(w, "Invalid ID parameter")
		return
	}

	// FindOrFail returns error if record does not exist — no separate nil check needed
	article, err := activerecord.FindOrFail[models.Article](id)
	if err != nil {
		response.NotFound(w, "Article not found")
		return
	}

	article.Status = "published"
	if err := activerecord.Save(article); err != nil {
		response.InternalServerError(w, "Failed to publish article")
		return
	}

	response.Item(w, article, "Article published successfully")
}
```
