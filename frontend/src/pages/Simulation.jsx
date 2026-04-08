import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Timer, ChevronRight, Star, Zap, Brain, Trophy, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';
import PageTransition from '../components/UI/PageTransition';
import GlassCard from '../components/Cards/GlassCard';
import { simulationScenarios } from '../data/simulationScenarios';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const DOMAINS = [
  { key: 'Engineering', emoji: '💻', color: '#3b82f6', desc: 'System design, incident response, coding decisions' },
  { key: 'Medical',     emoji: '🏥', color: '#10b981', desc: 'Clinical diagnosis, patient care, emergency response' },
  { key: 'Business',    emoji: '📊', color: '#f59e0b', desc: 'Product decisions, crisis management, strategy' },
  { key: 'Arts',        emoji: '🎨', color: '#ec4899', desc: 'Creative direction, brand management, storytelling' },
];

// Countdown timer
function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const t = setInterval(() => setRemaining(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [remaining, onExpire]);
  const pct = (remaining / seconds) * 100;
  const color = remaining < 30 ? '#ef4444' : remaining < 60 ? '#f59e0b' : '#3b82f6';
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return (
    <div className="flex items-center gap-2">
      <Timer size={14} style={{ color }} />
      <span className="font-mono text-sm font-bold" style={{ color }}>{mm}:{ss}</span>
    </div>
  );
}

