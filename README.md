# Midnight Explorer

**Midnight Explorer** is an open-source blockchain explorer for the [Midnight Network](https://midnight.network) — a privacy-preserving blockchain platform. It provides a real-time interface to search, trace, and analyze on-chain activity including transactions, blocks, smart contracts, and liquidity pools.

This project extends the Midnight Network with additional
developer tooling.

## ✨ Features

- 🔍 **Universal Search** — Look up blocks, transactions, addresses, and contracts by hash or ID
- 📦 **Block Explorer** — Browse the latest blocks with full block details and transaction lists
- 💸 **Transaction Viewer** — Inspect transaction data, inputs, outputs, and contract interactions
- 👤 **Address Explorer** — View address history, balances, and associated contracts
- 📜 **Smart Contracts** — Browse deployed contracts and their on-chain state
- 🌊 **Pool Analytics** — Track liquidity pool metrics and activity
- 📊 **Network Charts** — Visualize on-chain statistics and trends over time
- 📡 **Live Network Stats** — Real-time metrics including current epoch, slot, total blocks, transactions, and average block time
- � **Network Switcher** — Switch between Midnight environments (Preprod, Mainnet) from the header

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Database | PostgreSQL (`pg`) |
| Runtime | Midnight Network SDK (`@midnight-ntwrk/*`) |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (runs on port 8080)
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## 🐳 Docker Deployment

```bash
docker compose up -d
```

## 🔒 HTTPS Setup

### 1. DNS Configuration

Point your domain to the server IP:

```
A    @      YOUR_SERVER_IP
A    www    YOUR_SERVER_IP
```

### 2. Get SSL Certificate

```bash
# Stop Nginx
docker stop midnight-explorer-web-nginx

# Obtain certificate via Let's Encrypt
docker run --rm -p 80:80 \
  -v $(pwd)/nginx/certs:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos --no-eff-email --non-interactive

# Restart Nginx with HTTPS config
docker compose -f docker-compose.nginx.yml up -d nginx
```

### 3. Auto-Renewal

```bash
chmod +x renew-certs.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /root/midnight-explorer-web/renew-certs.sh") | crontab -
```

Certificates auto-renew daily at 3 AM.

## 🔵 Blue-Green Deployment

Zero-downtime deployments using a blue-green strategy.

### Deploy to Green

```bash
# 1. Start the new (test) container
docker compose up -d midnight-explorer-web-test

# 2. Switch Nginx traffic to new container
sed -i 's/midnight-explorer-web-dev/midnight-explorer-web-test/g' nginx/conf.d/default.conf

# 3. Reload Nginx (zero downtime)
docker exec midnight-explorer-web-nginx nginx -s reload
```

### Rollback

```bash
sed -i 's/midnight-explorer-web-test/midnight-explorer-web-dev/g' nginx/conf.d/default.conf
docker exec midnight-explorer-web-nginx nginx -s reload
```

## 🌐 Network Setup

Ensure all containers share the same Docker network:

```bash
docker network create midnight-net
docker network connect midnight-net midnight-explorer-web-nginx
docker network connect midnight-net midnight-explorer-web-dev
docker network connect midnight-net midnight-explorer-web-test
```

## 📄 License

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

