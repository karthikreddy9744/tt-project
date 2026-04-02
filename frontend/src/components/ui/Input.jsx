import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  label,
  icon,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-2xl border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800 px-4 py-2',
            'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  className,
  error,
  label,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'block w-full rounded-2xl border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 px-4 py-2',
          'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200 resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
