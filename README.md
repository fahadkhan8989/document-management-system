# Document Management System (DMS)

A full-stack document management system with real-time capabilities built with Next.js, Express.js, MongoDB, Redis, and AWS S3.

## Features

- User authentication (JWT-based)
- Document upload to AWS S3 (PDF, DOC, DOCX, TXT, PNG, JPG, JPEG)
- Document management (upload, view, update, delete)
- Real-time notifications via Socket.io
- Document categorization and search
- Pagination and filtering
- Redis caching for performance
- Responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Express.js
- TypeScript
- MongoDB + Mongoose
- Redis
- Socket.io
- AWS SDK (S3)
- JWT Authentication
- bcrypt

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- Axios

## Project Structure

```
dms-project/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/            # Next.js app directory
    │   ├── components/     # React components
    │   ├── context/        # React context
    │   ├── hooks/          # Custom hooks
    │   ├── lib/            # Utilities and API client
    │   └── types/          # TypeScript types
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Redis (local or cloud)
- AWS Account (for S3)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb://localhost:27017/dms

REDIS_URL=redis://localhost:6379

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=xi-hawk-doc

MAX_FILE_SIZE=10485760
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents (Protected)

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents (with pagination, search, filter)
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document

## Socket.io Events

### Server to Client

- `document:uploaded` - Emitted when a document is uploaded
- `document:updated` - Emitted when a document is updated
- `document:deleted` - Emitted when a document is deleted

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG

## Caching Strategy

- Document list cache TTL: 5 minutes
- Individual document cache TTL: 10 minutes
- Cache invalidation on CRUD operations

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- File type validation
- File size limits
- CORS configuration

## Development

### Backend

```bash
cd backend
npm run dev    # Development mode with nodemon
npm run build  # Build TypeScript
npm start      # Production mode
```

### Frontend

```bash
cd frontend
npm run dev    # Development mode
npm run build  # Production build
npm start      # Production mode
```

## AWS S3 Setup

1. Create an S3 bucket in your AWS account
2. Create an IAM user with S3 permissions
3. Generate access keys for the IAM user
4. Configure the credentials in backend `.env` file

Required IAM permissions:
- `s3:PutObject`
- `s3:GetObject`
- `s3:DeleteObject`

## MongoDB Setup

### Local MongoDB
```bash
mongod --dbpath /path/to/data
```

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas
2. Get the connection string
3. Update `MONGODB_URI` in `.env`

## Redis Setup

### Local Redis
```bash
redis-server
```

### Cloud Redis
Use services like Redis Cloud, AWS ElastiCache, or DigitalOcean Managed Redis

## Production Deployment

### Backend
- Deploy to AWS EC2, DigitalOcean, or Heroku
- Set up environment variables
- Use PM2 for process management
- Enable HTTPS

### Frontend
- Deploy to Vercel, Netlify, or AWS Amplify
- Configure environment variables
- Set up custom domain

## License

MIT
