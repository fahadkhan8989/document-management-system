import { ReactNode } from 'react';
import { FileText, FolderOpen, Search, Upload } from 'lucide-react';

type IconType = 'documents' | 'folder' | 'search' | 'upload';

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const icons: Record<IconType, ReactNode> = {
  documents: <FileText className="w-10 h-10 text-gray-400" strokeWidth={1.5} />,
  folder: <FolderOpen className="w-10 h-10 text-gray-400" strokeWidth={1.5} />,
  search: <Search className="w-10 h-10 text-gray-400" strokeWidth={1.5} />,
  upload: <Upload className="w-10 h-10 text-gray-400" strokeWidth={1.5} />,
};

export const EmptyState = ({
  icon = 'documents',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-xs mb-5 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
