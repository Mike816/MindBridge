#!/bin/bash
# ─────────────────────────────────────────────────────────────
# MindBridge Quick Deploy (Cloudflare Tunnel)
# No domain or VPS needed — runs from your Mac
#
# Prerequisites:
#   brew install cloudflared
#   ollama must be running: ollama serve
# ─────────────────────────────────────────────────────────────

set -e

echo ""
echo "🧠 MindBridge Quick Deploy"
echo ""

# Check Ollama
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama is not running. Start it with: ollama serve"
    exit 1
fi
echo "✅ Ollama is running"

# Check cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared not found. Install with: brew install cloudflared"
    exit 1
fi
echo "✅ cloudflared found"

# Generate encryption key if not set
if [ -z "$ENCRYPTION_KEY" ]; then
    export ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo "🔐 Generated encryption key (set ENCRYPTION_KEY env var to persist)"
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Start backend in background
echo "🚀 Starting backend server..."
ENCRYPTION_KEY=$ENCRYPTION_KEY ALLOWED_ORIGIN='*' node server/index.js &
SERVER_PID=$!

# Wait for server
sleep 2

# Start cloudflare tunnel
echo ""
echo "🌐 Starting Cloudflare tunnel..."
echo "   (Your public URL will appear below)"
echo ""
cloudflared tunnel --url http://localhost:3001

# Cleanup on exit
kill $SERVER_PID 2>/dev/null
