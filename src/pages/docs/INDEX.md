# 🌾 Padi Rust Api Framework - Documentation

> **Version {{APP_VERSION}}** | Production Ready for Rust (Axum & Tokio)

Welcome to the official documentation for **Padi Rust Api Framework** - a high-performance, zero-bloat Rust framework designed for building professional, cloud-native REST APIs with maximum speed, memory safety, and minimal overhead. Built on top of Axum, Tokio, and SQLx.

> **"PADI: The Staple Layer for Modern High-Throughput APIs."**

> _"Type-safe enough for enterprise, with zero-cost abstractions for extreme performance."_

---

## ✨ P.A.D.I. Philosophy

- **P**erformant: Hyper-optimized execution core leveraging Tokio async multi-threading and zero-cost abstractions.
- **A**daptable: Seamless multi-database support across SQLite, PostgreSQL, and MySQL/MariaDB via SQLx.
- **D**istributed: Built for distributed microservices, background job queues, and real-time SSE pub/sub.
- **I**ntuitive: Clean ActiveRecord design with fluent query building, automated CRUD generator, and Axum handlers.

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
| [🚀 Getting Started](#getting-started) | Installation, setup, CLI workflow, and first steps in Rust | New developers |
| [📚 Core Concepts](#core-concepts) | ActiveRecord, Query Builder, Controllers, Resources, Responses | All developers |
| [🎯 Advanced Topics](#advanced-topics) | Realtime SSE, Background Queue, Multi-Database, Frontend | Experienced users |
| [🚀 Deployment](#deployment-performance) | Docker, Containerization, Production Tuning | DevOps & SREs |
| [💡 Examples](#code-examples) | Ready-to-use Rust code samples & API specs | Quick reference |

---

## 🚀 Getting Started

- **[Quick Start](01-getting-started/QUICK_START.md)**: Rust 2021 Edition setup in under 60 seconds.
- **[Installation Guide](01-getting-started/INSTALLATION.md)**: Dependencies, driver setup, and project configuration.
- **[Configuration Guide](01-getting-started/CONFIGURATION.md)**: Environment variables and `.env` management.
- **[Setup Methods & CLI](01-getting-started/SETUP_METHODS.md)**: Interactive wizard, CLI console commands, and compilation.
- **[First Steps](01-getting-started/FIRST_STEPS.md)**: Auth flow, user registration, and CRUD scaffolding.

---

## 📚 Core Concepts

- **[ActiveRecord](02-core-concepts/ACTIVE_RECORD.md)**: Multi-database ORM (`Model::new`, `all`, `find_or_fail`, `paginate`, `create`, `update`, `delete`).
- **[Query Builder](02-core-concepts/QUERY_BUILDER.md)**: Fluent SQL query builder (`where_`, `filter_where`, `search`, `join`).
- **[Response Structure](02-core-concepts/RESPONSE_STRUCTURE.md)**: Standard JSON format with `item` (entities) and `items` (collections).
- **[Controllers & Routing](02-core-concepts/CONTROLLERS.md)**: Axum handler functions with type-safe extractors (`AuthUser`, `Params`, `Path`, `Body`).
- **[Authentication & JWT](02-core-concepts/AUTHENTICATION.md)**: Stateless Bearer JWT tokens with claims injection and role guards.
- **[Middleware](02-core-concepts/MIDDLEWARE.md)**: CORS, Panic Recovery, Request Logger, and Rate Limiting.
- **[Database](02-core-concepts/DATABASE.md)**: SQLx connection pools for SQLite, PostgreSQL, and MySQL.
- **[CLI Generator](02-core-concepts/CLI_INTERFACE.md)**: Automatic CRUD generator via `padi g <table_name>` and `padi ga`.
- **[Queue System](02-core-concepts/QUEUE.md)**: Asynchronous background worker and database-backed job dispatcher.
- **[Realtime SSE](03-advanced/REALTIME.md)**: Server-Sent Events real-time event broadcasting.
- **[File Storage](02-core-concepts/FILE_UPLOAD.md)**: Secure multipart file uploads with extension filtering.
- **[Email](02-core-concepts/EMAIL.md)**: Asynchronous SMTP mailer with HTML/Text support.
