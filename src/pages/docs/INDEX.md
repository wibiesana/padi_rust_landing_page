# 🌾 PADI REST API GO Framework - Documentation

> **Version {{APP_VERSION}}** | Production Ready for Go

Welcome to the official documentation for **PADI REST API GO Framework** - a high-performance, zero-bloat Go framework designed for building professional, cloud-native REST APIs with maximum speed and minimal overhead.

> **"PADI: The Staple Layer for Modern High-Throughput APIs."**

> _"Type-safe enough for enterprise, but agile enough for rapid prototyping."_

---

## ✨ P.A.D.I. Philosophy

- **P**erformant: Hyper-optimized execution core leveraging native Go concurrency and zero allocations.
- **A**daptable: Easy to adapt across PostgreSQL, MySQL/MariaDB, and pure-Go SQLite without CGO.
- **D**istributed: Built for distributed microservices, background queues, and real-time SSE pub/sub.
- **I**ntuitive: Clean, fluent generic ActiveRecord design that makes Go backend development a joy.

---

## 📋 Table of Contents

- [✨ P.A.D.I. Philosophy](#padi-philosophy)
- [📖 Quick Navigation](#quick-navigation)
- [🚀 Getting Started](#getting-started)
- [📚 Core Concepts](#core-concepts)
- [🎯 Advanced Topics](#advanced-topics)
- [🚀 Deployment & Performance](#deployment-performance)
- [💡 Code Examples](#code-examples)
- [🔍 Quick Reference](#quick-reference)

---

## 📖 Quick Navigation

| Section | Description | Target Audience |
| :--- | :--- | :--- |
| [🚀 Getting Started](#getting-started) | Installation, setup, and first steps in Go | New developers |
| [📚 Core Concepts](#core-concepts) | Generic ActiveRecord, Query Builder, Controllers, Responses | All developers |
| [🎯 Advanced Topics](#advanced-topics) | Realtime SSE, Background Queue, Multi-Database, Frontend | Experienced users |
| [🚀 Deployment](#deployment-performance) | Docker, Containerization, Production Tuning | DevOps & SREs |
| [💡 Examples](#code-examples) | Ready-to-use Go code samples & Postman API specs | Quick reference |

---

## 🚀 Getting Started

- **[Quick Start](01-getting-started/QUICK_START.md)**: Go 1.22+ setup in under 60 seconds.
- **[Installation Guide](01-getting-started/INSTALLATION.md)**: Dependencies, driver setup, and project setup.
- **[Configuration Guide](01-getting-started/CONFIGURATION.md)**: Environment variables and `.env` management.
- **[First Steps](01-getting-started/FIRST_STEPS.md)**: Auth flow, user registration, and CRUD scaffolding.

---

## 📚 Core Concepts

- **[ActiveRecord](02-core-concepts/ACTIVE_RECORD.md)**: Generic ORM (`Find[T]`, `All[T]`, `Paginate[T]`, `Save`, `Delete`).
- **[Query Builder](02-core-concepts/QUERY_BUILDER.md)**: Fluent SQL query builder (`Where`, `FilterWhere`, `Search`, `Joins`).
- **[Response Structure](02-core-concepts/RESPONSE_STRUCTURE.md)**: Standard JSON format with `items` (collections) and `item` (entities).
- **[Controllers & Routing](02-core-concepts/CONTROLLERS.md)**: Direct routes with Chi router, Base and Custom Controller separation.
- **[Authentication & JWT](02-core-concepts/AUTHENTICATION.md)**: Stateless Bearer JWT tokens with claims injection.
- **[Middleware](02-core-concepts/MIDDLEWARE.md)**: CORS, Panic Recovery, Request Logger, and Rate Limiter.
- **[Database](02-core-concepts/DATABASE.md)**: Native connection pools for SQLite, PostgreSQL, and MySQL.
- **[CLI Generator](02-core-concepts/CLI_INTERFACE.md)**: Automatic CRUD generator via `go run cmd/padi/main.go g <table_name>`.
- **[Queue System](02-core-concepts/QUEUE.md)**: Asynchronous background worker and job dispatcher.
- **[Realtime SSE](03-advanced/REALTIME.md)**: Server-Sent Events real-time event broadcasting.
- **[File Storage](02-core-concepts/FILE_UPLOAD.md)**: Secure multipart file uploads with extension filtering.
- **[Email](02-core-concepts/EMAIL.md)**: SMTP mailer supporting HTML/Text templates.
