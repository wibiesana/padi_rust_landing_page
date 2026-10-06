# 📧 Email Guide

## 🏎️ Industrial-Grade Communication Layer

The Padi Email Engine (`github.com/wibiesana/padi_go_core/email`) provides a native Go SMTP client for dispatching HTML and plain-text emails synchronously or asynchronously via the background queue.

---

## 📋 Table of Contents

- [🏎️ Industrial-Grade Communication Layer](#industrial-grade-communication-layer)
- [⚙️ Configuration](#configuration)
- [📧 Basic Usage](#basic-usage)
- [🚀 Asynchronous / Queued Emails (Recommended)](#asynchronous--queued-emails-recommended)
- [🔍 Troubleshooting](#troubleshooting)

---

## ⚙️ Configuration

Email settings are managed in your `.env` file:

```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="Padi REST API"
```

---

## 📧 Basic Usage

### 1. HTML Email & Attachments
```go
import "github.com/wibiesana/padi_go_core/email"

// Send HTML email with optional attachments
err := email.SendHTML(
    "user@example.com",
    "Monthly Report",
    "<h1>Your Report is Ready</h1>",
    "storage/reports/report_2026.pdf",
)
```

### 2. Template-Driven Emails
Renders standard Go `html/template`:

```go
tmpl := `<h2>Hello {{ .Name }}</h2><p>Your OTP code is <b>{{ .Code }}</b></p>`
data := map[string]string{"Name": "Alice", "Code": "129841"}

err := email.SendTemplate([]string{"alice@example.com"}, "Verification Code", tmpl, data)
```

### 3. Background Async Send (`email.SendAsync`)
Sends immediately in a non-blocking background goroutine:

```go
msg := email.Message{
    To:      []string{"user@example.com"},
    Subject: "Order Shipped",
    Body:    "<p>Your order #1029 has shipped!</p>",
    IsHTML:  true,
}

email.SendAsync(msg, func(err error) {
    if err != nil {
        log.Printf("Async email failed: %v", err)
    }
})
```

---

## 🚀 Asynchronous / Queued Emails (Recommended)

SMTP network roundtrips can take 1–3 seconds. Offload email dispatching to the background queue:

### 1. Register Queue Job Handler
```go
package main

import (
	"encoding/json"
	"github.com/wibiesana/padi_go_core/email"
	"github.com/wibiesana/padi_go_core/queue"
)

func init() {
	queue.RegisterJobHandler("SendWelcomeEmail", func(payload []byte) error {
		var data struct {
			To      string `json:"to"`
			Subject string `json:"subject"`
			Body    string `json:"body"`
		}
		if err := json.Unmarshal(payload, &data); err != nil {
			return err
		}

		return email.Send(data.To, data.Subject, data.Body)
	})
}
```

### 2. Push to Queue in Controller
```go
_ = queue.Push("SendWelcomeEmail", map[string]string{
	"to":      user.Email,
	"subject": "Welcome to Padi!",
	"body":    "<h1>Welcome!</h1>",
}, "emails")
```

### 3. Run Queue Worker
```bash
go run cmd/padi/main.go queue:work emails
```

---

## 🔍 Troubleshooting

1. **SMTP Auth Failures**: Check `MAIL_USERNAME` and `MAIL_PASSWORD` in `.env`.
2. **Port Restrictions**: Ensure the host allows outbound TCP on `MAIL_PORT` (common ports: 587, 465, 2525).
3. **Queue Processing**: Verify the queue worker is running (`go run cmd/padi/main.go queue:work`).
