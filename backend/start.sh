#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until nc -z mysql 3306; do
  sleep 1
done
echo "MySQL is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init 2>&1 || echo "Migrations may already be applied or failed (this is OK if tables exist)"

# Start the application
echo "Starting the application..."
exec npm run dev
