# 🖥️ Frontend Integration Guide

## 🔌 Seamless Integration with Modern Client Apps

Padi Rust Api Framework produces a clean, consistent response contract designed for effortless consumption in **Vue 3**, **Quasar**, **React**, **Next.js**, **Angular**, and **Flutter**.

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

Every response follows one of two predictable shapes matching the Padi standard (PHP reference):

### 1. Single Entity Response (`item`)
Returned by `GET /<resource>/{id}`, `POST /<resource>`, `PUT /<resource>/{id}`:

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "message_code": "SUCCESS",
  "item": {
    "id": 1,
    "name": "Mechanical Keyboard",
    "price": 89.99
  }
}
```

### 2. Collection / Paginated Response (`item` with `data` + `meta`)
Returned by `GET /<resource>?page=1&per_page=15` (paginated) and `GET /<resource>/all` (flat list):

**Paginated:**
```json
{
  "success": true,
  "message": "Success",
  "message_code": "SUCCESS",
  "item": {
    "data": [
      { "id": 1, "name": "Mechanical Keyboard", "price": 89.99 }
    ],
    "meta": {
      "total": 50,
      "per_page": 15,
      "current_page": 1,
      "last_page": 4,
      "from": 1,
      "to": 15
    }
  }
}
```

**Unpaginated Collection (`/all`):**
```json
{
  "success": true,
  "message": "Success",
  "message_code": "SUCCESS",
  "item": [
    { "id": 1, "name": "Mechanical Keyboard", "price": 89.99 }
  ]
}
```

---

## 🌐 Axios Client Setup

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## ⚛️ React / Next.js Integration Example

```tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?page=1&per_page=10')
      .then((res) => {
        // Padi paginated responses store entities in `res.data.item.data` (matching PHP reference)
        setProducts(res.data.item.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} - ${p.price}</li>
      ))}
    </ul>
  );
};
```

---

## 🟢 Vue 3 / Quasar Integration Example

```vue
<template>
  <div class="q-pa-md">
    <q-table
      title="Products"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from 'src/services/api';

const rows = ref([]);
const loading = ref(true);

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'price', label: 'Price ($)', field: 'price', sortable: true },
];

onMounted(async () => {
  try {
    const res = await api.get('/products/all');
    rows.value = res.data.items;
  } finally {
    loading.value = false;
  }
});
</script>
```

---

## 📱 Flutter (Dart) Integration Example

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> fetchProducts() async {
  final response = await http.get(
    Uri.parse('http://10.0.2.2:8080/products?page=1&per_page=15'),
    headers: {
      'Authorization': 'Bearer <YOUR_JWT_TOKEN>',
    },
  );

  if (response.statusCode == 200) {
    final Map<String, dynamic> body = json.decode(response.body);
    return body['items']; // Padi collection envelope
  } else {
    throw Exception('Failed to load products');
  }
}
```
