# Midnight Explorer Web

Next.js blockchain explorer application. 

## Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Docker Deployment

```bash
docker compose up -d
```

## HTTPS Setup

### 1. DNS Configuration

Point your domain to server IP:
```
A    @      YOUR_SERVER_IP
A    www    YOUR_SERVER_IP
```

### 2. Get SSL Certificate

```bash
# Stop Nginx
docker stop midnight-explorer-web-nginx

# Get certificate
docker run --rm -p 80:80 \
  -v $(pwd)/nginx/certs:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos --no-eff-email --non-interactive

# Start Nginx
docker compose -f docker-compose.nginx.yml up -d nginx
```

### 3. Auto-Renewal

```bash
chmod +x renew-certs.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /root/midnight-explorer-web/renew-certs.sh") | crontab -
```

Auto-renews daily at 3 AM for all configured domains.

## Blue-Green Deployment

### Deploy to Green environment

```bash
# 1. Update inactive container
docker compose up -d midnight-explorer-web-test

# 2. Switch traffic in nginx config
sed -i 's/midnight-explorer-web-dev/midnight-explorer-web-test/g' nginx/conf.d/default.conf

# 3. Reload (zero downtime)
docker exec midnight-explorer-web-nginx nginx -s reload
```

### Rollback

```bash
sed -i 's/midnight-explorer-web-test/midnight-explorer-web-dev/g' nginx/conf.d/default.conf
docker exec midnight-explorer-web-nginx nginx -s reload
```

## Network Setup

Ensure containers are on same network:

```bash
docker network create midnight-net
docker network connect midnight-net midnight-explorer-web-nginx
docker network connect midnight-net midnight-explorer-web-dev
docker network connect midnight-net midnight-explorer-web-test
```
