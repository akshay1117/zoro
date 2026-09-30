#!/bin/bash
# ZORO Deployment Script

set -e

echo "🚀 Starting ZORO Deployment Process..."

# 1. Pull latest code
echo "📦 Pulling latest changes..."
git pull origin main

# 2. Rebuild images and restart containers
echo "🐳 Rebuilding Docker containers..."
docker compose -f docker-compose.prod.yml up --build -d

# 3. Run database migrations
echo "🗄️ Running database migrations..."
docker exec zoro-api-prod alembic upgrade head

# 4. Clean up dangling images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete! ZORO is now live."
