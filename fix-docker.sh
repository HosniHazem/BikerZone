#!/bin/bash

# Fix Docker Compose ContainerConfig Error
# This script removes old containers and rebuilds cleanly

echo "🔧 Fixing Docker Compose ContainerConfig Error"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stop all containers
echo "⏹️  Stopping all containers..."
docker-compose down 2>/dev/null || true

# Remove the problematic API container specifically
echo "🗑️  Removing old API container..."
docker rm -f bikerzone_api 2>/dev/null || true

# Remove any dangling containers
echo "🧹 Cleaning up dangling containers..."
docker container prune -f

# Remove old images for API (optional but recommended)
echo "🗑️  Removing old API images..."
docker rmi bikerzone-code-api 2>/dev/null || true
docker rmi bikerzone-fixed-api 2>/dev/null || true

# Rebuild without cache
echo ""
echo "🔨 Rebuilding API from scratch..."
docker-compose build --no-cache api

# Start all services
echo ""
echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy (30 seconds)..."
sleep 30

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Done! Check if services are healthy above."
echo ""
echo "🔍 To view API logs:"
echo "   docker-compose logs -f api"
echo ""
echo "🧪 To test API:"
echo "   curl http://localhost:3000/api/v1/health"
