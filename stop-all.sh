#!/bin/bash

# Stop all DMS services

echo "🛑 Stopping all DMS services..."
docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "💡 To remove all data volumes (MongoDB & Redis data):"
echo "   docker-compose down -v"
