import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

function Alert({
  type = 'info',
  title,
  message,
  onClose,
  dismissible = true,
  className = '',
}) {
  const icons = {
    error: FiAlertCircle,
    success: FiCheckCircle,
    warning: FiAlertTriangle,
    info: FiInfo,
  };

  const colors = {
    error: 'bg-error-500/10 border border-error-500/30 text-error-300',
    success: 'bg-success-500/10 border border-success-500/30 text-success-300',
    warning: 'bg-warning-500/10 border border-warning-500/30 text-warning-300',
    info: 'bg-info-500/10 border border-info-500/30 text-info-300',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        className={`
          ${colors[type]}
          rounded-lg p-4 flex gap-3
          ${className}
        `}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <p className="font-semibold">{title}</p>}
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {dismissible && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <FiX size={18} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Alert;
