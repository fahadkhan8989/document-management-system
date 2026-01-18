import { Request } from 'express';

export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
  description?: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: number;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
