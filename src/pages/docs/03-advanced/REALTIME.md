# 📡 Real-time Server-Sent Events (SSE)

Padi Rust Framework includes native, zero-infrastructure SSE Pub/Sub broadcasting (`padi_core::realtime::Realtime`) powered by Tokio broadcast channels and Axum's native `Sse` response type.

It is designed for high-performance streaming updates: live dashboards, collaborative feeds, notifications, and instant CRUD synchronization.

---

## 📋 Table of Contents

- [🚀 Architecture & Performance](#architecture--performance)
- [🛠️ Setting Up SSE Endpoints](#setting-up-sse-endpoints)
- [📢 Broadcasting Events (`Realtime::publish`)](#broadcasting-events-realtimepublish)
- [🌐 Client Integration (JavaScript / EventSource)](#client-integration-javascript--eventsource)
- [⚙️ Nginx Reverse Proxy Configuration](#nginx-reverse-proxy-configuration)

---

## 🚀 Architecture & Performance

- **Zero-Dependency Pub/Sub:** In-memory Tokio broadcast channels — no Redis, Mercure, or external broker needed.
- **Topic-Based Routing:** Clients subscribe to individual topics (`?topic=orders`) or multiple topics (`?topics=orders,chat,notifications`).
- **Heartbeat Keepalive:** Automatically transmits heartbeat pings every 15 seconds to prevent browser or proxy timeouts.
- **Non-blocking Broadcast:** `Realtime::publish` is synchronous and instant ($O(1)$ channel distribution).

---

## 🛠️ Setting Up SSE Endpoints

Mount the built-in SSE handler in your router (`src/routes/site.rs` or `src/routes/mod.rs`):

```rust
use padi_core::prelude::*;

pub fn routes() -> Router {
    Router::new()
        // Stream endpoint for clients
        .route("/realtime", get(Realtime::sse_handler))
}
```

Clients connect to:
- Single topic: `http://127.0.0.1:8080/realtime?topic=products`
- Multiple topics: `http://127.0.0.1:8080/realtime?topics=products,orders,alerts`

---

## 📢 Broadcasting Events (`Realtime::publish`)

Broadcast updates from any controller or background task:

```rust
use padi_core::prelude::*;

pub async fn store(auth: AuthUser, Body(body): Body) -> ApiResult {
    let new_product = PRODUCTS.create(&body).await?;

    // Broadcast creation event to all subscribers of the "products" topic
    Realtime::publish("products", json!({
        "event": "created",
        "item": ProductResource::wrap(&new_product)
    }));

    created(ProductResource::wrap(&new_product))
}

pub async fn destroy(auth: AuthUser, Path(id): Path<i64>) -> ApiResult {
    PRODUCTS.delete(id).await?;

    // Broadcast deletion event
    Realtime::publish("products", json!({
        "event": "deleted",
        "id": id
    }));

    no_content()
}
```

### Additional Broadcasting Utilities:
```rust
// Broadcast to all active topics
Realtime::broadcast(json!({"system_notice": "Server maintenance in 10 mins"}));

// Check subscriber count on a topic
let count = Realtime::subscriber_count("products");

// List all active topics
let active_topics = Realtime::topics();
```

---

## 🌐 Client Integration (JavaScript / EventSource)

Connecting with native browser `EventSource`:

```javascript
const eventSource = new EventSource('http://127.0.0.1:8080/realtime?topic=products');

eventSource.onopen = () => {
    console.log('Connected to Padi Realtime Stream');
};

eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log('Received real-time event:', payload);

    if (payload.event === 'created') {
        // Append item to UI
    } else if (payload.event === 'deleted') {
        // Remove item from UI
    }
};

eventSource.onerror = (err) => {
    console.error('SSE Error:', err);
};
```

---

## ⚙️ Nginx Reverse Proxy Configuration

When deploying behind Nginx, disable proxy buffering so SSE events stream immediately without lag:

```nginx
location /realtime {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Connection '';
    
    # Crucial for SSE:
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 24h;
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
