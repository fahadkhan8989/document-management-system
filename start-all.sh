#!/bin/bash

# Start all DMS services with a single command
# This script uses docker-compose to start all services

set -e

echo "=========================================="
echo "  DMS - Document Management System"
echo "  Starting all services..."
echo "=========================================="
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker or docker-compose not found"
    echo "Please install Docker first"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env file with default values..."
    cat > .env << 'EOF'
# JWT Configuration
JWT_SECRET=dev-secret-key-12345-change-in-production

# AWS S3 Configuration (optional for development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=xi-hawk-doc
EOF
    echo "✓ Created .env file"
fi

# Build and start all services
echo "🔨 Building Docker images (this may take a few minutes on first run)..."
docker-compose build

echo ""
echo "🚀 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "  ✅ All services started!"
echo "=========================================="
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop all:     docker-compose down"
echo "   Restart:      docker-compose restart"
echo "   Status:       docker-compose ps"
echo ""
echo "🔍 To view specific service logs:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f mongodb"
echo "   docker-compose logs -f redis"
echo ""
