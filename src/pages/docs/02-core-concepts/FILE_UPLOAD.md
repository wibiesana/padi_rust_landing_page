# 📁 File Upload & Storage Guide

Padi Rust Framework provides a secure, high-performance file upload handler (`padi_core::file::File`) with built-in protection against malicious file extensions, content inspection, randomized unique filename generation, and absolute public URL builders.

---

## 🎯 Best Practice: "Relative Path in DB, Full URL in Response"

`File::upload()` always returns a **relative path** (e.g., `avatars/f47ac10b58cc4372a5670e02b2c3d479.jpg`).

1. **In Database:** Store the relative path: `avatars/f47ac10b58cc4372a5670e02b2c3d479.jpg`.
2. **In API Responses:** Convert to an absolute URL with `File::url("avatars/f47ac10b58cc4372a5670e02b2c3d479.jpg")` or `File::url_or_null(...)`.

---

## 🛠️ Handling File Uploads in Handlers

```rust
use axum::extract::Multipart;
use padi_core::{file::UploadOptions, prelude::*};

pub async fn upload_avatar(mut multipart: Multipart) -> ApiResult {
    while let Some(field) = multipart.next_field().await.map_err(|e| ApiError::bad_request(e.to_string()))? {
        let name = field.name().unwrap_or("").to_string();

        if name == "avatar" {
            let filename = field.file_name().unwrap_or("avatar.jpg").to_string();
            let data = field.bytes().await.map_err(|e| ApiError::bad_request(e.to_string()))?;

            let uploaded_file = UploadedFile {
                filename,
                data: data.to_vec(),
            };

            let opts = UploadOptions {
                sub_dir: "avatars",
                allowed_types: &["jpg", "jpeg", "png", "webp"],
                max_size: 5 * 1024 * 1024, // 5MB
            };

            // Saves to storage/uploads/avatars/<uuid>.<ext>
            let rel_path = File::upload(&uploaded_file, opts)?;
            let full_url = File::url(&rel_path);

            return ok(json!({
                "path": rel_path,
                "url": full_url
            }));
        }
    }

    Err(ApiError::bad_request("No avatar file provided"))
}
```

---

## 🖼️ Safe URL for Nullable Columns

Use `File::url_or_null` when the file column in your database may be empty or null — it returns an empty string instead of an invalid URL:

```rust
let photo_url = File::url_or_null(user["avatar"].as_str());
```

---

## 📦 File API Reference

| Function | Description |
| :--- | :--- |
| `File::upload(file, opts)` | Validate, randomize name, and persist file to disk |
| `File::url(path)` | Build absolute public URL (e.g. `http://localhost:8080/uploads/...`) |
| `File::url_or_null(opt_path)` | Build absolute URL or return empty string if path is empty/null |
| `File::exists(path)` | Check if file exists on disk |
| `File::size(path)` | Get file size in bytes |
| `File::delete(path)` | Remove file from storage disk |
| `File::mime_type(path)` | Detect MIME type of file |

---

## 🔒 Security Protections

- **Dangerous Extension Blacklist:** Rejects `.php`, `.exe`, `.bat`, `.sh`, `.py`, `.js`, `.dll`, `.cgi`, `.aspx`, and more.
- **Whitelist Enforcement:** Only files with extensions listed in `allowed_types` are accepted.
- **Defense-in-depth Content Inspection:** Scans file content to block disguised executable scripts.
- **Path Traversal Shield:** Sanitizes paths to guarantee files remain strictly inside `storage/uploads`.
- **UUID Filenames:** Generates collision-free, unguessable filenames using UUID v4.
