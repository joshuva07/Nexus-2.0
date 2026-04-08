import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, glow = false, onClick, style }) {
  return (
    <motion.div
      onClick={onClick}
      style={style}
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${glow ? 'glow-pulse' : ''} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
