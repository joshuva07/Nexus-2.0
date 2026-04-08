import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, BookOpen, Zap, AlertCircle, CheckCircle, Brain, BarChart2, DollarSign, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import PageTransition from '../components/UI/PageTransition';
import GlassCard from '../components/Cards/GlassCard';
import CareerMatchBar from '../components/Charts/CareerMatchBar';
import { matchCareers, allSkills, domains } from '../data/careerData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Step indicator
function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: i === current ? 24 : 8, background: i <= current ? 'linear-gradient(90deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.15)' }} />
      ))}
    </div>
  );
}

// Salary comparison chart
function SalaryChart({ careers }) {
  const data = careers.slice(0, 5).map(c => ({
    name: c.title.split(' ').slice(0, 2).join(' '),
    avg: Math.round(c.salaryRange.avg / 1000),
    min: Math.round(c.salaryRange.min / 1000),
    max: Math.round(c.salaryRange.max / 1000),
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} unit="K" />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 12, fontSize: 11 }}
          formatter={(v) => [`$${v}K`]}
        />
        <Bar dataKey="avg" name="Avg Salary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Skill tag selector
function SkillSelector({ selected, onToggle }) {
  const [search, setSearch] = useState('');
  const filtered = allSkills.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-3">
      <input value={search} onChange={e => setSearch(e.target.value)}
        className="nexus-input text-sm" placeholder="Search skills..." />
      <div className="max-h-48 overflow-y-auto scroll-panel flex flex-wrap gap-2">
        {filtered.map(skill => {
          const active = selected.includes(skill);
          return (
            <button key={skill} onClick={() => onToggle(skill)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border border-transparent'
                  : 'border border-[var(--border-glass)] text-[var(--text-muted)] hover:border-blue-500/40 hover:text-blue-400'
              }`}>
              {active && <span className="mr-1">✓</span>}{skill}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-blue-400">{selected.length} skill{selected.length > 1 ? 's' : ''} selected</p>
      )}
    </div>
  );
}

export default function Career() {
  const { user, setCareerResults, toggleChat } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=form, 1=results
  const [formStep, setFormStep] = useState(0); // 0-2 wizard steps
  const [skills, setSkills] = useState(user.skills || []);
  const [domain, setDomain] = useState('All');
  const [level, setLevel] = useState('Intermediate');
  const [interests, setInterests] = useState('');
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const analyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const matches = matchCareers(skills, domain, interests);
    setResults(matches);
    setCareerResults(matches);
    setStep(1);
    setLoading(false);
  };

  const FORM_STEPS = [
    { title: 'Your Skills', subtitle: 'Select all skills you currently have' },
    { title: 'Preferences', subtitle: 'Tell us more about your goals' },
    { title: 'Ready to Analyze', subtitle: 'Review your inputs' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-3xl text-[var(--text-primary)] mb-2">
            Career <span className="gradient-text">Intelligence Engine</span>
          </h1>
          <p className="text-[var(--text-muted)]">AI-powered matching to discover your ideal career path with full analysis</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
              <GlassCard className="p-8">
                {/* Wizard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Step {formStep + 1} of 3</p>
                    <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">{FORM_STEPS[formStep].title}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{FORM_STEPS[formStep].subtitle}</p>
                  </div>
                  <StepDots current={formStep} total={3} />
                </div>

                <AnimatePresence mode="wait">
                  {formStep === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <SkillSelector selected={skills} onToggle={toggleSkill} />
                    </motion.div>
                  )}
                  {formStep === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-5">
                      <div>
                        <label className="text-xs text-[var(--text-muted)] font-medium mb-2 block">Domain</label>
                        <div className="flex flex-wrap gap-2">
                          {domains.map(d => (
                            <button key={d} onClick={() => setDomain(d)}
                              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${domain === d ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'border border-[var(--border-glass)] text-[var(--text-muted)] hover:border-blue-500/40'}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] font-medium mb-2 block">Experience Level</label>
                        <div className="flex gap-2">
                          {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                            <button key={l} onClick={() => setLevel(l)}
                              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${level === l ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'border border-[var(--border-glass)] text-[var(--text-muted)] hover:border-blue-500/40'}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)] font-medium mb-2 block">Interests & Goals (optional)</label>
                        <textarea value={interests} onChange={e => setInterests(e.target.value)}
                          className="nexus-input resize-none text-sm" rows={3}
                          placeholder="e.g. I love building AI products, I want high salary, I prefer remote work..." />
                      </div>
                    </motion.div>
                  )}
                  {formStep === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-4">
                      <div className="glass-card p-4 space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Skills Selected</span><span className="font-semibold text-[var(--text-primary)]">{skills.length}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Domain</span><span className="font-semibold text-[var(--text-primary)]">{domain}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Level</span><span className="font-semibold text-[var(--text-primary)]">{level}</span></div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 8).map(s => <span key={s} className="tag text-[10px]">{s}</span>)}
                        {skills.length > 8 && <span className="tag text-[10px]">+{skills.length - 8}</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  {formStep > 0 && (
                    <button onClick={() => setFormStep(p => p - 1)} className="btn-secondary flex-1 py-3 text-sm">Back</button>
                  )}
                  {formStep < 2
                    ? <button onClick={() => setFormStep(p => p + 1)} className="btn-primary flex-1 py-3 text-sm justify-center"><span className="flex items-center gap-2">Next <ChevronRight size={14}/></span></button>
                    : <button onClick={analyze} disabled={loading} className="btn-primary flex-1 py-3 text-sm justify-center">
                        <span className="flex items-center gap-2">
                          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Analyzing...</> : <><Zap size={14}/> Analyze with AI</>}
                        </span>
                      </button>
                  }
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Results */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Left: Career list */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Career Matches</h2>
                    <button onClick={() => { setStep(0); setFormStep(0); setSelected(null); }} className="text-xs text-blue-400 hover:text-blue-300">Refine →</button>
                  </div>
                  {results?.map((career, i) => (
                    <CareerMatchBar key={career.id} career={career} index={i} onClick={setSelected} />
                  ))}
                </div>

                {/* Right: Detail panel */}
                <div className="lg:col-span-3 space-y-5">
                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                        {/* Career Header */}
                        <GlassCard className="p-6">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl">{selected.emoji}</span>
                            <div className="flex-1">
                              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">{selected.title}</h2>
                              <p className="text-[var(--text-muted)] text-sm mt-1">{selected.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="tag">📈 {selected.demandScore}/100 Demand</span>
                                <span className="tag">💰 ${(selected.salaryRange.avg/1000).toFixed(0)}K Avg</span>
                                <span className="tag">🚀 {selected.growthRate}% Growth</span>
                                <span className="tag" style={{ color: selected.riskLevel === 'Low' ? '#10b981' : '#f59e0b' }}>
                                  {selected.riskLevel === 'Low' ? '🟢' : '🟡'} {selected.riskLevel} Risk
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-display font-bold gradient-text">{selected.matchScore}%</div>
                              <div className="text-xs text-[var(--text-muted)]">Match Score</div>
                            </div>
                          </div>

                          {/* Match bar */}
                          <div className="mt-5">
                            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                              <span>Overall Match</span><span className="font-semibold text-blue-400">{selected.matchScore}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }}
                                initial={{ width: 0 }} animate={{ width: `${selected.matchScore}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-5">
                            <button onClick={() => navigate('/simulation')} className="btn-primary flex-1 py-2.5 text-sm justify-center">
                              <span className="flex items-center gap-2">🎮 Simulate Role</span>
                            </button>
                            <button onClick={toggleChat} className="btn-secondary flex-1 py-2.5 text-sm">
                              <Brain size={14}/> Ask AI
                            </button>
                          </div>
                        </GlassCard>

                        {/* Salary Chart */}
                        <GlassCard className="p-5">
                          <p className="font-semibold text-sm text-[var(--text-primary)] mb-4">Salary Comparison</p>
                          <SalaryChart careers={results || []} />
                        </GlassCard>

                        {/* Knowledge Gaps */}
                        <GlassCard className="p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={16} className="text-amber-400" />
                            <p className="font-semibold text-sm text-[var(--text-primary)]">Knowledge Gaps ({selected.knowledgeGaps?.length})</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selected.knowledgeGaps?.map(g => (
                              <span key={g} className="px-3 py-1.5 rounded-full text-xs border border-amber-500/30 text-amber-400 bg-amber-500/10">{g}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle size={14} className="text-emerald-400" />
                            <p className="text-xs text-[var(--text-muted)] font-medium">Matched Skills</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.matchedSkills?.map(s => (
                              <span key={s} className="px-3 py-1.5 rounded-full text-xs border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">{s}</span>
                            ))}
                          </div>
                        </GlassCard>

                        {/* Courses */}
                        <GlassCard className="p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={16} className="text-blue-400" />
                            <p className="font-semibold text-sm text-[var(--text-primary)]">Top Courses</p>
                          </div>
                          <div className="space-y-3">
                            {selected.topCourses.map((course, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer glass-card glass-card-hover">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">{i + 1}</div>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-[var(--text-primary)]">{course.name}</p>
                                  <p className="text-[10px] text-[var(--text-muted)]">{course.provider} • ⭐ {course.rating}</p>
                                </div>
                                <ChevronRight size={12} className="text-[var(--text-muted)]" />
                              </motion.div>
                            ))}
                          </div>
                        </GlassCard>

                        {/* Future Scope */}
                        <GlassCard className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-purple-400" />
                            <p className="font-semibold text-sm text-[var(--text-primary)]">Future Scope</p>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{selected.futureScope}</p>
                        </GlassCard>
                      </motion.div>
                    ) : (
                      <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                          <Search size={28} className="text-blue-400" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">Select a Career</h3>
                        <p className="text-[var(--text-muted)] text-sm">Click any career match on the left to see detailed analysis, salary data, knowledge gaps, and course recommendations.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
