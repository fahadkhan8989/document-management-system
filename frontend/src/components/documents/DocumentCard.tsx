'use client';

import { Document as DocType } from '@/types';
import { formatFileSize, formatDate, getFileIcon } from '@/lib/utils';
import { MoreHorizontal, Download, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { documentApi } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';

interface DocumentCardProps {
  document: DocType;
  onEdit: (document: DocType) => void;
  onDelete: (id: number) => void;
}

export const DocumentCard = ({ document, onEdit, onDelete }: DocumentCardProps) => {
  const [downloading, setDownloading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setShowMenu(false);
      const response = await documentApi.downloadDocument(document.id);
      window.open(response.downloadUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getCategoryStyle = () => {
    const color = document.category?.color || '#64748b';
    return {
      backgroundColor: `${color}12`,
      color: color,
    };
  };

  return (
    <div className="group card-interactive p-5">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* File Icon */}
        <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-gray-100 transition-colors">
          {getFileIcon(document.fileType)}
        </div>

        {/* Title & Category */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate mb-1.5 group-hover:text-primary-600 transition-colors">
            {document.name}
          </h3>
          <span
            className="badge text-xs"
            style={getCategoryStyle()}
          >
            {document.category?.name || 'Uncategorized'}
          </span>
        </div>

        {/* More Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1"
          >
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-10 animate-scale-in origin-top-right">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Download size={16} className="text-gray-400" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
              <div className="h-px bg-gray-100 my-1.5" />
              <button
                onClick={() => { onEdit(document); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={16} className="text-gray-400" />
                Edit details
              </button>
              <button
                onClick={() => { onDelete(document.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {document.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {document.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>{formatFileSize(document.fileSize)}</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{formatDate(document.uploadedAt)}</span>
      </div>
    </div>
  );
};
