import { motion } from 'framer-motion';

function Badge({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    subtle: 'badge-subtle',
  };

  return (
    <motion.span
      className={`${variants[variant]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      {...props}
    >
      {Icon && <Icon size={12} className="mr-1" />}
      {children}
    </motion.span>
  );
}

export default Badge;
