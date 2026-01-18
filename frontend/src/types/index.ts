export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Document {
  id: number;
  userId: number;
  categoryId?: number;
  name: string;
  description?: string;
  category: Category;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}
