import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) => {
  const variants = {
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: <Info className="w-5 h-5 text-primary-500" />,
    },
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: <CheckCircle className="w-5 h-5 text-success-500" />,
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: <AlertCircle className="w-5 h-5 text-warning-500" />,
    },
    error: {
      container: 'bg-danger-50 border-danger-200 text-danger-800',
      icon: <XCircle className="w-5 h-5 text-danger-500" />,
    },
  };

  const { container, icon } = variants[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg animate-fade-in ${container} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
