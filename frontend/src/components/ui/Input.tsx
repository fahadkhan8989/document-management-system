import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, size = 'md', leftIcon, rightIcon, className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-4 py-3 text-lg',
    };

    const baseClasses = `
      w-full bg-white border rounded-xl transition-all duration-200
      text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
      ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-gray-200 hover:border-gray-300'}
      ${leftIcon ? 'pl-11' : ''}
      ${rightIcon ? 'pr-11' : ''}
      ${sizeClasses[size]}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={baseClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