// Score Radar for results
function ResultRadar({ scores }) {
  const max = 40; // 4 steps × 10 max each
  const data = [
    { subject: 'Accuracy', A: Math.round((scores.accuracy / max) * 100) },
    { subject: 'Logic',    A: Math.round((scores.logic    / max) * 100) },
    { subject: 'Risk',     A: Math.round((scores.risk     / max) * 100) },
    { subject: 'Speed',    A: Math.round((scores.speed    / max) * 100) },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
        <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default function Simulation() {
  const { activeSimulation, simulationStep, simulationScores, simulationChoices, simulationComplete,
          setActiveSimulation, advanceStep, resetSimulation, addXP } = useStore();
  const [phase, setPhase] = useState('select'); // select | briefing | playing | results
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (simulationComplete && phase === 'playing') {
      setPhase('results');
      addXP(150);
    }
  }, [simulationComplete]);

  const startScenario = (scenario) => {
    setSelectedScenario(scenario);
    setActiveSimulation(scenario);
    setPhase('briefing');
  };

  const handleChoice = (choice) => {
    setLastFeedback(choice.feedback);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      advanceStep(choice);
    }, 1800);
  };

  const currentStep = activeSimulation?.steps?.[simulationStep];

  // Overall score
  const totalScore = simulationComplete
    ? Math.min(Math.round(((simulationScores.accuracy + simulationScores.logic + simulationScores.risk + simulationScores.speed) / 160) * 100), 100)
    : 0;

  const scoreLabel = totalScore >= 85 ? '🏆 Expert' : totalScore >= 70 ? '⭐ Proficient' : totalScore >= 50 ? '📈 Developing' : '📚 Learning';

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="section-title text-3xl text-[var(--text-primary)] mb-2">
            Simulation <span className="gradient-text">Engine</span>
          </h1>
          <p className="text-[var(--text-muted)]">Real-world career scenarios. Make decisions under pressure. Get AI feedback.</p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Domain Select ── */}
          {phase === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                {DOMAINS.map((d) => (
                  <motion.div key={d.key} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDomain(d.key)}
                    className={`glass-card p-6 cursor-pointer transition-all duration-200 ${selectedDomain === d.key ? 'border-blue-500/50 shadow-glow-blue' : 'hover:border-blue-500/20'}`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                        style={{ background: `${d.color}20`, border: `1px solid ${d.color}40` }}>
                        {d.emoji}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{d.key}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{d.desc}</p>
                      </div>
                    </div>
                    {selectedDomain === d.key && simulationScenarios[d.key]?.map((sc) => (
                      <div key={sc.id} className="mt-3 p-3 rounded-xl cursor-pointer"
                        style={{ background: `${d.color}15`, border: `1px solid ${d.color}30` }}
                        onClick={(e) => { e.stopPropagation(); startScenario(sc); }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{sc.title}</p>
                            <p className="text-xs text-[var(--text-muted)]">{sc.difficulty} • {Math.round(sc.timeLimit / 60)}min • {sc.steps.length} decisions</p>
                          </div>
                          <button className="btn-primary text-xs px-3 py-1.5 rounded-lg">
                            <span className="flex items-center gap-1"><Play size={11}/> Start</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-xs text-[var(--text-muted)]">Select a domain above to see available scenarios</p>
            </motion.div>
          )}

          {/* ── Briefing ── */}
          {phase === 'briefing' && selectedScenario && (
            <motion.div key="briefing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto">
              <GlassCard className="p-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6 text-4xl">
                  {DOMAINS.find(d => d.key === selectedScenario.domain)?.emoji}
                </div>
                <span className="tag text-xs mb-3 inline-block">{selectedScenario.domain} • {selectedScenario.difficulty}</span>
                <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">{selectedScenario.title}</h2>
                <p className="text-[var(--text-muted)] leading-relaxed mb-6">{selectedScenario.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Decisions', value: selectedScenario.steps.length },
                    { label: 'Time Limit', value: `${Math.round(selectedScenario.timeLimit / 60)}m` },
                    { label: 'Difficulty', value: selectedScenario.difficulty },
                  ].map(s => (
                    <div key={s.label} className="glass-card p-3 text-center">
                      <p className="font-bold text-lg gradient-text">{s.value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { resetSimulation(); setPhase('select'); }} className="btn-secondary flex-1 py-3">Cancel</button>
                  <button onClick={() => setPhase('playing')} className="btn-primary flex-1 py-3 justify-center">
                    <span className="flex items-center gap-2"><Play size={16}/> Begin Simulation</span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ── Playing ── */}
          {phase === 'playing' && currentStep && (
            <motion.div key={`step-${simulationStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{DOMAINS.find(d => d.key === activeSimulation.domain)?.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">{activeSimulation.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">Decision {simulationStep + 1} of {activeSimulation.steps.length}</p>
                  </div>
                </div>
                <CountdownTimer seconds={activeSimulation.timeLimit} onExpire={() => setTimerExpired(true)} />
              </div>
              {/* Step bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-8">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }}
                  animate={{ width: `${((simulationStep) / activeSimulation.steps.length) * 100}%` }} transition={{ duration: 0.5 }} />
              </div>

              {/* Scene */}
              <GlassCard className="p-8 mb-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Brain size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 font-semibold mb-2">SCENARIO</p>
                    <p className="text-[var(--text-primary)] text-base leading-relaxed">{currentStep.scene}</p>
                  </div>
                </div>

                {/* Feedback overlay */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-xl mb-4"
                      style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <p className="text-xs text-blue-300 font-semibold mb-1">AI Feedback</p>
                      <p className="text-sm text-[var(--text-primary)]">{lastFeedback}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Choices */}
                <div className="space-y-3">
                  {currentStep.choices.map((choice, i) => (
                    <motion.button key={choice.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      onClick={() => !showFeedback && handleChoice(choice)}
                      disabled={showFeedback}
                      whileHover={!showFeedback ? { x: 6 } : {}}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        showFeedback ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50 hover:bg-blue-500/10 cursor-pointer'
                      }`}
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-glass)' }}>
                      <span className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                        {choice.id.toUpperCase()}
                      </span>
                      <span className="text-sm text-[var(--text-primary)]">{choice.text}</span>
                      <ChevronRight size={14} className="text-[var(--text-muted)] ml-auto flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </GlassCard>

              {/* Live scores */}
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(simulationScores).map(([key, val]) => (
                  <div key={key} className="glass-card p-3 text-center">
                    <p className="text-lg font-bold gradient-text">{val}</p>
                    <p className="text-[10px] text-[var(--text-muted)] capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Results ── */}
          {phase === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto">
              <GlassCard className="p-8 text-center mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-4xl shadow-glow-lg">
                  🏆
                </motion.div>
                <p className="text-4xl font-display font-bold gradient-text mb-2">{totalScore}%</p>
                <p className="text-xl text-[var(--text-primary)] mb-1">{scoreLabel}</p>
                <p className="text-sm text-[var(--text-muted)]">{activeSimulation?.title} — Completed</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-yellow-400 text-sm">
                  <Star size={14} fill="currentColor" /> <span className="font-semibold">+150 XP earned</span>
                </div>
              </GlassCard>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                {/* Radar */}
                <GlassCard className="p-5">
                  <p className="font-semibold text-sm text-[var(--text-primary)] mb-2">Performance Breakdown</p>
                  <ResultRadar scores={simulationScores} />
                </GlassCard>

                {/* Score breakdown */}
                <GlassCard className="p-5">
                  <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Score Analysis</p>
                  <div className="space-y-3">
                    {Object.entries(simulationScores).map(([key, val]) => {
                      const pct = Math.min(Math.round((val / 40) * 100), 100);
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="capitalize text-[var(--text-muted)]">{key}</span>
                            <span className="font-semibold" style={{ color: pct >= 70 ? '#10b981' : '#f59e0b' }}>{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 70 ? '#10b981' : '#f59e0b' }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>

              {/* AI Feedback */}
              <GlassCard className="p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-blue-400" />
                  <p className="font-semibold text-sm text-[var(--text-primary)]">AI Mentor Feedback</p>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {totalScore >= 85
                    ? `Outstanding performance! You demonstrated expert-level decision-making with ${totalScore}% accuracy. Your logical reasoning and risk assessment are above average. You are ready for senior-level roles in ${activeSimulation?.domain}.`
                    : totalScore >= 65
                    ? `Solid effort with ${totalScore}% overall score. Your instincts are good but there are areas to sharpen — particularly in speed and risk assessment. Focus on your weak areas with targeted practice.`
                    : `You achieved ${totalScore}%. This simulation revealed important learning opportunities. Don't be discouraged — every expert was once a beginner. Review the decisions you made and practice the weak areas.`}
                </p>
              </GlassCard>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => { resetSimulation(); setPhase('select'); }} className="btn-secondary flex-1 py-3">
                  <RotateCcw size={14}/> Try Again
                </button>
                <button onClick={() => navigate('/prediction')} className="btn-primary flex-1 py-3 justify-center">
                  <span className="flex items-center gap-2"><Zap size={14}/> See Career Prediction</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
