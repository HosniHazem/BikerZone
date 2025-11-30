#!/bin/bash

echo "🏍️  BikerZone - Quick Setup Script"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file with default values..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=bikerzone
DATABASE_PASSWORD=biker_secure_2024
DATABASE_NAME=bikerzone_db
MONGODB_URI=mongodb://bikerzone:mongo_secure_2024@mongodb:27017/bikerzone_social?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_2024
JWT_SECRET=bikerzone-jwt-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=bikerzone-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRATION=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SENDGRID_API_KEY=
FROM_EMAIL=noreply@bikerzone.com
FCM_SERVER_KEY=
GOOGLE_MAPS_API_KEY=
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🚀 Starting services with Docker Compose..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ BikerZone is starting!"
echo ""
echo "📍 Access URLs:"
echo "   - Frontend: http://localhost:8080"
echo "   - Backend API: http://localhost:3000/api"
echo "   - Swagger Docs: http://localhost:3000/api/docs"
echo "   - PgAdmin: http://localhost:5050 (dev only)"
echo ""
echo "🔍 Check service status:"
echo "   docker-compose ps"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
echo "🎉 Setup complete!"
