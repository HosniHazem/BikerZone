#!/bin/bash

# BikerZone Backend Test Script
# This script tests all major API endpoints

BASE_URL="http://localhost:3000/api/v1"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 BikerZone Backend API Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed (200)${NC}"
else
    echo -e "${RED}✗ Health check failed ($response)${NC}"
    exit 1
fi
echo ""

# Test 2: Basic API endpoint
echo -e "${BLUE}Test 2: Basic API Endpoint${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ Basic API endpoint passed (200)${NC}"
else
    echo -e "${RED}✗ Basic API endpoint failed ($response)${NC}"
fi
echo ""

# Test 3: Swagger Documentation
echo -e "${BLUE}Test 3: Swagger Documentation${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/docs-json)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ Swagger docs accessible (200)${NC}"
else
    echo -e "${RED}✗ Swagger docs failed ($response)${NC}"
fi
echo ""

# Generate random test data
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@bikerzone.test"
TEST_PASSWORD="TestPass123!"
TEST_NAME="Test User $TIMESTAMP"

# Test 4: User Registration
echo -e "${BLUE}Test 4: User Registration${NC}"
echo "Email: $TEST_EMAIL"
register_response=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\"
  }" \
  -w "\n%{http_code}")

status_code=$(echo "$register_response" | tail -n 1)
body=$(echo "$register_response" | sed '$d')

if [ "$status_code" -eq 201 ]; then
    echo -e "${GREEN}✓ Registration successful (201)${NC}"
    echo "Response: $body" | head -c 100
    echo "..."
elif [ "$status_code" -eq 409 ]; then
    echo -e "${YELLOW}⚠ User already exists (409) - This is OK${NC}"
else
    echo -e "${RED}✗ Registration failed ($status_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 5: User Login
echo -e "${BLUE}Test 5: User Login${NC}"
login_response=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" \
  -w "\n%{http_code}")

status_code=$(echo "$login_response" | tail -n 1)
body=$(echo "$login_response" | sed '$d')

if [ "$status_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Login successful (200)${NC}"
    ACCESS_TOKEN=$(echo "$body" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$ACCESS_TOKEN" ]; then
        echo -e "${GREEN}✓ Access token received${NC}"
        echo "Token: ${ACCESS_TOKEN:0:20}..."
    else
        echo -e "${RED}✗ No access token in response${NC}"
    fi
else
    echo -e "${RED}✗ Login failed ($status_code)${NC}"
    echo "Response: $body"
    ACCESS_TOKEN=""
fi
echo ""

# Test 6: Get Current User (Protected Endpoint)
if [ ! -z "$ACCESS_TOKEN" ]; then
    echo -e "${BLUE}Test 6: Get Current User (Protected)${NC}"
    me_response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auth/me \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if [ "$me_response" -eq 200 ]; then
        echo -e "${GREEN}✓ Protected endpoint accessible (200)${NC}"
    else
        echo -e "${RED}✗ Protected endpoint failed ($me_response)${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⚠ Skipping protected endpoint test (no token)${NC}"
    echo ""
fi

# Test 7: Database Connections
echo -e "${BLUE}Test 7: Database Connectivity${NC}"

# Check MongoDB
echo -n "MongoDB: "
docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" mongodb://bikerzone:mongo_secure_2024@localhost:27017/admin 2>/dev/null | grep -q "ok" && echo -e "${GREEN}✓ Connected${NC}" || echo -e "${RED}✗ Failed${NC}"

# Check PostgreSQL
echo -n "PostgreSQL: "
docker-compose exec -T postgres pg_isready -U bikerzone 2>/dev/null | grep -q "accepting connections" && echo -e "${GREEN}✓ Connected${NC}" || echo -e "${RED}✗ Failed${NC}"

# Check Redis
echo -n "Redis: "
docker-compose exec -T redis redis-cli -a redis_secure_2024 ping 2>/dev/null | grep -q "PONG" && echo -e "${GREEN}✓ Connected${NC}" || echo -e "${RED}✗ Failed${NC}"

echo ""

# Test 8: CORS Configuration
echo -e "${BLUE}Test 8: CORS Configuration${NC}"
cors_response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS $BASE_URL/health)

if [ "$cors_response" -eq 200 ] || [ "$cors_response" -eq 204 ]; then
    echo -e "${GREEN}✓ CORS configured correctly${NC}"
else
    echo -e "${YELLOW}⚠ CORS response: $cors_response${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Test Suite Complete!${NC}"
echo ""
echo "API Documentation: http://localhost:3000/api/docs"
echo "Frontend: http://localhost:8080"
echo ""
echo "🔍 Quick Commands:"
echo "  - View logs: docker-compose logs -f api"
echo "  - Restart API: docker-compose restart api"
echo "  - Check status: docker-compose ps"
