#!/bin/bash
# ─────────────────────────────────────────────────────────────
# MindBridge Deployment Script
# Run on a fresh Ubuntu 22.04+ VPS with at least 8GB RAM
#
# Usage:
#   chmod +x deploy.sh
#   sudo ./deploy.sh your-domain.com
# ─────────────────────────────────────────────────────────────

set -e

DOMAIN=${1:?"Usage: sudo ./deploy.sh your-domain.com"}
APP_DIR="/opt/mindbridge"
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo ""
echo "🧠 MindBridge Deployment"
echo "   Domain: $DOMAIN"
echo "   Directory: $APP_DIR"
echo ""

# ── 1. System dependencies ──────────────────────────────────
echo "📦 Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq curl git nginx certbot python3-certbot-nginx

# ── 2. Node.js ──────────────────────────────────────────────
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
fi
echo "   Node: $(node -v)"

# ── 3. Ollama ───────────────────────────────────────────────
echo "📦 Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

echo "🤖 Pulling LLM model (this may take a few minutes)..."
ollama pull llama3.1:8b-instruct-q5_K_M

# ── 4. Application ──────────────────────────────────────────
echo "📁 Setting up application..."
mkdir -p $APP_DIR
cp -r . $APP_DIR/
cd $APP_DIR

echo "📦 Installing npm dependencies..."
npm install --production=false

echo "🔨 Building frontend..."
npm run build

# ── 5. Environment ──────────────────────────────────────────
echo "🔐 Creating environment file..."
cat > $APP_DIR/.env << ENVEOF
ENCRYPTION_KEY=$ENCRYPTION_KEY
OLLAMA_MODEL=llama3.1:8b-instruct-q5_K_M
OLLAMA_URL=http://localhost:11434/api/chat
PORT=3001
ALLOWED_ORIGIN=https://$DOMAIN
ENVEOF

chmod 600 $APP_DIR/.env
echo "   Encryption key saved to $APP_DIR/.env"

# ── 6. Systemd service ─────────────────────────────────────
echo "⚙️  Creating systemd service..."
cat > /etc/systemd/system/mindbridge.service << SVCEOF
[Unit]
Description=MindBridge Backend Server
After=network.target ollama.service
Wants=ollama.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=5

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$APP_DIR/data

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
systemctl enable mindbridge
systemctl start mindbridge

# ── 7. Nginx ───────────────────────────────────────────────
echo "🌐 Configuring nginx..."
sed "s/YOUR_DOMAIN_HERE/$DOMAIN/g" deploy/nginx.conf > /etc/nginx/sites-available/mindbridge
ln -sf /etc/nginx/sites-available/mindbridge /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test config before reloading
nginx -t
systemctl reload nginx

# ── 8. TLS certificate ─────────────────────────────────────
echo "🔒 Obtaining TLS certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

# ── 9. Verify ──────────────────────────────────────────────
echo ""
echo "✅ Deployment complete!"
echo ""
echo "   🌐 https://$DOMAIN"
echo "   🔒 TLS 1.3 enabled"
echo "   🤖 Ollama: llama3.1:8b-instruct-q5_K_M"
echo "   🔐 Encryption key: $APP_DIR/.env"
echo ""
echo "   Useful commands:"
echo "     systemctl status mindbridge    # Check server status"
echo "     journalctl -u mindbridge -f    # View server logs"
echo "     systemctl restart mindbridge   # Restart server"
echo "     curl https://$DOMAIN/api/health  # Health check"
echo ""
echo "   ⚠️  IMPORTANT: Back up your encryption key!"
echo "   Without it, existing session data cannot be decrypted."
echo "   Key: $ENCRYPTION_KEY"
echo ""
