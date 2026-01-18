'use client';

import { useState, useEffect } from 'react';
import { Document, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { categoryApi } from '@/lib/api';

interface DocumentEditProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, data: any) => Promise<void>;
}

export const DocumentEdit = ({ document, isOpen, onClose, onUpdate }: DocumentEditProps) => {
  const [name, setName] = useState(document?.name || '');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState(document?.description || '');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      setName(document.name || '');
      setDescription(document.description || '');
      // Set categoryId from document.category if it's an object with id, otherwise use the string
      if (document.category && typeof document.category === 'object' && 'id' in document.category) {
        setCategoryId((document.category as any).id);
      } else if (document.categoryId) {
        setCategoryId(document.categoryId);
      }
      loadCategories();
    }
  }, [isOpen, document]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryApi.getAll();
      setCategories(response.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setLoading(true);
    try {
      await onUpdate(document.id, { name, categoryId, description });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!document) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Document Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {loadingCategories ? (
            <div className="text-sm text-gray-500">Loading categories...</div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={loading || loadingCategories}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
