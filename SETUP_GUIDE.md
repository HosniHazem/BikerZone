# BikerZone - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports available: 3000 (API), 8080 (Frontend), 5433 (PostgreSQL), 27018 (MongoDB), 6380 (Redis)

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api
   docker-compose logs -f frontend
   ```

4. **Access the application:**
   - **Frontend:** http://localhost:8080
   - **API:** http://localhost:3000/api
   - **API Docs (Swagger):** http://localhost:3000/api/docs

### Stopping the Application

```bash
docker-compose down
```

To remove volumes (reset data):
```bash
docker-compose down -v
```

## 📋 What Was Fixed

### Frontend Fixes
1. ✅ Created missing `main.ts` entry point
2. ✅ Created missing `index.html`
3. ✅ Added Vuetify plugin configuration
4. ✅ Created router with authentication guards
5. ✅ Added API service with interceptors
6. ✅ Created authentication service
7. ✅ Added all missing views:
   - HomeView (landing page)
   - RegisterView (user registration)
   - DashboardView (authenticated user dashboard)
   - ProfileView (user profile)
   - NotFoundView (404 page)
8. ✅ Created SCSS styles
9. ✅ Added TypeScript configuration files
10. ✅ Created `.env` file

### Backend Fixes
1. ✅ Created posts module and controller
2. ✅ Created `.env` file with all required variables
3. ✅ Fixed environment variable configuration

### Docker Fixes
1. ✅ Fixed frontend Dockerfile port configuration
2. ✅ Ensured proper health checks for all services
3. ✅ Configured proper service dependencies

## 🏗️ Project Structure

```
bikerzone/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/      # Authentication
│   │   │   ├── users/     # User management
│   │   │   ├── posts/     # Social posts
│   │   │   ├── upload/    # File uploads
│   │   │   └── mail/      # Email service
│   │   ├── common/        # Shared utilities
│   │   ├── database/      # Database config
│   │   ├── redis/         # Redis config
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── plugins/       # Vue plugins
│   │   ├── router/        # Vue Router
│   │   ├── services/      # API services
│   │   ├── stores/        # Pinia stores
│   │   ├── views/         # Page components
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── .env
└── docker-compose.yml
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `NODE_ENV`: Application environment
- `PORT`: API port (3000)
- `DATABASE_*`: PostgreSQL configuration
- `MONGODB_URI`: MongoDB connection string
- `REDIS_*`: Redis configuration
- `JWT_*`: JWT token configuration
- `SENDGRID_API_KEY`: Email service (optional)
- `CLOUDINARY_*`: Image hosting (optional)

#### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket URL
- `VITE_GOOGLE_MAPS_KEY`: Google Maps (optional)

## 🐛 Troubleshooting

### Issue: Services not starting
```bash
# Check service logs
docker-compose logs api
docker-compose logs frontend

# Restart specific service
docker-compose restart api
```

### Issue: Port already in use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Kill the process or change ports in docker-compose.yml
```

### Issue: Database connection failed
```bash
# Wait for database health check
docker-compose ps

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
```

### Issue: Frontend not loading
1. Check if the API is running: http://localhost:3000/api
2. Check frontend logs: `docker-compose logs frontend`
3. Verify VITE_API_URL in frontend/.env

### Issue: Cannot install dependencies
```bash
# Clear npm cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Default Credentials

The application uses:
- **PostgreSQL:** bikerzone / biker_secure_2024
- **MongoDB:** bikerzone / mongo_secure_2024
- **Redis:** redis_secure_2024

## 🔐 Features

- ✅ User Authentication (JWT)
- ✅ User Registration & Login
- ✅ Protected Routes
- ✅ Dashboard
- ✅ User Profile
- ✅ Responsive Design (Vuetify)
- ✅ API Documentation (Swagger)
- ✅ PostgreSQL Database
- ✅ MongoDB Database
- ✅ Redis Caching
- ✅ Docker Containerization

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Next Steps

1. **Test the application:**
   - Visit http://localhost:8080
   - Register a new account
   - Login and explore the dashboard

2. **Develop new features:**
   - Add more modules (bookings, garages, alerts)
   - Implement social features
   - Add real-time notifications

3. **Production deployment:**
   - Update environment variables
   - Configure SSL/TLS
   - Set up proper database backups
   - Configure monitoring and logging

## 📞 Support

If you encounter any issues:
1. Check the logs: `docker-compose logs -f`
2. Restart services: `docker-compose restart`
3. Rebuild if needed: `docker-compose up -d --build`

## 🎉 Success!

Your BikerZone application should now be running at:
- **Frontend:** http://localhost:8080
- **API:** http://localhost:3000/api
- **API Docs:** http://localhost:3000/api/docs

Happy coding! 🏍️
