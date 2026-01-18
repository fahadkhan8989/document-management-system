#!/bin/bash

# Clean up orphan containers and restart services

echo "Cleaning up orphan containers..."
docker compose down --remove-orphans

echo ""
echo "Removing old MongoDB container if it exists..."
docker rm -f dms-mongodb 2>/dev/null || echo "No MongoDB container to remove"

echo ""
echo "Starting services..."
docker compose up -d --build

echo ""
echo "Services started! Checking status..."
docker compose ps

echo ""
echo "To view logs:"
echo "  docker compose logs -f backend"
echo ""
echo "MySQL is now accessible on port 3307 (host) -> 3306 (container)"
echo "Backend connects to mysql:3306 (internal Docker network)"
