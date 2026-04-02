import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = React.forwardRef(({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    outline: 'border border-white/20 text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
