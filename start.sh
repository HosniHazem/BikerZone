#!/bin/bash

echo "🏍️  BikerZone - Starting Application..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo -e "${BLUE}📦 Pulling latest images...${NC}"
docker-compose pull

echo -e "${BLUE}🔨 Building containers...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✓ Services started!${NC}"
echo ""
echo "Waiting for services to be healthy..."

# Wait for services
sleep 10

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 BikerZone is ready!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📍 Access Points:${NC}"
echo -e "   Frontend:  ${BLUE}http://localhost:8080${NC}"
echo -e "   API:       ${BLUE}http://localhost:3000/api${NC}"
echo -e "   API Docs:  ${BLUE}http://localhost:3000/api/docs${NC}"
echo ""
echo -e "${YELLOW}🔍 Useful Commands:${NC}"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose down"
echo "   Restart:         docker-compose restart"
echo "   Check status:    docker-compose ps"
echo ""
echo -e "${YELLOW}📊 Service Status:${NC}"
docker-compose ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
