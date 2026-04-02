import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export const Modal = React.forwardRef(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className,
  ...props
}, ref) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'glass-dark rounded-2xl border border-white/20 w-full',
              sizes[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                {title && (
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';
