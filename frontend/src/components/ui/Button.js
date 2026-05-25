import { motion } from 'framer-motion';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) {
  const baseClass = 'btn-base font-medium transition-all duration-200 active:scale-95';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-50',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 disabled:opacity-50',
    ghost: 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 disabled:opacity-50',
    success: 'bg-success-500 text-white hover:bg-success-600 shadow-lg hover:shadow-success-500/30 disabled:opacity-50',
    danger: 'bg-error-500 text-white hover:bg-error-600 shadow-lg hover:shadow-error-500/30 disabled:opacity-50',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 shadow-lg hover:shadow-warning-500/30 disabled:opacity-50',
    info: 'bg-info-500 text-white hover:bg-info-600 shadow-lg hover:shadow-info-500/30 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2.5 text-base gap-2.5',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-3.5 text-lg gap-3',
  };

  const classes = `
    ${baseClass}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
    rounded-lg
    inline-flex items-center justify-center
  `;

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : size === 'lg' ? 20 : 24} />
      )}
      {!loading && children}
      {loading && <span className="inline-block animate-spin">⏳</span>}
      {Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : size === 'lg' ? 20 : 24} />
      )}
    </>
  );

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
}

export default Button;
