'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentEdit } from '@/components/documents/DocumentEdit';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Document } from '@/types';
import { LogOut, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { getSocket } from '@/lib/socket';

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ category?: number; search?: string }>({});
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const { documents, loading, pagination, uploadDocument, updateDocument, deleteDocument } =
    useDocuments({ page, limit: 9, ...filters });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      setIsOnline(socket.connected);

      socket.on('connect', () => {
        setIsOnline(true);
      });

      socket.on('disconnect', () => {
        setIsOnline(false);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, []);

  const handleUpload = async (formData: FormData) => {
    await uploadDocument(formData);
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: number, data: any) => {
    await updateDocument(id, data);
    setIsEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
    }
  };

  const handleFilterChange = (newFilters: { category?: number; search?: string }) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gray-100">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">DocManager</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-500 hidden sm:block">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* User info */}
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="btn-icon text-gray-500 hover:text-gray-700"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="page-container py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
            <p className="text-gray-500 mt-1">
              {pagination.total} {pagination.total === 1 ? 'file' : 'files'} stored
            </p>
          </div>
          <DocumentUpload onUpload={handleUpload} />
        </div>

        {/* Filters */}
        <DocumentFilters onFilterChange={handleFilterChange} />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded-lg" />
                  <div className="h-3 bg-gray-100 rounded-lg w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon="upload"
            title="No documents yet"
            description="Upload your first document to get started. We support PDF, Word, images, and text files."
            action={<DocumentUpload onUpload={handleUpload} />}
            className="py-16"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {documents.map((document, index) => (
                <div
                  key={document.id}
                  className="animate-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DocumentCard
                    document={document}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} />
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === i + 1
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      <DocumentEdit
        document={editingDocument}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingDocument(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
