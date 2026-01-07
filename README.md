# 🏍️ BikerZone - Motorcycle Community Platform

[![CI/CD](https://github.com/username/bikerzone/workflows/CI%2FCD/badge.svg)](https://github.com/username/bikerzone/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)](https://www.typescriptlang.org/)

BikerZone is a comprehensive mobile and web application for motorcycle enthusiasts, featuring tutorial videos, social feeds, real-time traffic alerts, and garage booking services.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & User Management
- Email/password authentication with JWT
- Refresh token rotation
- Email verification
- Password reset functionality
- User profile management with bike details

### 🎥 Tutorial Videos (Sprint 2)
- Video catalog filtered by motorcycle type
- Categories: Maintenance, Repair, Riding, Accessories
- Video player with quality controls
- Favorites system
- Admin upload with FFmpeg transcoding

### 📱 Social Feed (Sprint 3)
- Infinite scroll feed
- Post creation with images and location
- Like and comment system
- Hashtag support
- Real-time updates via WebSocket

### 🚨 Alerts & Notifications (Sprint 4)
- Geolocated traffic and police alerts
- Community validation system
- Push notifications (FCM)
- Interactive map with markers
- Configurable alert radius

### 🔧 Garage Booking (Sprint 5-6)
- Garage search with filters
- 5-star rating system with reviews
- Online booking with calendar
- Email/SMS confirmation
- Garage partner dashboard

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10 (TypeScript)
- **Databases**: 
  - PostgreSQL 15 (relational data)
  - MongoDB 6 (social data)
  - Redis 7 (cache & sessions)
- **Authentication**: Passport JWT
- **Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Job Queue**: Bull + Redis
- **Email**: Nodemailer + SendGrid
- **File Upload**: Multer + Cloudinary
- **Video Processing**: FFmpeg

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **UI Library**: Vuetify 3
- **Maps**: Leaflet.js + OpenStreetMap
- **Video Player**: Video.js
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Mobile**: Capacitor

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS / GCP
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│            Vue.js 3 + Vuetify 3                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP/WebSocket
                  │
┌─────────────────▼───────────────────────────────┐
│                Nginx (Reverse Proxy)             │
└─────────────────┬───────────────────────────────┘
                  │
                  │
┌─────────────────▼───────────────────────────────┐
│               NestJS Backend API                 │
│    ┌──────────┬──────────┬──────────┐          │
│    │  Auth    │  Videos  │  Social  │          │
│    │  Module  │  Module  │  Module  │          │
│    └──────────┴──────────┴──────────┘          │
│    ┌──────────┬──────────────────────┐          │
│    │  Alerts  │  Booking Module      │          │
│    │  Module  │                       │          │
│    └──────────┴──────────────────────┘          │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
┌───────▼──┐ ┌───▼────┐ ┌─▼──────┐
│PostgreSQL│ │MongoDB │ │ Redis  │
└──────────┘ └────────┘ └────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/bikerzone.git
   cd bikerzone
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api/v1
   - API Documentation: http://localhost:3000/api/docs
   - PgAdmin: http://localhost:5050

### Manual Setup (without Docker)

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
bikerzone/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── videos/
│   │   │   ├── posts/
│   │   │   ├── alerts/
│   │   │   ├── garages/
│   │   │   └── bookings/
│   │   ├── common/
│   │   ├── database/
│   │   └── main.ts
│   ├── test/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── router/
│   │   └── App.vue
│   └── package.json
├── devops/
│   ├── nginx/
│   └── monitoring/
├── docker-compose.yml
└── README.md
```

## 💻 Development

### Backend Commands

```bash
# Development
npm run start:dev

# Build
npm run build

# Tests
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Linting
npm run lint
npm run format
```

### Frontend Commands

```bash
# Development
npm run dev

# Build
npm run build

# Tests
npm run test:unit
npm run test:e2e

# Linting
npm run lint
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test                    # Unit tests
npm run test:e2e               # E2E tests
npm run test:cov               # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test:unit              # Unit tests with Vitest
npm run test:e2e               # E2E tests with Cypress
```

## 📊 Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build images
docker-compose build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale api=3
```

### Manual Deployment
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 📚 API Documentation

API documentation is available via Swagger UI:
- Development: http://localhost:3000/api/docs
- Production: https://api.bikerzone.com/docs

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

#### Videos
- `GET /api/videos` - List videos with filters
- `GET /api/videos/:id` - Get video details
- `POST /api/videos` - Upload video (Admin)

#### Social Feed
- `GET /api/posts` - Get feed
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment

#### Alerts
- `GET /api/alerts` - Get alerts near location
- `POST /api/alerts` - Create alert
- `PATCH /api/alerts/:id/validate` - Validate alert

#### Garages
- `GET /api/garages` - Search garages
- `POST /api/bookings` - Create booking
- `POST /api/reviews` - Add review

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting with Throttler
- CORS configuration
- Helmet security headers
- Input validation with class-validator
- SQL injection prevention (TypeORM)
- XSS protection

## 📈 Performance

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Image optimization with Cloudinary
- Video transcoding for multiple qualities
- Lazy loading and code splitting
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Sprint Planning

The project is organized in 6 sprints (12 weeks):

- **Sprint 1** (18 pts): Authentication & Infrastructure
- **Sprint 2** (21 pts): Tutorial Videos
- **Sprint 3** (21 pts): Social Feed
- **Sprint 4** (29 pts): Alerts & Notifications
- **Sprint 5** (26 pts): Garage Booking Part 1
- **Sprint 6** (21 pts): Garage Booking Part 2 & Polish

**Total: 136 Story Points**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Full-Stack Developer

## 🙏 Acknowledgments

- NestJS community
- Vue.js community
- OpenStreetMap contributors
- All open-source contributors

## 📞 Contact

- Email: contact@bikerzone.com
- Website: https://bikerzone.com
- GitHub: https://github.com/username/bikerzone

---

Made with ❤️ for the motorcycle community
