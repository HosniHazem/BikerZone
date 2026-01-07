# BikerZone - Quick Start Guide

Get BikerZone up and running in minutes!

## Prerequisites

- Docker & Docker Compose installed
- Ports available: 3000, 5433, 6380, 8080, 27018
- Git (optional, for cloning)

## Installation Steps

### 1. Extract or Clone the Project
```bash
# If you have the zip file
unzip bikerzone-fixed.zip
cd bikerzone-fixed

# Or clone from repository
git clone <repository-url>
cd bikerzone
```

### 2. Environment Configuration (Optional)

The project comes with pre-configured `.env` files for development. You can use them as-is or customize:

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=bikerzone
DATABASE_PASSWORD=biker_secure_2024
DATABASE_NAME=bikerzone
MONGODB_URI=mongodb://bikerzone:mongo_secure_2024@mongodb:27017/bikerzone_social?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_2024
JWT_SECRET=bikerzone_jwt_secret_key_2024_very_secure
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=bikerzone_refresh_secret_key_2024_very_secure
JWT_REFRESH_EXPIRATION=7d
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
```

### 3. Start the Application
```bash
# Start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### 4. Wait for Services to Initialize
It takes about 30-60 seconds for all services to start and initialize.

Check service health:
```bash
# Check all services are running
docker-compose ps

# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost:8080
```

## Access the Application

### Frontend Application
```
http://localhost:8080
```

### API Documentation (Swagger)
```
http://localhost:3000/api/docs
```

### PgAdmin (Database Management)
```
http://localhost:5050
Email: admin@bikerzone.com
Password: admin123
```

## First Time Setup

### 1. Register a New User
1. Open http://localhost:8080
2. Click "Register" or navigate to the registration page
3. Fill in the form:
   - Name: Your Full Name
   - Email: your@email.com
   - Password: Your secure password (min 6 characters)
   - Bike Type: Choose your motorcycle type (optional)
4. Click "Register"

### 2. Login
1. After registration, you'll be redirected to the login page
2. Enter your email and password
3. Click "Login"

### 3. Explore the Dashboard
After logging in, you'll see:
- Dashboard with statistics
- Create post form
- Posts feed
- Navigation menu

## Using the Application

### Create Your First Post
1. In the Dashboard, find the "Create New Post" card
2. Fill in:
   - **Title**: Your post title
   - **Content**: Your message (use #hashtags for categorization)
   - **Tags**: Add relevant tags (optional)
3. Click "Create Post"
4. Your post will appear in the feed below

### Interact with Posts
- **Like**: Click the heart icon to like/unlike
- **Comment**: Click "View" to see post details and comments
- **Delete**: Click the three dots menu to delete your own posts
- **Edit**: Click the three dots menu to edit your own posts

### Navigation
Use the navigation menu to access:
- **Dashboard**: Main feed and create posts
- **Profile**: View and edit your profile
- **Settings**: Manage your account settings
- **Logout**: Sign out of your account

## API Usage

### Get JWT Token
```bash
# Login to get access token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response includes accessToken
```

### Use Token in Requests
```bash
# Example: Get posts feed
curl -X GET http://localhost:3000/api/v1/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create a Post via API
```bash
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "Hello BikerZone! #introduction",
    "tags": ["introduction", "newbie"]
  }'
```

## Troubleshooting

### Port Already in Use
If you get port conflicts, modify the ports in `docker-compose.yml`:
```yaml
services:
  api:
    ports:
      - "3001:3000"  # Change external port
  frontend:
    ports:
      - "8081:8080"  # Change external port
```

### Services Not Starting
```bash
# Check Docker daemon is running
docker info

# View detailed logs
docker-compose logs api
docker-compose logs frontend

# Restart services
docker-compose restart

# Full restart (if needed)
docker-compose down
docker-compose up -d
```

### Database Connection Issues
```bash
# Check database is healthy
docker-compose exec postgres pg_isready -U bikerzone

# Check MongoDB
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# View database logs
docker-compose logs postgres
docker-compose logs mongodb
```

### API Not Responding
```bash
# Check backend logs
docker-compose logs api

# Restart backend
docker-compose restart api

# Check health endpoint
curl http://localhost:3000/health
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Rebuild if needed
docker-compose up -d --build frontend
```

### Cannot Login
1. Check backend is running: `docker-compose ps`
2. Verify you registered successfully
3. Check email and password are correct
4. Check browser console for errors (F12)
5. Try clearing browser localStorage and cookies

## Stopping the Application

### Graceful Shutdown
```bash
# Stop all services
docker-compose down
```

### Remove All Data (Fresh Start)
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Development Mode

### Backend Development
```bash
# Install dependencies
cd backend
npm install

# Run in development mode (with hot reload)
npm run start:dev

# Run tests
npm run test
```

### Frontend Development
```bash
# Install dependencies
cd frontend
npm install

# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Testing API with Swagger

1. Open http://localhost:3000/api/docs
2. Click "Authorize" button at the top
3. Login via API first to get token, then:
   - Click "Authorize"
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize" then "Close"
4. Now you can test any endpoint directly from the browser

## Common Tasks

### View Running Services
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
```

### Execute Commands in Containers
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U bikerzone -d bikerzone

# Access MongoDB shell
docker-compose exec mongodb mongosh -u bikerzone -p mongo_secure_2024

# Access Redis CLI
docker-compose exec redis redis-cli -a redis_secure_2024
```

### Backup Database
```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U bikerzone bikerzone > backup.sql

# MongoDB backup
docker-compose exec mongodb mongodump --uri="mongodb://bikerzone:mongo_secure_2024@localhost:27017/bikerzone_social?authSource=admin" --out=/tmp/backup
```

## Performance Tips

### For Development
- Use `docker-compose up -d` to run in background
- Monitor resource usage with `docker stats`
- Use volumes for hot reloading during development

### For Production
- Build optimized images
- Use environment-specific configurations
- Enable production mode (NODE_ENV=production)
- Configure proper logging
- Set up monitoring and alerts
- Use CDN for static assets
- Configure database connection pooling

## Next Steps

1. ✅ Complete registration and login
2. ✅ Create your first post
3. ✅ Explore the API documentation
4. 📝 Customize your profile
5. 🔧 Explore the codebase
6. 🚀 Deploy to production (see deployment guide)

## Getting Help

- **Documentation**: See `/FIXES_APPLIED.md` for detailed information
- **API Reference**: http://localhost:3000/api/docs
- **Logs**: `docker-compose logs -f`
- **Health Check**: http://localhost:3000/health

## Resources

- NestJS Documentation: https://docs.nestjs.com
- Vue.js Documentation: https://vuejs.org
- Vuetify Documentation: https://vuetifyjs.com
- TypeORM Documentation: https://typeorm.io
- Mongoose Documentation: https://mongoosejs.com

---

**Happy Coding with BikerZone! 🏍️**
