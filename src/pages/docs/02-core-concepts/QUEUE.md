# ⏳ Queue System Guide

The Padi Queue System (`padi_core::queue::Queue`) enables asynchronous, non-blocking execution of long-running tasks such as transactional email dispatching, webhook delivery, and background data processing.

---

## 📋 Architecture

- **Database-Backed:** Runs over your existing database connection (SQLite, PostgreSQL, or MySQL) via a lightweight `jobs` table.
- **Zero Extra Infrastructure:** No external message broker (like Redis or RabbitMQ) required.
- **Worker Controls:** Supports max attempts, retry backoff, graceful termination, and queue filtering.

---

## 🚀 1. Registering a Job Handler

Register asynchronous job handlers using `Queue::register`:

```rust
use padi_core::prelude::*;

pub fn register_queue_jobs() {
    Queue::register("SendWelcomeEmail", |payload| Box::pin(async move {
        let email = payload["email"].as_str().unwrap_or("");
        let name = payload["name"].as_str().unwrap_or("");

        println!("Sending welcome email to {} <{}>...", name, email);

        // Send actual email via Email helper
        Email::send(
            email,
            "Welcome to Padi!",
            &format!("<h1>Welcome, {}!</h1>", name),
            &[],
        ).await?;

        Ok(())
    }));
}
```

---

## 📤 2. Pushing Jobs to Queue

Push jobs into the queue from any controller or service:

```rust
use padi_core::prelude::*;

pub async fn register(Body(body): Body) -> ApiResult {
    // ... validate and create user ...
    let user = USERS.create(&body).await?;

    // Push job to default queue:
    Queue::push("SendWelcomeEmail", &json!({
        "email": user["email"],
        "name": user["name"]
    })).await?;

    // Or push with delay (e.g. 60 seconds):
    Queue::push_delayed("SendWelcomeEmail", &json!({
        "email": user["email"]
    }), 60).await?;

    created(UserResource::wrap(&user))
}
```

---

## 👷 3. Processing Jobs via CLI

Start the background worker loop using the `padi` CLI or Cargo:

```bash
# Process jobs continuously on default queue:
padi queue:work

# Process jobs on a specific named queue:
padi queue:work emails

# Process exactly one job and exit:
padi queue:work --once

# Stop when all pending jobs have been processed:
padi queue:work --stop-when-empty
```
