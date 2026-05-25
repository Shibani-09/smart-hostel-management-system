import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function FeatureCard({
  title,
  description,
  icon: Icon,
  path,
  color = 'primary',
  badge,
  className = '',
}) {
  const navigate = useNavigate();

  const colorVariants = {
    primary: 'from-primary-500/10 to-transparent',
    success: 'from-success-500/10 to-transparent',
    warning: 'from-warning-500/10 to-transparent',
    error: 'from-error-500/10 to-transparent',
    info: 'from-info-500/10 to-transparent',
  };

  const borderColor = {
    primary: 'border-primary-500/20',
    success: 'border-success-500/20',
    warning: 'border-warning-500/20',
    error: 'border-error-500/20',
    info: 'border-info-500/20',
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${colorVariants[color]}
        border ${borderColor[color]}
        rounded-xl p-6
        cursor-pointer group
        ${className}
      `}
      onClick={() => path && navigate(path)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]}`} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-${color}-500/20`}>
            {Icon && <Icon size={24} className={`text-${color}-400`} />}
          </div>
          {badge && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-300`}>
              {badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-primary-400 group-hover:gap-3 transition-all">
          View Details
          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export default FeatureCard;
