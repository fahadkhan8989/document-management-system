import { useState, useEffect } from 'react';
import { Document, DocumentQueryParams } from '@/types';
import { documentApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export const useDocuments = (params?: DocumentQueryParams) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentApi.getDocuments(params);
      setDocuments(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    const socket = getSocket();
    if (socket) {
      socket.on('document:uploaded', () => {
        fetchDocuments();
      });

      socket.on('document:updated', () => {
        fetchDocuments();
      });

      socket.on('document:deleted', () => {
        fetchDocuments();
      });

      return () => {
        socket.off('document:uploaded');
        socket.off('document:updated');
        socket.off('document:deleted');
      };
    }
  }, [params?.page, params?.limit, params?.category, params?.search]);

  const uploadDocument = async (formData: FormData) => {
    await documentApi.upload(formData);
    // Socket event will trigger refetch
  };

  const updateDocument = async (id: number, data: any) => {
    await documentApi.updateDocument(id, data);
    // Socket event will trigger refetch
  };

  const deleteDocument = async (id: number) => {
    await documentApi.deleteDocument(id);
    // Socket event will trigger refetch
  };

  return {
    documents,
    loading,
    error,
    pagination,
    uploadDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
};
