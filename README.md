# Document Management System (DMS)

A full-stack document management system with real-time capabilities built with Next.js, Express.js, MySQL, Redis, and AWS S3.

## Features

- User authentication (JWT-based)
- Document upload to AWS S3 (PDF, DOC, DOCX, TXT, PNG, JPG, JPEG)
- Document management (upload, update, delete, download)
- Real-time documents via Socket.io
- Document categorization and search
- Pagination and filtering
- Redis caching for performance
- Responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Express.js + TypeScript
- MySQL + Prisma ORM
- Redis (caching)
- Socket.io (real-time)
- AWS SDK (S3 storage)
- JWT Authentication
- bcrypt (password hashing)

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Socket.io Client
- Axios

---

## Project Structure

```
dms-project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations (generated)
│   │   └── seed.ts          # Initial data seeder
│   ├── src/
│   │   ├── config/          # Configuration (Redis, Prisma, S3, Socket.io)
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express server entry
│   ├── .env.example         # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client, utilities
│   │   └── types/           # TypeScript types
│   ├── .env.example         # Environment template
│   └── package.json
│
├── docker-compose.yml       # Docker services configuration
└── README.md
```

---

## Environment Variables

### Environment Files Overview

| File | Purpose | Used By |
|------|---------|---------|
| `.env` (root) | Docker Compose MySQL config | `docker-compose.yml` |
| `backend/.env` | Backend configuration | Backend (Docker & local) |
| `frontend/.env` | Frontend configuration | Frontend (Docker & local) |

### Root .env (Docker Compose)

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_DATABASE` | Database name | `dms` |
| `MYSQL_USER` | MySQL user | `dms_user` |
| `MYSQL_PASSWORD` | MySQL password | `your_password` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root_password` |

### Backend .env

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/dms` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJal...` |
| `AWS_S3_BUCKET` | S3 bucket name | `my-dms-bucket` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) |

### Frontend .env

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- Redis 7.0+
- AWS Account (for S3)
- Docker & Docker Compose (optional)

---

### Option 1: Docker Setup (Recommended)

1. **Clone and configure environment:**
   ```bash
   # Copy environment files
   cp .env.example .env                        # Root (for docker-compose MySQL)
   cp backend/.env.example backend/.env        # Backend config
   cp frontend/.env.example frontend/.env      # Frontend config (Docker)

   # Edit backend/.env with your AWS credentials and JWT secret
   ```

2. **Start all services:**
   ```bash
   docker compose build
   docker compose up -d
   ```

3. **Run database migrations and seed:**
   ```bash
   docker compose exec backend npx prisma migrate deploy
   docker compose exec backend npm run prisma:seed
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Adminer (DB GUI): http://localhost:8080

---

## AWS S3 Setup

### 1. Create S3 Bucket

1. Go to AWS Console > S3
2. Click "Create bucket"
3. Enter bucket name (e.g., `my-dms-documents`)
4. Select region (e.g., `us-east-1`)
5. Uncheck "Block all public access" (for direct downloads)
6. Create bucket

### 2. Configure Bucket CORS

Go to bucket > Permissions > CORS and add:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 3. Create IAM User

1. Go to IAM > Users > Create user
2. Enter username (e.g., `dms-s3-user`)
3. Attach policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

4. Create access keys and add to backend `.env`

---

## API Endpoints Documentation

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | `{email, password, firstName, lastName}` |
| POST | `/api/auth/login` | Login user | `{email, password}` |

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "user": { "id": 1, "email": "user@example.com", "firstName": "John", "lastName": "Doe" }
  }
}
```

### Documents (Protected - Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload document (multipart/form-data) |
| GET | `/api/documents` | Get documents (paginated) |
| GET | `/api/documents/:id` | Get document by ID |
| GET | `/api/documents/:id/download` | Get download URL |
| PUT | `/api/documents/:id` | Update document metadata |
| DELETE | `/api/documents/:id` | Delete document |

