import { motion } from 'framer-motion';

function Card({
  children,
  variant = 'default',
  interactive = false,
  hover = true,
  className = '',
  onClick,
  ...props
}) {
  const variants = {
    default: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl',
    minimal: 'bg-slate-900/30 border border-slate-800/30 rounded-lg',
    elevated: 'bg-slate-800 border border-slate-700 rounded-xl shadow-2xl',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:border-slate-600/50' : '';
  const interactiveClasses = interactive ? 'cursor-pointer' : '';

  const classes = `
    ${variants[variant]}
    ${hoverClasses}
    ${interactiveClasses}
    ${className}
    transition-all duration-300
    p-6
  `;

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      whileHover={interactive && hover ? { scale: 1.02 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
