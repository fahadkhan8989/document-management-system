#!/bin/bash

# Setup script for DMS project services
# This script helps set up MongoDB and Redis for local development

echo "=== DMS Project Services Setup ==="
echo ""

# Check if running with sudo
if [ "$EUID" -eq 0 ]; then
    echo "Please do not run this script as root/sudo"
    echo "Run it as your regular user - it will prompt for sudo when needed"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker
if command_exists docker; then
    echo "✓ Docker is installed"

    # Check if user is in docker group
    if groups | grep -q docker; then
        echo "✓ User is in docker group"
        USE_DOCKER=true
    else
        echo "⚠ User is not in docker group"
        echo "  To add user to docker group, run:"
        echo "  sudo usermod -aG docker $USER"
        echo "  Then log out and log back in"
        USE_DOCKER=false
    fi
else
    echo "⚠ Docker is not installed"
    USE_DOCKER=false
fi

echo ""

# Option 1: Docker (recommended)
if [ "$USE_DOCKER" = true ]; then
    echo "Starting services with Docker..."

    # Check if MongoDB container exists
    if docker ps -a | grep -q dms-mongodb; then
        echo "MongoDB container exists, starting it..."
        docker start dms-mongodb
    else
        echo "Creating MongoDB container..."
        docker run -d --name dms-mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=dms mongo:7.0
    fi

    # Check Redis
    if pgrep -x redis-server > /dev/null; then
        echo "✓ Redis is already running locally"
    else
        # Check if Redis container exists
        if docker ps -a | grep -q dms-redis; then
            echo "Redis container exists, starting it..."
            docker start dms-redis
        else
            echo "Creating Redis container..."
            docker run -d --name dms-redis -p 6379:6379 redis:7-alpine
        fi
    fi

    echo ""
    echo "✓ Services started successfully!"
    echo ""
    echo "To check status:"
    echo "  docker ps | grep dms-"
    echo ""
    echo "To stop services:"
    echo "  docker stop dms-mongodb dms-redis"

# Option 2: Local installation
else
    echo "Docker not available. Install MongoDB and Redis locally:"
    echo ""
    echo "=== Ubuntu/Debian ==="
    echo "# Install MongoDB:"
    echo "wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -"
    echo "echo \"deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse\" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list"
    echo "sudo apt-get update"
    echo "sudo apt-get install -y mongodb-org"
    echo "sudo systemctl start mongod"
    echo "sudo systemctl enable mongod"
    echo ""
    echo "# Install Redis:"
    echo "sudo apt-get install -y redis-server"
    echo "sudo systemctl start redis-server"
    echo "sudo systemctl enable redis-server"
    echo ""
    echo "=== Or use Docker ==="
    echo "1. Install Docker:"
    echo "   curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "   sudo sh get-docker.sh"
    echo "   sudo usermod -aG docker $USER"
    echo "   # Log out and log back in"
    echo ""
    echo "2. Re-run this script"
fi

echo ""
echo "After services are running, start the application:"
echo "  cd backend && npm run dev"
echo "  cd frontend && npm run dev"
