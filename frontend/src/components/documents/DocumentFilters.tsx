'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { categoryApi } from '@/lib/api';
import { Category } from '@/types';

interface DocumentFiltersProps {
  onFilterChange: (filters: { category?: number; search?: string }) => void;
}

export const DocumentFilters = ({ onFilterChange }: DocumentFiltersProps) => {
  const [category, setCategory] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    const numValue = value === '' ? '' : parseInt(value);
    setCategory(numValue);
    onFilterChange({ category: numValue || undefined, search: search || undefined });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ category: category || undefined, search: value || undefined });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="flex-1 relative min-w-[70%]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-300"
        />
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="form-select min-w-[160px]"
        disabled={loading}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};
