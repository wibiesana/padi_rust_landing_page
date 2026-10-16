# 📧 Email Guide

## 🏎️ Industrial-Grade Communication Layer

The Padi Email Engine (`padi_core::email::Email`) is built on **lettre** and Tokio. It provides asynchronous SMTP delivery for HTML and plain-text emails, attachments, and background queue dispatching.

---

## 📋 Table of Contents

- [🏎️ Industrial-Grade Communication Layer](#industrial-grade-communication-layer)
- [⚙️ Configuration (.env)](#configuration-env)
- [📧 Sending Emails Directly (`Email::send`)](#sending-emails-directly-emailsend)
- [🚀 Queued Emails (`Email::queue`)](#queued-emails-emailqueue)

---

## ⚙️ Configuration (.env)

Email credentials and transport settings are configured in `.env`:

```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="Padi Rust Api Framework"
```

Supported encryption modes for `MAIL_ENCRYPTION`: `tls` (default), `ssl`, or `none`.

---

## 📧 Sending Emails Directly (`Email::send`)

Send an HTML email with optional attachment paths:

```rust
use padi_core::prelude::*;

pub async fn notify_user() -> ApiResult {
    let to = "user@example.com";
    let subject = "Monthly Invoice & Statement";
    let body = "<h1>Your Statement is Ready</h1><p>Please find your attachment below.</p>";
    let attachments = &["storage/invoices/inv_2026.pdf"];

    let success = Email::send(to, subject, body, attachments).await?;

    ok(json!({ "sent": success }))
}
```

---

## 🚀 Queued Emails (`Email::queue`)

SMTP handshakes and network roundtrips can take several seconds. To keep HTTP response latencies under 5ms, offload email dispatch to the background queue:

```rust
use padi_core::prelude::*;

pub async fn on_order_created(order_id: i64) -> Result<(), ApiError> {
    // Pushes job to the background queue:
    Email::queue(
        "customer@example.com",
        "Order Confirmation",
        &format!("<p>Thank you for your order #{}!</p>", order_id),
        &[],
    ).await?;

    Ok(())
}
```

The background worker will pick up and dispatch the email automatically when running `padi queue:work`.
