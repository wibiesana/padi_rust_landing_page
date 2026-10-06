# 📡 Real-time Server-Sent Events (SSE)

Padi Go Framework includes native, zero-dependency SSE Pub/Sub broadcasting designed for high-performance streaming updates (Chat, Live Dashboards, CRUD Synchronization, Notifications).

---

## ⚡ CLI Code Generator Integration (`--realtime`)

You can generate full CRUD modules pre-integrated with automatic real-time SSE broadcasting by passing the `--realtime` (or `-r`) flag in the CLI:

```bash
# Generate CRUD with Real-time SSE enabled
go run cmd/padi/main.go generate:crud products --realtime
# Or use the short alias:
go run cmd/padi/main.go g products -r

# Generate all database tables with Real-time SSE enabled:
go run cmd/padi/main.go ga -r
```

When the `--realtime` flag is provided, the generator automatically injects `realtime.Publish` calls into the **Store** (`CREATE`), **Update** (`UPDATE`), and **Destroy** (`DELETE`) handlers of the generated Base Controller!

---

## 🛠️ Setting Up SSE Endpoints

### 1. Register Routes
In `app/Routes/api.go`:

```go
r.Mux.Route("/realtime", func(rt chi.Router) {
	rtCtrl := controllers.NewExampleRealtimeController()
	rt.Get("/subscribe", rtCtrl.Subscribe) // Client SSE listener
	rt.Post("/publish", rtCtrl.PublishMessage)
})

// Example CRUD Routes with Real-time triggers
r.Mux.Route("/products", func(pr chi.Router) {
	pCtrl := controllers.NewProductController()
	pr.Get("/", pCtrl.Index)
	pr.Post("/", pCtrl.Store)
	pr.Put("/{id}", pCtrl.Update)
	pr.Delete("/{id}", pCtrl.Delete)
})
```

---

### 2. Controller SSE Subscription
In `app/Controllers/ExampleRealtimeController.go`:

```go
package controllers

import (
	"net/http"

	"github.com/wibiesana/padi_go_core/realtime"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/validator"
)

type ExampleRealtimeController struct{}

func NewExampleRealtimeController() *ExampleRealtimeController {
	return &ExampleRealtimeController{}
}

// Subscribe streams events to connected clients
// Supports single topic: ?topic=products OR multiple topics: ?topics=products,notifications,orders
func (c *ExampleRealtimeController) Subscribe(w http.ResponseWriter, r *http.Request) {
	topic := r.URL.Query().Get("topic")
	if topic == "" && r.URL.Query().Get("topics") == "" {
		topic = "global"
	}
	realtime.SubscribeSSE(topic)(w, r)
}

// PublishMessage broadcasts a manual payload to all topic subscribers
func (c *ExampleRealtimeController) PublishMessage(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Topic   string      `json:"topic" validate:"required"`
		Message interface{} `json:"message" validate:"required"`
	}

	if errs, err := validator.BindJSON(r, &payload); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	realtime.Publish(payload.Topic, payload.Message)
	response.Success(w, nil, "Event broadcasted successfully")
}
```

---

## 🔄 Complete CRUD Real-time Broadcasting Example

Broadcast data changes in real-time immediately after database mutations (**Create**, **Update**, **Delete**).

### Backend: `ProductController.go`

```go
package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/wibiesana/padi_go_core/realtime"
	"github.com/wibiesana/padi_go_core/response"
	"github.com/wibiesana/padi_go_core/validator"
	"app/Models"
	"app/config"
)

type ProductController struct{}

func NewProductController() *ProductController {
	return &ProductController{}
}

// 🟢 1. CREATE DATA
func (c *ProductController) Store(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name  string  `json:"name" validate:"required"`
		Price float64 `json:"price" validate:"required"`
	}

	if errs, err := validator.BindJSON(r, &input); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	product := models.Product{
		Name:  input.Name,
		Price: input.Price,
	}

	if err := config.DB.Create(&product).Error; err != nil {
		response.InternalServerError(w, "Failed to create product")
		return
	}

	// 📡 Broadcast CREATE event to topic "products"
	realtime.Publish("products", map[string]interface{}{
		"action": "CREATE",
		"data":   product,
	})

	response.Created(w, product, "Product created successfully")
}

// 🟡 2. UPDATE DATA
func (c *ProductController) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		response.NotFound(w, "Product not found")
		return
	}

	var input struct {
		Name  string  `json:"name"`
		Price float64 `json:"price"`
	}

	if errs, err := validator.BindJSON(r, &input); err != nil {
		response.UnprocessableEntity(w, errs, "Validation failed")
		return
	}

	config.DB.Model(&product).Updates(models.Product{
		Name:  input.Name,
		Price: input.Price,
	})

	// 📡 Broadcast UPDATE event to topic "products"
	realtime.Publish("products", map[string]interface{}{
		"action": "UPDATE",
		"data":   product,
	})

	response.Success(w, product, "Product updated successfully")
}

// 🔴 3. DELETE DATA
func (c *ProductController) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		response.NotFound(w, "Product not found")
		return
	}

	if err := config.DB.Delete(&product).Error; err != nil {
		response.InternalServerError(w, "Failed to delete product")
		return
	}

	// 📡 Broadcast DELETE event with ID to topic "products"
	realtime.Publish("products", map[string]interface{}{
		"action": "DELETE",
		"id":     product.ID,
	})

	response.Success(w, nil, "Product deleted successfully")
}
```

