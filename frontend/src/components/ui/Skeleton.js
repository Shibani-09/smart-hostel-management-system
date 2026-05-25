import { motion } from 'framer-motion';

function Skeleton({
  width = 'w-full',
  height = 'h-4',
  count = 1,
  circle = false,
  className = '',
}) {
  const skeleton = (
    <motion.div
      className={`
        ${width}
        ${height}
        ${circle ? 'rounded-full' : 'rounded-lg'}
        bg-slate-700/30
        ${className}
      `}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{skeleton}</div>
        ))}
      </div>
    );
  }

  return skeleton;
}

export default Skeleton;
