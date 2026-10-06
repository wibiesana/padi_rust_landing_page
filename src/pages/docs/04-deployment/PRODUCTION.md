# 🚀 Production Deployment & Optimization

Guidelines for running Padi Go Framework in mission-critical production environments.

---

## 📋 Checklist

1. **Compilation Optimization**:
   Build with `-ldflags="-w -s"` to strip debug symbols and reduce binary size:
   ```bash
   go build -ldflags="-w -s" -o padi-server cmd/padi/main.go
   ```

2. **Environment Variables**:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - Set strong random secrets for `APP_KEY` and `JWT_SECRET`.

3. **Process Manager (Systemd)**:
   Create `/etc/systemd/system/padi.service`:
   ```ini
   [Unit]
   Description=Padi Go REST API Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/my-app
   ExecStart=/var/www/my-app/padi-server serve
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
   }
   ```
