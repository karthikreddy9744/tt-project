import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = React.forwardRef(({
  className,
  variant = 'default',
  ...props
}, ref) => {
  const variantStyles = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-20',
    card: 'h-32 w-full',
    image: 'h-48 w-full',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
    <Skeleton variant="avatar" className="mb-4" />
    <Skeleton variant="title" className="mb-2" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" className="w-1/2" />
  </div>
);

export const ListSkeleton = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton variant="avatar" />
        <div className="flex-1">
          <Skeleton variant="title" className="w-1/3 mb-2" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);
