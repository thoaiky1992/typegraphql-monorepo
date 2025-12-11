# TypeGraphQL Federation Monorepo

GraphQL Federation monorepo với TypeGraphQL, Apollo Gateway và các microservices.

## 📁 Cấu Trúc Monorepo

```
typegraphql/
├── packages/
│   ├── shared/              # @repo/shared - Shared libraries & utilities
│   ├── service-user/        # @repo/service-user - User microservice
│   ├── service-product/     # @repo/service-product - Product microservice
│   ├── service-gateway/     # @repo/service-gateway - Apollo Gateway
│   └── prisma/              # @repo/prisma - Database schema & client
├── graphql/                 # GraphQL schemas (introspected)
├── docker-compose.yml       # Docker services (Postgres, Redis, RabbitMQ)
└── package.json             # Root workspace config
```

## 🚀 Cài Đặt

```bash
# Clone repository
git clone <repository-url>
cd typegraphql

# Install dependencies (cài cho tất cả packages)
npm install

# Setup environment
cp .env.example .env

# Start Docker services
docker-compose up -d

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## 📦 Packages

### @repo/shared
Shared code cho tất cả services:
- Libraries (cache, logger, saga, rabbitmq, etc.)
- Helpers & utilities
- Types & interfaces
- Validation schemas

### @repo/service-user
User microservice - Port 4000
- User CRUD operations
- File upload
- Authentication

### @repo/service-product
Product microservice - Port 4001
- Product CRUD operations
- Saga workflows

### @repo/service-gateway
Apollo Federation Gateway - Port 3000
- Routes requests to appropriate services
- Schema composition
- File upload proxy

### @repo/prisma
Database layer:
- Prisma schema
- Migrations
- Seed data

## 🛠️ Development Commands

### Start All Services
```bash
# Start all microservices concurrently
npm run dev

# Start individual services
npm run dev:user
npm run dev:product
npm run dev:gateway
```

### Database Commands
```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:db:push     # Push schema to database
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio
```

### GraphQL Introspection
```bash
npm run introspect:user     # Introspect user service
npm run introspect:product  # Introspect product service
npm run introspect:compose  # Compose supergraph schema
```

### Code Quality
```bash
npm run lint               # Lint all packages
npm run lint:fix           # Fix linting errors
npm run prettier           # Check formatting
npm run prettier:fix       # Fix formatting
```

### Build
```bash
npm run build              # Build all packages
npm run clean              # Clean all build artifacts
```

## 🌐 Services URLs

- **Gateway**: http://localhost:3000/graphql
- **User Service**: http://localhost:4000/graphql
- **Product Service**: http://localhost:4001/graphql
- **Prisma Studio**: http://localhost:5555

## 📝 Environment Variables

```env
# Ports
APOLO_SERVICE_USER_PORT=4000
APOLO_SERVICE_PRODUCT_PORT=4001
APOLO_SERVICE_GATEWAY_PORT=3000

# Service URLs
APOLO_SERVICE_USER_URL=http://localhost:4000/graphql
APOLO_SERVICE_PRODUCT_URL=http://localhost:4001/graphql

# Database
POSTGRES_DB=typegraphql
POSTGRES_USER=thoaiky1992
POSTGRES_PASSWORD=thoaiky1992
POSTGRES_DB_PORT=5432
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_DB_PORT}/${POSTGRES_DB}

# Redis
REDIS_PASSWORD=thoaiky1992

# RabbitMQ
RABBITMQ_USER=thoaiky1992
RABBITMQ_PASS=thoaiky1992
```

## 🔧 Tech Stack

- **TypeScript** - Programming language
- **TypeGraphQL** - GraphQL schema-first approach
- **Apollo Federation** - Distributed GraphQL architecture
- **Prisma** - Database ORM
- **Express** - HTTP server
- **PostgreSQL** - Database
- **Redis** - Caching
- **RabbitMQ** - Message queue
- **BullMQ** - Job queue
- **Docker** - Containerization

## 📚 Architecture

### Monorepo Benefits
- ✅ Shared code across services
- ✅ Consistent dependencies
- ✅ Single source of truth
- ✅ Simplified development workflow
- ✅ Atomic commits across packages

### GraphQL Federation
- Gateway routes queries to appropriate services
- Each service owns its domain
- Type references allow cross-service queries
- Independent deployment

## 🧪 Testing File Upload

```graphql
mutation UploadFile($files: [Upload!]!) {
  uploadFile(files: $files)
}
```

## 📖 Documentation

- [TypeGraphQL](https://typegraphql.com/)
- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [Prisma](https://www.prisma.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC
