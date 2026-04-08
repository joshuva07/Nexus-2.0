import { motion } from 'framer-motion';

export default function CareerMatchBar({ career, index, onClick }) {
  const score = career.matchScore || 0;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => onClick?.(career)}
      className="glass-card p-4 cursor-pointer hover:border-blue-500/30 transition-all duration-200 group"
      style={{ borderColor: 'var(--border-glass)' }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(59,130,246,0.15)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{career.emoji}</span>
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">{career.title}</p>
            <p className="text-xs text-[var(--text-muted)]">{career.domain} • {career.riskLevel} Risk</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color }}>{score}%</p>
          <p className="text-xs text-[var(--text-muted)]">Match</p>
        </div>
      </div>
      {/* Bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
        />
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {career.matchedSkills?.slice(0, 3).map(s => (
          <span key={s} className="tag text-[10px] py-0.5">{s}</span>
        ))}
        {career.knowledgeGaps?.length > 0 && (
          <span className="text-[10px] text-[var(--text-muted)] self-center ml-1">+{career.knowledgeGaps.length} gaps</span>
        )}
      </div>
    </motion.div>
  );
}
