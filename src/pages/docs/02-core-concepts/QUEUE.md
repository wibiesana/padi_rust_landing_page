# ⏳ Queue System Guide

The Padi Queue System enables asynchronous execution of long-running tasks such as sending emails, image resizing, or third-party webhooks.

---

## 🚀 1. Registering a Job Handler

Register handlers using `queue.RegisterJobHandler`:

```go
package main

import (
	"encoding/json"
	"log"

	"github.com/wibiesana/padi_go_core/queue"
)

func init() {
	queue.RegisterJobHandler("SendWelcomeEmail", func(payload []byte) error {
		var data struct {
			Email string `json:"email"`
			Name  string `json:"name"`
		}
		if err := json.Unmarshal(payload, &data); err != nil {
			return err
		}

		log.Printf("Sending email to %s <%s>...", data.Name, data.Email)
		return nil
	})
}
```

---

## 📤 2. Pushing Jobs to Queue

Push jobs from any controller or action:

```go
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
    // ... create user ...

    // Push background job
    _ = queue.Push("SendWelcomeEmail", map[string]string{
        "email": user.Email,
        "name":  user.Name,
    }, "emails")

    response.Created(w, user, "User registered successfully")
}
```

---

## 👷 3. Processing Jobs

Run the queue worker daemon:

```bash
go run cmd/padi/main.go queue:work emails
```
