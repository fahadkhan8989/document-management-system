FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and config files
COPY prisma ./prisma
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Copy and make startup script executable
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

# Expose port
EXPOSE 5000

# Start the application with migration script
CMD ["./start.sh"]
