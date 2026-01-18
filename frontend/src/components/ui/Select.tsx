import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, size = 'md', loading, className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-3 py-2',
      lg: 'px-4 py-3 text-lg',
    };

    const baseClasses = `
      w-full border rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : 'border-gray-300'}
      ${sizeClasses[size]}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={baseClasses}
            disabled={loading || props.disabled}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {loading && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
