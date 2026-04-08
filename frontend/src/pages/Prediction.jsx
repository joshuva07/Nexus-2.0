import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertTriangle, CheckCircle, Zap, Brain, Target, BookOpen, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import PageTransition from '../components/UI/PageTransition';
import GlassCard from '../components/Cards/GlassCard';
import GrowthChart from '../components/Charts/GrowthChart';
import { samplePrediction, sampleGrowthData, sampleKnowledgeGaps } from '../data/sampleData';

// Circular gauge
function GaugeRing({ value, size = 140, label, color = '#3b82f6', sublabel }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p className="text-2xl font-display font-bold" style={{ color }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            {value}%
          </motion.p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--text-muted)] mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

// Risk meter
function RiskMeter({ score }) {
  const pct = score;
  const color = score < 25 ? '#10b981' : score < 50 ? '#3b82f6' : score < 75 ? '#f59e0b' : '#ef4444';
  const label = score < 25 ? 'Very Low' : score < 50 ? 'Low' : score < 75 ? 'Medium' : 'High';
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-[var(--text-muted)]">Risk Level</span>
        <span className="font-bold" style={{ color }}>{label} ({score}/100)</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #10b981, #3b82f6, #f59e0b, #ef4444)`, width: '100%', opacity: 0.3 }} />
        <motion.div className="absolute top-0 h-full rounded-full"
          style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
        <span>Safe</span><span>Moderate</span><span>Risky</span>
      </div>
    </div>
  );
}

// Milestone roadmap
function Milestones() {
  const steps = [
    { month: 'Month 1–2', task: 'Close System Design gap', done: false, action: 'Study: System Design Primer' },
    { month: 'Month 3',   task: 'Complete 5 simulations',  done: false, action: 'Practice on Simulation page' },
    { month: 'Month 4–5', task: 'Learn Kubernetes + MLOps', done: false, action: 'Course: CKA + Full Stack MLOps' },
    { month: 'Month 6',   task: 'Build 2 portfolio projects',done: false, action: 'Deploy on GitHub + personal site' },
  ];
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg,#3b82f6,#8b5cf6,transparent)' }} />
      {steps.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
          className="mb-5 relative">
          <div className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-blue-500" style={{ background: 'var(--bg-primary)' }} />
          <p className="text-[10px] text-blue-400 font-semibold mb-0.5">{s.month}</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">{s.task}</p>
          <p className="text-xs text-[var(--text-muted)]">→ {s.action}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Prediction() {
  const { user, toggleChat } = useStore();
  const navigate = useNavigate();
  const pred = samplePrediction;
  const [activeScenario, setActiveScenario] = useState('realistic');

  const scenarios = Object.values(pred.scenarios);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title text-3xl text-[var(--text-primary)] mb-2">
            Future <span className="gradient-text">Prediction Engine</span>
          </h1>
          <p className="text-[var(--text-muted)]">AI-powered career trajectory analysis for {user.name}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Gauges */}
          <div className="space-y-5">
            {/* Main Gauges */}
            <GlassCard className="p-6">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-6 text-center">Current Status</p>
              <div className="flex flex-col items-center gap-8">
                <GaugeRing value={pred.jobReadiness}    label="Job Readiness"    color="#3b82f6" sublabel="↑ 8% vs last month" />
                <GaugeRing value={pred.growthPotential} label="Growth Potential" color="#8b5cf6" sublabel="🟢 Excellent" size={120} />
              </div>
            </GlassCard>

            {/* Risk */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-400" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">Risk Assessment</p>
              </div>
              <RiskMeter score={pred.riskScore} />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span className="text-[var(--text-muted)]">Top Strength: <strong className="text-emerald-400">{pred.topStrength}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle size={12} className="text-amber-400" />
                  <span className="text-[var(--text-muted)]">Top Gap: <strong className="text-amber-400">{pred.topGap}</strong></span>
                </div>
              </div>
            </GlassCard>

            {/* Career level */}
            <GlassCard className="p-5">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Career Positioning</p>
              <div className="space-y-3">
                {[
                  { label: 'Current Level',      value: pred.careerLevel,                color: '#3b82f6' },
                  { label: '6-Month Target',      value: `${pred.sixMonthTarget}% ready`, color: '#8b5cf6' },
                  { label: 'Promotion Chance',    value: `${pred.promotionChance}%`,      color: '#10b981' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Middle: Growth Chart + Scenarios */}
          <div className="space-y-5">
            {/* Scenario Selector */}
            <GlassCard className="p-5">
              <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Growth Trajectory</p>
              <div className="flex gap-2 mb-5">
                {scenarios.map(s => (
                  <button key={s.label} onClick={() => setActiveScenario(s.label.toLowerCase())}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${activeScenario === s.label.toLowerCase() ? 'text-white shadow-lg' : 'border border-[var(--border-glass)] text-[var(--text-muted)] hover:border-blue-500/30'}`}
                    style={activeScenario === s.label.toLowerCase() ? { background: s.color } : {}}>
                    {s.label}
                  </button>
                ))}
              </div>
              <GrowthChart data={sampleGrowthData} />
              <div className="mt-3 p-3 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs text-[var(--text-muted)]">Projected 6-month readiness</p>
                <p className="text-2xl font-display font-bold gradient-text">{pred.scenarios[activeScenario]?.score || 82}%</p>
              </div>
            </GlassCard>

            {/* Knowledge Gaps to Close */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-blue-400" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">Knowledge Gaps to Close</p>
              </div>
              <div className="space-y-4">
                {sampleKnowledgeGaps.map((gap, i) => (
                  <motion.div key={gap.skill} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full`}
                          style={{ background: gap.priority === 'High' ? '#ef4444' : gap.priority === 'Medium' ? '#f59e0b' : '#10b981' }} />
                        <span className="text-xs font-medium text-[var(--text-primary)]">{gap.skill}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-muted)]">{gap.progress}%</span>
                        <span className="tag text-[9px] py-0"
                          style={{ color: gap.priority === 'High' ? '#ef4444' : gap.priority === 'Medium' ? '#f59e0b' : '#10b981' }}>
                          {gap.priority}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: gap.priority === 'High' ? '#3b82f6' : gap.priority === 'Medium' ? '#8b5cf6' : '#10b981' }}
                        initial={{ width: 0 }} animate={{ width: `${gap.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Roadmap + Actions */}
          <div className="space-y-5">
            {/* 6-month roadmap */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={16} className="text-purple-400" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">6-Month Roadmap</p>
              </div>
              <Milestones />
            </GlassCard>

            {/* Resources */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-blue-400" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">Priority Resources</p>
              </div>
              <div className="space-y-2">
                {sampleKnowledgeGaps.slice(0, 3).flatMap(g => g.resources).slice(0, 5).map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">{i + 1}</div>
                    <span className="text-xs text-[var(--text-primary)] flex-1">{r}</span>
                    <ChevronRight size={12} className="text-[var(--text-muted)]" />
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* AI Action */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-blue-400" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">AI Recommendations</p>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Based on your current trajectory, you are on track to reach {pred.sixMonthTarget}% job readiness in 6 months.
                Closing your System Design gap is the single highest-impact action you can take right now.
              </p>
              <div className="space-y-2">
                <button onClick={toggleChat} className="w-full btn-primary py-2.5 text-sm justify-center">
                  <span className="flex items-center gap-2"><Brain size={14}/> Get Personalized Plan</span>
                </button>
                <button onClick={() => navigate('/simulation')} className="w-full btn-secondary py-2.5 text-sm">
                  <Zap size={14}/> Practice Simulation
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
