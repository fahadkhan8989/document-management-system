import axios from 'axios';
import { ApiResponse, AuthResponse, Document, PaginatedResponse, DocumentQueryParams } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data!;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data.data!;
  },
};

export const documentApi = {
  upload: async (formData: FormData): Promise<Document> => {
    const response = await apiClient.post<ApiResponse<Document>>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  getDocuments: async (params?: DocumentQueryParams): Promise<PaginatedResponse<Document>> => {
    const response = await apiClient.get<PaginatedResponse<Document>>('/api/documents', { params });
    return response.data;
  },

  getDocumentById: async (id: number): Promise<Document> => {
    const response = await apiClient.get<ApiResponse<Document>>(`/api/documents/${id}`);
    return response.data.data!;
  },

  updateDocument: async (
    id: number,
    data: { name?: string; categoryId?: number; description?: string }
  ): Promise<Document> => {
    const response = await apiClient.put<ApiResponse<Document>>(`/api/documents/${id}`, data);
    return response.data.data!;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/documents/${id}`);
  },

  downloadDocument: async (id: number): Promise<{ downloadUrl: string }> => {
    const response = await apiClient.get<ApiResponse<{ downloadUrl: string }>>(`/api/documents/${id}/download`);
    return response.data.data!;
  },
};

export const categoryApi = {
  getAll: async (): Promise<{ categories: Array<{ id: number; name: string; color?: string }> }> => {
    const response = await apiClient.get<ApiResponse<{ categories: Array<{ id: number; name: string; color?: string }> }>>('/api/categories');
    return response.data.data!;
  },

  create: async (data: { name: string; color?: string }): Promise<{ id: number; name: string; color?: string }> => {
    const response = await apiClient.post<ApiResponse<{ id: number; name: string; color?: string }>>('/api/categories', data);
    return response.data.data!;
  },
};
