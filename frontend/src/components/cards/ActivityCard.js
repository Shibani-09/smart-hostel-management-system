import { motion } from 'framer-motion';

function ActivityCard({
  title,
  description,
  timestamp,
  status = 'pending',
  icon: Icon,
  action,
  className = '',
}) {
  const statusColors = {
    pending: 'bg-warning-500/10 text-warning-300 border-warning-500/30',
    completed: 'bg-success-500/10 text-success-300 border-success-500/30',
    rejected: 'bg-error-500/10 text-error-300 border-error-500/30',
    approved: 'bg-success-500/10 text-success-300 border-success-500/30',
  };

  return (
    <motion.div
      className={`
        bg-slate-800/30 border border-slate-700/50 rounded-lg p-4
        hover:bg-slate-800/50 transition-all duration-200
        ${className}
      `}
      whileHover={{ x: 4 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-700/50 text-slate-400 flex-shrink-0">
            <Icon size={18} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-slate-200 text-sm">{title}</h4>
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">{timestamp}</p>
            {action && <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">{action}</button>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ActivityCard;
