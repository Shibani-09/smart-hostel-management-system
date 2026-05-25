import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`
                ${sizes[size]}
                w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90
                border border-slate-700/50 rounded-2xl shadow-2xl
                ${className}
              `}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                  <h2 className="text-xl font-bold text-slate-100">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="p-6 border-t border-slate-700/50 flex gap-3 justify-end">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
