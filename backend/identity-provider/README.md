# Identity Provider Service

Production-ready Identity Provider microservice built with NestJS, implementing multiple authentication strategies for the Payment Intelligence platform.

## 🏗️ Architecture

### Tech Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **ORM**: Objection.js with Knex
- **Database**: PostgreSQL
- **Cache/Session**: Redis
- **Message Queue**: Apache Kafka
- **Logging**: Winston with Daily Rotate Files
- **API Documentation**: Swagger/OpenAPI

### Design Patterns Implemented
- **Repository Pattern**: Data access abstraction with Objection.js models
- **Factory Pattern**: Configuration factories for different environments
- **Middleware Pattern**: Request context tracking, logging
- **Interceptor Pattern**: Global logging and error handling
- **Observer Pattern**: Event-driven architecture with Kafka
- **Dependency Injection**: NestJS built-in DI container
- **Soft Delete Pattern**: Logical deletion with BaseModel

## 🚀 Features

### Core Features
- ✅ Multiple authentication providers (Password, OTP, Biometric, Face ID, Google, Azure B2C, AWS IAM, Passkey)
- ✅ Request ID and Correlation ID tracking on every request
- ✅ Comprehensive logging with Winston (file rotation, context tracking)
- ✅ Redis-based session management
- ✅ Kafka event-driven architecture for async operations
- ✅ Database migrations with Knex
- ✅ Soft delete support
- ✅ Production-ready security (Helmet, CORS, Rate Limiting)
- ✅ Docker and Docker Compose setup
- ✅ Health checks and graceful shutdown

## 📁 Project Structure

```
identity-provider/
├── src/
│   ├── common/
│   │   ├── constants/          # Application constants
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Auth guards
│   │   ├── interceptors/       # Request/Response interceptors
│   │   ├── middlewares/        # Request context, logging
│   │   ├── pipes/              # Validation pipes
│   │   └── logger/             # Winston logger configuration
│   ├── config/                 # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── kafka.config.ts
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   ├── seeds/              # Database seeds
│   │   └── models/             # Objection.js models
│   ├── events/
│   │   ├── producers/          # Kafka event producers
│   │   ├── consumers/          # Kafka event consumers
│   │   └── kafka.module.ts     # Kafka configuration
│   ├── modules/
│   │   ├── auth/               # Authentication module
│   │   ├── user/               # User management
│   │   ├── session/            # Session management
│   │   └── redis/              # Redis service
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application bootstrap
├── logs/                       # Application logs
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Production Docker image
├── knexfile.ts                 # Knex migration configuration
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js >= 20.x
- PostgreSQL >= 16.x
- Redis >= 7.x
- Kafka >= 3.x (optional, for event-driven features)
- Docker & Docker Compose (for containerized setup)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd backend/identity-provider
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start infrastructure with Docker:**
   ```bash
   npm run docker:up
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server:**
   ```bash
   npm run start:dev
   ```

## 🐳 Docker Setup

### Development with Docker Compose
```bash
# Start all services (PostgreSQL, Redis, Kafka, Zookeeper, Application)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Production Docker Build
```bash
# Build image
docker build -t identity-provider:latest .

# Run container
docker run -p 3000:3000 --env-file .env identity-provider:latest
```

## 📊 Database

### Migrations
```bash
# Create new migration
npm run db:migrate:make migration_name

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback
```

### Models
All models extend `BaseModel` which provides:
- Automatic timestamps (`createdAt`, `updatedAt`)
- Soft delete support (`deletedAt`)
- Query builder extensions for soft deletes

## 🔐 Authentication Providers

The service supports multiple authentication adapters:

1. **Password** - Traditional username/password
2. **OTP** - One-time password via SMS/Email
3. **Biometric** - Fingerprint authentication
4. **Face ID** - Facial recognition
5. **Google OAuth** - Social login
6. **Azure B2C** - Enterprise SSO
7. **AWS IAM** - AWS identity integration
8. **Passkey** - WebAuthn/FIDO2

## 📡 Request Tracking

Every request automatically includes:
- **Request ID** (`x-request-id`): Unique identifier for each request
- **Correlation ID** (`x-correlation-id`): Tracks related requests across services
- Both IDs are included in all logs and events

### Example
```typescript
// Automatically added to request headers
x-request-id: 550e8400-e29b-41d4-a716-446655440000
x-correlation-id: 123e4567-e89b-12d3-a456-426614174000
```

## 📝 Logging

Winston logger with daily file rotation:

### Log Files
- `logs/application-{DATE}.log` - All logs
- `logs/error-{DATE}.log` - Error logs only
- `logs/exceptions-{DATE}.log` - Uncaught exceptions
- `logs/rejections-{DATE}.log` - Unhandled promise rejections

### Log Format
```
2025-06-14 12:34:56 INFO [requestId][correlationId]: Message { "context": "data" }
```

## 🎯 Event-Driven Architecture

### Kafka Events
Supported event topics:
- `user.created`
- `user.updated`
- `user.deleted`
- `user.login`
- `user.logout`
- `session.created`
- `session.expired`
- `auth.failed`
- `password.reset`
- `two_factor.enabled`
- `two_factor.disabled`

### Publishing Events
```typescript
await eventProducer.publishUserLoginEvent(userId, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
});
```

## 💾 Redis Session Management

```typescript
// Set session
await redisService.setSession(sessionId, userData, 3600);

// Get session
const session = await redisService.getSession(sessionId);

// Delete session
await redisService.deleteSession(sessionId);
```

## 🔍 API Documentation

Swagger documentation available at: `http://localhost:3000/api/docs`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 🌍 Environment Variables

Key environment variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=identity_provider

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=identity-provider
KAFKA_GROUP_ID=identity-provider-group

# Security
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

## 🛡️ Security Features

- Helmet.js for HTTP security headers
- CORS configuration
- Rate limiting (Redis-based)
- Input validation with class-validator
- SQL injection protection (Objection.js parameterized queries)
- Soft delete (no hard deletes)
- Session management with Redis
- Password hashing with bcrypt

## 📈 Monitoring & Health Checks

Health check endpoint: `GET /api/v1/health`

Docker health check automatically configured.

## 🤝 Contributing

1. Follow NestJS design patterns
2. Use Objection.js models for database operations
3. Add request context to all async operations
4. Publish events for significant state changes
5. Write comprehensive logs
6. Update documentation

## 📄 License

ISC

## 👥 Authors

Payment Intelligence Team