**Query parameters for GET /api/documents:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category ID
- `search` - Search in document name

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |

---

## Socket.io Events Documentation

### Connection

```javascript
// Client connects with JWT token
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});
```

### Events (Server → Client)

| Event | Description | Payload |
|-------|-------------|---------|
| `document:uploaded` | New document uploaded | `{ documentId, name, category }` |
| `document:updated` | Document metadata updated | `{ documentId, name, category, description }` |
| `document:deleted` | Document deleted | `{ documentId }` |

### Client Usage Example

```javascript
// Listen for real-time updates
socket.on('document:uploaded', (data) => {
  console.log('New document:', data.documentId, data.name);
});

socket.on('document:updated', (data) => {
  console.log('Updated document:', data.documentId, data.name);
});

socket.on('document:deleted', (data) => {
  console.log('Deleted document ID:', data.documentId);
});
```

---

## Testing Instructions

### 1. Authentication Testing

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. File Upload Testing

```bash
# Upload a document (replace TOKEN with your JWT)
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "name=My Document" \
  -F "categoryId=1" \
  -F "description=Test upload"
```

### 3. Document Management Testing

```bash
# Get all documents
curl http://localhost:5000/api/documents \
  -H "Authorization: Bearer TOKEN"

# Get document by ID
curl http://localhost:5000/api/documents/1 \
  -H "Authorization: Bearer TOKEN"

# Update document
curl -X PUT http://localhost:5000/api/documents/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","description":"Updated description"}'

# Delete document
curl -X DELETE http://localhost:5000/api/documents/1 \
  -H "Authorization: Bearer TOKEN"
```

### 4. Redis Caching Testing

1. **View cached data:**
   ```bash
   redis-cli
   KEYS *
   GET documents:user:1:page:1
   ```

2. **Test cache invalidation:**
   - Upload a document
   - Check Redis for cached data
   - Update/delete the document
   - Verify cache is cleared

3. **Test Redis fallback:**
   - Stop Redis: `redis-cli SHUTDOWN`
   - Verify app still works (without caching)
   - Restart Redis: `redis-server`

### 5. Socket.io Real-Time Testing

1. **Open multiple browser tabs/windows**
2. **Login with the same user in all tabs**
3. **In one tab:**
   - Upload a document
   - Edit a document
   - Delete a document
4. **Observe other tabs:**
   - Should see real-time updates without refresh

### 6. Multi-Client Testing

1. Open browser's Developer Tools > Console
2. Observe WebSocket connection messages
3. Test with different browsers simultaneously
4. Verify all clients receive real-time updates

---

## Troubleshooting Guide

### Database Connection Issues

**Error:** `Can't connect to MySQL server`
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1"

# Verify DATABASE_URL format
# mysql://username:password@host:port/database
```

### Redis Connection Issues

**Error:** `Redis connection failed`
```bash
# Check Redis is running
redis-cli ping

# If using Docker
docker compose logs redis

# App works without Redis (graceful fallback)
```

### AWS S3 Issues

**Error:** `Access Denied`
- Verify IAM user has correct permissions
- Check bucket policy allows the operations
- Ensure credentials in .env are correct

**Error:** `Bucket not found`
- Verify bucket name in .env matches exactly
- Check bucket region matches AWS_REGION

### Socket.io Connection Issues

**Error:** `WebSocket connection failed`
- Verify NEXT_PUBLIC_SOCKET_URL is correct
- Check CORS settings in backend
- Ensure JWT token is valid

### File Upload Issues

**Error:** `File too large`
- Check MAX_FILE_SIZE in backend .env
- Verify nginx/proxy settings if behind reverse proxy

**Error:** `Invalid file type`
- Only PDF, DOC, DOCX, TXT, PNG, JPG, JPEG allowed

---

## Scripts Reference

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Deploy migrations |
| `npm run prisma:seed` | Seed initial data |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:setup` | Run migrations + seed |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---