import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, Zap, Award, BookOpen, ChevronDown, ChevronUp, Target, DollarSign, BarChart2, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import PageTransition from '../components/UI/PageTransition';
import GlassCard from '../components/Cards/GlassCard';
import SkillRadar from '../components/Charts/SkillRadar';
import GrowthChart from '../components/Charts/GrowthChart';
import { sampleUser, sampleRadarData, sampleGrowthData, sampleSimulationHistory, activityFeed } from '../data/sampleData';
import { careers } from '../data/careerData';

// Circular progress ring
function ScoreRing({ value, size = 120, stroke = 10, color = '#3b82f6', label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }} />
      </svg>
      <div className="text-center -mt-2">
        <p className="text-2xl font-display font-bold" style={{ color }}>{value}%</p>
        {label && <p className="text-xs text-[var(--text-muted)]">{label}</p>}
      </div>
    </div>
  );
}

// Career Intelligence Card (expandable)
function CIPCard({ career, index }) {
  const [expanded, setExpanded] = useState(false);
  const { isDark } = useStore();
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
      className="glass-card overflow-hidden">
      <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(v => !v)}>
        <span className="text-2xl">{career.emoji}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-[var(--text-primary)]">{career.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><DollarSign size={10}/>${(career.salaryRange.avg/1000).toFixed(0)}K avg</span>
            <span className="text-xs flex items-center gap-1" style={{ color: career.demandScore > 90 ? '#10b981' : '#f59e0b' }}>
              <BarChart2 size={10}/> {career.demandScore}/100 demand
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ width: `${career.demandScore}%`, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
          </div>
          {expanded ? <ChevronUp size={14} className="text-[var(--text-muted)]" /> : <ChevronDown size={14} className="text-[var(--text-muted)]" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[var(--border-glass)] px-4 pb-4 overflow-hidden">
            <div className="pt-3 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="glass-card p-2 text-center">
                  <p className="text-xs text-[var(--text-muted)]">Min</p>
                  <p className="font-bold text-sm text-blue-400">${(career.salaryRange.min/1000).toFixed(0)}K</p>
                </div>
                <div className="glass-card p-2 text-center">
                  <p className="text-xs text-[var(--text-muted)]">Avg</p>
                  <p className="font-bold text-sm gradient-text">${(career.salaryRange.avg/1000).toFixed(0)}K</p>
                </div>
                <div className="glass-card p-2 text-center">
                  <p className="text-xs text-[var(--text-muted)]">Max</p>
                  <p className="font-bold text-sm text-purple-400">${(career.salaryRange.max/1000).toFixed(0)}K</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">Top Roles</p>
                <div className="flex flex-wrap gap-1">
                  {career.jobRoles.slice(0, 3).map(r => <span key={r} className="tag text-[10px]">{r}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">Top Course</p>
                <div className="glass-card p-2 flex items-center gap-2">
                  <BookOpen size={12} className="text-blue-400 flex-shrink-0" />
                  <span className="text-xs text-[var(--text-primary)]">{career.topCourses[0].name}</span>
                  <span className="text-[10px] text-[var(--text-muted)] ml-auto">{career.topCourses[0].provider}</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{career.futureScope}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, toggleChat } = useStore();
  const navigate = useNavigate();
  const topCareers = careers.slice(0, 3);
  const xpPercent = Math.round((user.xp / user.nextLevelXp) * 100);

  const stats = [
    { icon: Target,     label: 'Job Readiness',    value: '82%',        color: '#3b82f6', sub: '↑ 8% this month'  },
    { icon: TrendingUp, label: 'Growth Potential',  value: '91/100',     color: '#8b5cf6', sub: '🟢 Excellent'      },
    { icon: Award,      label: 'Simulations Done',  value: '3',          color: '#10b981', sub: 'Avg score: 84%'   },
    { icon: Zap,        label: 'XP Points',         value: user.xp.toLocaleString(), color: '#f59e0b', sub: `${xpPercent}% to next level` },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[var(--text-muted)] text-sm mb-1">Good morning ⚡</p>
              <h1 className="section-title text-3xl text-[var(--text-primary)]">Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleChat} className="btn-secondary text-sm py-2 px-4">
                <Brain size={15} /> Ask AI Mentor
              </button>
              <button onClick={() => navigate('/career')} className="btn-primary text-sm py-2 px-4">
                <span className="flex items-center gap-2"><Target size={15}/> Explore Careers</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{s.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
              <p className="text-[11px] mt-1" style={{ color: s.color }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Column: Profile + Radar */}
          <div className="space-y-5">
            {/* Profile Card */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{user.careerGoal}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="tag text-[10px]">{user.level}</span>
                    <span className="tag text-[10px]">{user.domain}</span>
                  </div>
                </div>
              </div>
              {/* XP Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>XP Progress</span><span>{user.xp} / {user.nextLevelXp}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }}
                    initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>
              {/* Skills */}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(s => <span key={s} className="tag text-[10px]">{s}</span>)}
                </div>
              </div>
              {/* Badges */}
              <div className="mt-4">
                <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map(b => (
                    <span key={b} className="text-sm glass-card px-2 py-1 rounded-lg text-[11px]">{b}</span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Skill Radar */}
            <GlassCard className="p-5">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Skill Profile</p>
              <SkillRadar data={sampleRadarData} />
            </GlassCard>
          </div>

          {/* Middle Column: Growth + Simulations */}
          <div className="space-y-5">
            {/* Growth Chart */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-[var(--text-primary)]">Career Growth</p>
                <span className="tag text-[10px]">6-month trend</span>
              </div>
              <GrowthChart data={sampleGrowthData} />
            </GlassCard>

            {/* Score Rings */}
            <GlassCard className="p-5">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-5">Performance Overview</p>
              <div className="flex justify-around">
                <ScoreRing value={82} label="Job Readiness" color="#3b82f6" />
                <ScoreRing value={91} label="Growth Potential" color="#8b5cf6" size={100} stroke={8} />
                <ScoreRing value={74} label="Skill Score" color="#10b981" size={90} stroke={7} />
              </div>
            </GlassCard>

            {/* Simulation History */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-[var(--text-primary)]">Recent Simulations</p>
                <button onClick={() => navigate('/simulation')} className="text-xs text-blue-400 hover:text-blue-300">View all</button>
              </div>
              <div className="space-y-3">
                {sampleSimulationHistory.map((sim) => (
                  <div key={sim.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(59,130,246,0.15)' }}>🎮</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{sim.scenario}</p>
                      <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                        {sim.domain} • <Clock size={9}/> {sim.time}
                      </p>
                    </div>
                    <div className="text-sm font-bold" style={{ color: sim.score >= 80 ? '#10b981' : '#f59e0b' }}>{sim.score}%</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Career Intelligence Panel + Activity */}
          <div className="space-y-5">
            {/* Career Intelligence Panel */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain size={14} className="text-purple-400" />
                </div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">Career Intelligence Panel</p>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">Top matches based on your profile — tap to expand</p>
              <div className="space-y-3">
                {topCareers.map((career, i) => <CIPCard key={career.id} career={career} index={i} />)}
              </div>
              <button onClick={() => navigate('/career')} className="w-full mt-4 btn-primary py-2.5 text-sm justify-center">
                <span className="flex items-center gap-2"><Target size={14}/> Full Career Analysis</span>
              </button>
            </GlassCard>

            {/* Activity */}
            <GlassCard className="p-5">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Recent Activity</p>
              <div className="space-y-3">
                {activityFeed.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${item.color}20` }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text-primary)] leading-snug">{item.text}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
