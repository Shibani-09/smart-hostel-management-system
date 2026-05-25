import { motion } from 'framer-motion';

function StatCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  trendUp = true,
  subtitle,
  className = '',
}) {
  const colorVariants = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    success: 'from-success-500/20 to-success-600/10 border-success-500/30',
    warning: 'from-warning-500/20 to-warning-600/10 border-warning-500/30',
    error: 'from-error-500/20 to-error-600/10 border-error-500/30',
    info: 'from-info-500/20 to-info-600/10 border-info-500/30',
  };

  const textColor = {
    primary: 'text-primary-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    error: 'text-error-400',
    info: 'text-info-400',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br ${colorVariants[color]}
        border rounded-xl p-6
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <motion.h3
            className="text-3xl font-bold text-slate-100 mt-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {value}
          </motion.h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? 'text-success-400' : 'text-error-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <motion.div
            className={`${textColor[color]} opacity-20`}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Icon size={32} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
