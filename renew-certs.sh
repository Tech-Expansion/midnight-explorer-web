#!/bin/bash
# Auto-renew or create SSL certificates for all domains

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/cert-renewal.log"
EMAIL="texblabs@gmail.com"

cd "$SCRIPT_DIR"

echo "=== SSL Certificate Management - $(date) ===" >> "$LOG_FILE"

# Stop Nginx to free port 80
echo "Stopping Nginx..." >> "$LOG_FILE"
docker stop midnight-explorer-web-nginx >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Nginx stopped successfully" >> "$LOG_FILE"
else
    echo "✗ Failed to stop Nginx" >> "$LOG_FILE"
fi

# Domains to manage
DOMAINS=(
    "testing.midnight-explorer.texlabs.org"
    "midnight-explorer.texlabs.org"
    "dev.midnight-explorer.texlabs.org"
)

for domain in "${DOMAINS[@]}"; do
    # Check if certificate exists
    if [ -f "nginx/certs/live/$domain/fullchain.pem" ]; then
        # Certificate exists - renew
        echo "Renewing certificate for $domain..." >> "$LOG_FILE"
        docker run --rm -p 80:80 \
            -v $(pwd)/nginx/certs:/etc/letsencrypt \
            certbot/certbot renew \
            --cert-name "$domain" \
            --non-interactive >> "$LOG_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✓ $domain renewal successful" >> "$LOG_FILE"
        else
            echo "✗ $domain renewal failed" >> "$LOG_FILE"
        fi
    else
        # Certificate doesn't exist - create new
        echo "Creating new certificate for $domain..." >> "$LOG_FILE"
        docker run --rm -p 80:80 \
            -v $(pwd)/nginx/certs:/etc/letsencrypt \
            certbot/certbot certonly --standalone \
            -d "$domain" \
            --email "$EMAIL" \
            --agree-tos \
            --no-eff-email \
            --non-interactive >> "$LOG_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✓ $domain certificate created successfully" >> "$LOG_FILE"
        else
            echo "✗ $domain certificate creation failed" >> "$LOG_FILE"
        fi
    fi
done

# Restart Nginx
echo "Starting Nginx..." >> "$LOG_FILE"
docker compose -f docker-compose.nginx.yml up -d nginx >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Nginx started successfully" >> "$LOG_FILE"
else
    echo "✗ Failed to start Nginx" >> "$LOG_FILE"
fi

# Verify all certificates
echo "Certificate status:" >> "$LOG_FILE"
for domain in "${DOMAINS[@]}"; do
    if [ -f "nginx/certs/live/$domain/fullchain.pem" ]; then
        EXPIRY=$(openssl x509 -enddate -noout -in "nginx/certs/live/$domain/fullchain.pem" 2>/dev/null | cut -d= -f2)
        if [ -n "$EXPIRY" ]; then
            echo "  ✓ $domain → Expires: $EXPIRY" >> "$LOG_FILE"
        else
            echo "  ✗ $domain → Certificate error" >> "$LOG_FILE"
        fi
    else
        echo "  ✗ $domain → Certificate not found" >> "$LOG_FILE"
    fi
done

echo "=== Management Complete ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