---

## 💻 Frontend Client Integration

### 1. Vue 3 (Composition API / `<script setup>`)

Complete Vue 3 component example with automatic connect & disconnect lifecycle management:

```vue
<template>
  <div class="product-container">
    <h2>📦 Live Product List (Real-time Sync)</h2>

    <div v-if="products.length === 0">No products available.</div>

    <ul class="product-list">
      <li v-for="p in products" :key="p.id" class="product-item">
        <span><strong>{{ p.name }}</strong> - ${{ p.price.toLocaleString() }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const products = ref([]);
let eventSource = null;

onMounted(() => {
  // 1. Initialize SSE connection to topic "products"
  eventSource = new EventSource('http://localhost:8080/realtime/subscribe?topic=products');

  // 2. Handle incoming real-time events
  eventSource.addEventListener('products', (event) => {
    const payload = JSON.parse(event.data);
    console.log('Real-time event received:', payload);

    switch (payload.action) {
      case 'CREATE':
        // Prepend new item to list
        products.value.unshift(payload.data);
        break;

      case 'UPDATE':
        // Update item in list by ID
        const idx = products.value.findIndex(p => p.id === payload.data.id);
        if (idx !== -1) {
          products.value[idx] = payload.data;
        }
        break;

      case 'DELETE':
        // Remove item from list
        products.value = products.value.filter(p => p.id !== payload.id);
        break;
    }
  });

  eventSource.onopen = () => console.log('🟢 Connected to SSE stream');
  eventSource.onerror = (err) => console.error('🔴 SSE Error:', err);
});

// 3. Clean up SSE connection on component unmount
onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
    console.log('⚪ SSE connection closed');
  }
});
</script>
```

---

### 2. Vanilla JavaScript / React

```javascript
// 1. Connect to SSE topic "products"
const eventSource = new EventSource('http://localhost:8080/realtime/subscribe?topic=products');

// Local UI state
let productList = [];

// 2. Listen to topic events
eventSource.addEventListener('products', (event) => {
  const payload = JSON.parse(event.data);
  console.log('Real-time event received:', payload);

  switch (payload.action) {
    case 'CREATE':
      // Append new item to UI list
      productList.push(payload.data);
      break;

    case 'UPDATE':
      // Update existing item in UI list
      const idx = productList.findIndex(item => item.id === payload.data.id);
      if (idx !== -1) {
        productList[idx] = payload.data;
      }
      break;

    case 'DELETE':
      // Remove item from UI list
      productList = productList.filter(item => item.id !== payload.id);
      break;
  }
});

// 3. Handle connection lifecycle
eventSource.onopen = () => {
  console.log('Connected to real-time SSE stream');
};

eventSource.onerror = (err) => {
  console.error('SSE Connection error:', err);
};
```

---

## 🌟 Helper APIs in `realtime` Package

| Function | Description |
| :--- | :--- |
| `realtime.Publish(topic string, data interface{})` | Broadcasts an event payload to all clients subscribed to `topic`. |
| `realtime.Broadcast(data interface{})` | Broadcasts an event payload across all active topics. |
| `realtime.PublishBatch(events []Event)` | Broadcasts multiple events at once. |
| `realtime.SubscriberCount(topic string) int` | Returns current active subscriber count on a topic. |
| `realtime.Topics() []string` | Returns all currently active topics. |

---

## 💡 Notes & Production Tips

### ⚡ Zero Configuration Needed
- **In-Memory Pub/Sub:** The `realtime` package operates completely *in-memory* using Go Channels and Mutexes (`sync.RWMutex`). No external message broker like Redis, RabbitMQ, or standalone WebSocket server is needed.
- **Automatic SSE Headers:** `realtime.SubscribeSSE` automatically sets HTTP response headers (`text/event-stream`, `no-cache`, `keep-alive`, CORS `*`) and emits a keepalive ping every 30 seconds to prevent connection timeouts.

### 🌐 Nginx Reverse Proxy Configuration (Production)
If you are using **Nginx** as a reverse proxy in production, ensure response buffering is disabled on the SSE endpoint so stream chunks are forwarded to clients immediately without delay:

```nginx
location /realtime/subscribe {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 24h;
    chunked_transfer_encoding off;
}
```



