#!/bin/bash

echo "🔍 BikerZone - Diagnostic Tool"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

echo ""
echo "1️⃣  Checking Docker..."
docker --version > /dev/null 2>&1
check_status "Docker installed"

docker info > /dev/null 2>&1
check_status "Docker running"

echo ""
echo "2️⃣  Checking Ports..."
for port in 3000 8080 5433 27018 6380; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${GREEN}✓${NC} Port $port is in use"
    else
        echo -e "${YELLOW}○${NC} Port $port is available"
    fi
done

echo ""
echo "3️⃣  Checking Services..."
if docker-compose ps > /dev/null 2>&1; then
    docker-compose ps
else
    echo -e "${YELLOW}⚠${NC}  No services running. Use 'docker-compose up -d' to start."
fi

echo ""
echo "4️⃣  Checking Service Health..."
for service in api frontend postgres mongodb redis; do
    if docker-compose ps $service 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $service is running"
    else
        echo -e "${RED}✗${NC} $service is not running"
    fi
done

echo ""
echo "5️⃣  Testing Connectivity..."

# Test API
if curl -s http://localhost:3000/api/v1/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API responding at http://localhost:3000/api/v1"
else
    echo -e "${RED}✗${NC} API not responding at http://localhost:3000/api/v1"
fi

# Test Frontend
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend responding at http://localhost:8080"
else
    echo -e "${RED}✗${NC} Frontend not responding at http://localhost:8080"
fi

echo ""
echo "6️⃣  Recent Logs (last 10 lines)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose logs --tail=10 2>/dev/null || echo "No logs available"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Troubleshooting Tips:"
echo "   - View full logs: docker-compose logs -f [service]"
echo "   - Restart service: docker-compose restart [service]"
echo "   - Rebuild: docker-compose up -d --build"
echo "   - Reset everything: docker-compose down -v && docker-compose up -d"
