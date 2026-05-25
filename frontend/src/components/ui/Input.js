import { motion } from 'framer-motion';

function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <motion.div
      className="space-y-2 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
            <Icon size={18} />
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            input-base
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-error-500 focus:ring-error-500/20' : 'focus:border-primary-500'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </motion.div>
  );
}

export default Input;
