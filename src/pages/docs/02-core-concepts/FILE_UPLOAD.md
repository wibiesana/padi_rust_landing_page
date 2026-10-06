# 📁 File Upload & Storage Guide

Padi provides a secure, high-performance file upload handler with built-in protection against malicious extensions, **MIME content sniffing** (blocks disguised executables), randomized unique filename hashing, and automatic public URL generation.

---

## 🛠️ Handling File Uploads in Controllers

File storage is managed by the **`github.com/wibiesana/padi_go_core/storage`** package (or alias **`github.com/wibiesana/padi_go_core/file`**), equivalent to `File::upload()` in the PHP version:

```go
package controllers

import (
    "net/http"

    "github.com/wibiesana/padi_go_core/response"
    "github.com/wibiesana/padi_go_core/storage"
)

func (c *UserController) UploadAvatar(w http.ResponseWriter, r *http.Request) {
    opts := storage.DefaultUploadOptions()
    opts.SubDir = "avatars"
    opts.AllowedExts = []string{"jpg", "jpeg", "png", "webp"}
    opts.MaxSizeBytes = 5 * 1024 * 1024 // 5MB limit

    // 1. Upload file directly from multipart form key "avatar"
    relPath, err := storage.Upload(r, "avatar", opts)
    if err != nil {
        response.UnprocessableEntity(w, err.Error(), "Upload rejected")
        return
    }

    // 2. Build absolute URL for client
    fileURL := storage.URL(r, relPath)

    response.Success(w, map[string]string{
        "path": relPath, // Store relative path in database (e.g. avatars/20260831_abc.jpg)
        "url":  fileURL, // Return absolute URL to client (e.g. http://localhost:8080/storage/avatars/20260831_abc.jpg)
    }, "Avatar uploaded successfully")
}
```

---

## 🖼️ Safe URL for Nullable Database Columns

Use `storage.URLOrNull` when the file column in your database may be empty — it returns an empty string instead of a broken URL:

```go
// In your Resource / afterLoad transformer:
photoURL := storage.URLOrNull(r, item["photo"])
// Returns "" when photo is empty — no broken URLs in API responses
```

---

## 📦 Storage API Reference

| Function | Description |
| :--- | :--- |
| `storage.Upload(r, "field", opts)` | Upload a single file from `http.Request` |
| `storage.UploadMultiple(r, "photos", opts)` | Upload multiple files from a single field |
| `storage.SaveUploadedFile(fileHeader, opts)` | Save a `multipart.FileHeader` directly |
| `storage.URL(r, relativePath)` | Generate absolute public URL |
| `storage.URLOrNull(r, relativePath)` | Generate URL or empty string for empty paths |
| `storage.Exists(relativePath)` | Check if file exists on disk |
| `storage.Size(relativePath)` | Retrieve file size in bytes |
| `storage.MimeType(relativePath)` | Detect MIME type of stored file |
| `storage.Delete(relativePath)` | Remove file from storage disk |

---

## 🔒 Security Features

| Protection | Description |
| :--- | :--- |
| **Dangerous extension blacklist** | Blocks `.exe`, `.bat`, `.php`, `.sh`, `.py`, `.js`, `.dll` and more |
| **Whitelist validation** | Only extensions in `AllowedExts` are accepted |
| **MIME content sniffing** | Reads first 512 bytes to block PHP/shell scripts disguised as images |
| **Randomized filenames** | Generates `YYYYMMDD_<16-byte-hex>.<ext>` to prevent enumeration attacks |
| **Path traversal prevention** | `filepath.Clean` ensures files stay within storage directory |
| **Size limit enforcement** | Configurable per-upload max size (default 10MB) |
