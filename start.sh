#!/bin/bash

echo "🚀 Starting TypeGraphQL Monorepo..."

# Load environment variables
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Environment variables loaded"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Start Docker services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  npm install
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Start all services
echo "🎯 Starting all microservices..."
npm run dev
