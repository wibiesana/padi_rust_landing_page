# 🚀 Production Deployment & Optimization

Guidelines for running Padi Rust Framework in mission-critical production environments.

---

## 📋 Checklist

1. **Compilation Optimization**:
   Build the optimized standalone binary with Cargo:
   ```bash
   cargo build --release
   ```
   The binary is generated at `target/release/padi_rust`.

2. **Environment Variables**:
   - Set `APP_ENV=production`.
   - Set `APP_DEBUG=false`.
   - Set a strong, cryptographically secure string (min 32 chars) for `JWT_SECRET`.
   - Configure your production database URL via `DATABASE_URL`.

3. **Process Manager (Systemd)**:
   Create `/etc/systemd/system/padi.service`:
   ```ini
   [Unit]
   Description=Padi Rust REST API Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/my-app
   ExecStart=/var/www/my-app/target/release/padi_rust serve --port=8080 --host=127.0.0.1
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```

4. **Nginx Reverse Proxy**:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # For SSE Real-time streaming:
       location /realtime {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;
           proxy_set_header Connection '';
           proxy_buffering off;
           proxy_cache off;
           proxy_read_timeout 24h;
       }
   }
   ```
