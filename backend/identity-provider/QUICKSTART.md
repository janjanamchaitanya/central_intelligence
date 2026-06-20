# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker Compose (Recommended)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services (PostgreSQL, Redis, Kafka)
npm run docker:up

# 3. Wait for services to be ready (30 seconds)
sleep 30

# 4. Run database migrations
npm run db:migrate

# 5. Start the application in development mode
npm run start:dev
```

Visit: http://localhost:3000/api/v1
Swagger Docs: http://localhost:3000/api/docs

### Option 2: Local Development

**Prerequisites:**
- PostgreSQL running on localhost:5432
- Redis running on localhost:6379
- (Optional) Kafka on localhost:9092

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your local database credentials

# 3. Run migrations
npm run db:migrate

# 4. Start development server
npm run start:dev
```

## 📋 Verify Installation

### Check Services Health

```bash
# PostgreSQL
psql -U postgres -h localhost -c "SELECT version();"

# Redis
redis-cli ping
# Should return: PONG

# Kafka (if running)
docker exec -it identity-provider-kafka kafka-topics --list --bootstrap-server localhost:9092

# Application
curl http://localhost:3000/api/v1/health
```

## 🧪 Test the API

### Create a User (Example)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

### Check Logs

```bash
# Application logs (inside container)
docker-compose logs -f app

# Log files (if running locally)
tail -f logs/application-$(date +%Y-%m-%d).log
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Error

```bash
# Check Redis
docker-compose ps redis

# Test Redis connection
redis-cli ping

# Restart Redis
docker-compose restart redis
```

### Kafka Issues

```bash
# Restart Kafka and Zookeeper
docker-compose restart kafka zookeeper

# Check Kafka logs
docker-compose logs kafka
```

## 🛑 Stop Services

```bash
# Stop all Docker services
npm run docker:down

# Stop with volume cleanup
docker-compose down -v
```

## 📦 Production Build

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

## 🔐 Important Notes

1. **Change default passwords** in `.env` before deploying
2. **Generate strong secrets** for JWT_SECRET and SESSION_SECRET
3. **Enable SSL** for PostgreSQL in production
4. **Configure CORS** properly for your frontend domain
5. **Set proper LOG_LEVEL** (use 'info' or 'warn' in production)

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the API at http://localhost:3000/api/docs
- Check out the architecture diagram in the README
- Review design patterns implemented

## 💡 Development Tips

```bash
# Watch mode (auto-reload on file changes)
npm run start:dev

# Debug mode
npm run start:debug

# View Docker logs
npm run docker:logs

# Access PostgreSQL CLI
docker exec -it identity-provider-db psql -U postgres identity_provider

# Access Redis CLI
docker exec -it identity-provider-redis redis-cli

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback
```

## 🎯 Common Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server with watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run docker:up` | Start all Docker services |
| `npm run docker:down` | Stop all Docker services |
| `npm run db:migrate` | Run database migrations |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

Happy coding! 🎉
