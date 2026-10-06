# 🖥️ Frontend Integration Guide

## 🔌 Seamless Integration with Modern Client Apps

Padi REST API Go Framework produces a clean, consistent response contract designed for effortless consumption in **Vue.js**, **React**, **Next.js**, **Angular**, **Flutter**, and mobile applications.

---

## 📋 Table of Contents

- [🔌 Seamless Integration with Modern Client Apps](#seamless-integration-with-modern-client-apps)
- [📦 Standard Response Contract](#standard-response-contract)
- [🌐 Axios Client Setup](#axios-client-setup)
- [⚛️ React / Next.js Integration Example](#react--nextjs-integration-example)
- [🟢 Vue 3 / Quasar Integration Example](#vue-3--quasar-integration-example)
- [📱 Flutter (Dart) Integration Example](#flutter-dart-integration-example)

---

## 📦 Standard Response Contract

Every response follows one of two predictable shapes:

### 1. Single Entity Response (`item`)
Returned by `GET /<resource>/{id}`, `POST /<resource>`, `PUT /<resource>/{id}`:

```json
{
  "status": 200,
  "success": true,
  "message": "Product retrieved successfully",
  "item": {
    "id": 1,
    "name": "Mechanical Keyboard",
    "price": 1200000
  }
}
```

### 2. Collection / Paginated Response (`items` & `meta`)
Returned by `GET /<resource>?page=1&per_page=15` and `GET /<resource>/all`:

```json
{
  "status": 200,
  "success": true,
  "message": "Product list retrieved successfully",
  "items": [
    { "id": 1, "name": "Mechanical Keyboard", "price": 1200000 }
  ],
  "meta": {
    "total": 50,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4
  }
}
```

---

## 🌐 Axios Client Setup

Configure a global Axios instance with JWT interceptors:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## ⚛️ React / Next.js Integration Example

```tsx
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?page=1&per_page=10')
      .then((res) => {
        // Access 'items' from standard payload
        setProducts(res.data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} - IDR {p.price.toLocaleString()}</li>
      ))}
    </ul>
  );
}
```

---

## 🟢 Vue 3 / Quasar Integration Example

```vue
<template>
  <q-page class="q-pa-md">
    <q-table
      title="Products"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from 'src/boot/axios';

const rows = ref([]);
const loading = ref(true);

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'price', label: 'Price', field: 'price' },
];

onMounted(async () => {
  try {
    const res = await api.get('/products');
    rows.value = res.data.items; // standard 'items' key
  } finally {
    loading.value = false;
  }
});
</script>
```
