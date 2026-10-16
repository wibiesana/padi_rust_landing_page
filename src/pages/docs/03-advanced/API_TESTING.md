# 🧪 API Testing Guide

Padi Rust Framework is built with standard Rust conventions, making unit and integration testing fast, type-safe, and reliable using Cargo's built-in testing framework and Tower/Axum test utilities.

---

## 📋 Writing Integration Tests

Create integration tests in `tests/api_test.rs`:

```rust
use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use padi_core::prelude::*;
use serde_json::json;
use tower::ServiceExt; // for `oneshot`

#[tokio::test]
async fn test_auth_and_health_flow() {
    // 1. Initialize environment & in-memory test database
    std::env::set_var("DB_DRIVER", "sqlite");
    std::env::set_var("DB_DATABASE", ":memory:");
    std::env::set_var("JWT_SECRET", "super-secret-random-jwt-key-must-be-32-chars");

    let _ = Database::connect().await;

    // Build the Axum router
    let app = padi_rust::routes::api();

    // 2. Test root health check
    let response = app
        .clone()
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    // 3. Test user registration
    let payload = json!({
        "name": "Integration Tester",
        "email": "test@example.com",
        "password": "Password123!"
    });

    let reg_response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/auth/register")
                .header("content-type", "application/json")
                .body(Body::from(payload.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(reg_response.status(), StatusCode::CREATED);
}
```

---

## 🚀 Running Tests via Cargo

```bash
# Run all tests in the workspace
cargo test

# Run tests with output printed to terminal
cargo test -- --nocapture

# Run a specific test by name
cargo test test_auth_and_health_flow
```
