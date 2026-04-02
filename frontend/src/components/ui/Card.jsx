import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(({
  children,
  className,
  hover = true,
  glass = false,
  padding = 'default',
  ...props
}, ref) => {
  const paddingVariants = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        glass 
          ? 'glass-dark border border-white/10' 
          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
        hover && 'hover:shadow-xl hover:scale-[1.02]',
        paddingVariants[padding],
        className
      )}
      whileHover={hover ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('mb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold text-gray-900 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-gray-600 dark:text-gray-400 mt-1',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';
