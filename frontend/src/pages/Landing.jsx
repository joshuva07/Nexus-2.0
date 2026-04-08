import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, ChevronRight, Play, Star, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import PageTransition from '../components/UI/PageTransition';

const features = [
  { icon: Brain,    color: '#3b82f6', title: 'AI Career Mentor',      desc: 'Context-aware chatbot that understands your goals and guides every step of your journey.' },
  { icon: Target,   color: '#8b5cf6', title: 'Career Matching',        desc: 'AI-powered engine that scores and ranks careers based on your unique skill profile.' },
  { icon: Play,     color: '#10b981', title: 'Job Simulations',        desc: 'Real-world scenarios that test your decisions under pressure — like a career flight simulator.' },
  { icon: Zap,      color: '#f59e0b', title: 'Skill Gap Detector',     desc: 'Instantly identify missing skills and get a personalized roadmap to close every gap.' },
  { icon: TrendingUp,color:'#ec4899', title: 'Future Prediction',      desc: 'AI engine predicts your job readiness, growth potential, and salary trajectory.' },
  { icon: Star,     color: '#06b6d4', title: 'Career Intelligence',    desc: 'Dynamic panel with top courses, salary data, demand scores, and future scope per role.' },
];

const stats = [
  { value: '50K+',  label: 'Active Users'     },
  { value: '95%',   label: 'Match Accuracy'   },
  { value: '200+',  label: 'Career Paths'     },
  { value: '4.9★',  label: 'User Rating'      },
];

// Typewriter hook
function useTypewriter(words, speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    const delay = deleting ? speed / 2 : speed;
    const timeout = setTimeout(() => {
      if (!deleting && charIndex < word.length) {
        setDisplayed(word.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      } else if (!deleting && charIndex === word.length) {
        setTimeout(() => setDeleting(true), pause);
      } else if (deleting && charIndex > 0) {
        setDisplayed(word.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      } else {
        setDeleting(false);
        setWordIndex(i => i + 1);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

export default function Landing() {
  const { isDark, toggleChat } = useStore();
  const typed = useTypewriter(['Software Engineer', 'AI/ML Engineer', 'Product Manager', 'Data Scientist', 'Cloud Architect', 'UX Designer']);

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

        {/* Animated background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div className="orb w-[600px] h-[600px] bg-blue-600 -top-40 -left-40"
            animate={{ x: [0, 30, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="orb w-[500px] h-[500px] bg-purple-600 top-1/3 -right-32"
            animate={{ x: [0, -30, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
          <motion.div className="orb w-[300px] h-[300px] bg-cyan-600 bottom-20 left-1/4"
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-28">

          {/* Hero */}
          <section className="max-w-6xl mx-auto px-6 text-center pt-16 pb-24">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
              <Sparkles size={14} className="text-yellow-400" />
              Powered by Advanced AI Intelligence
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(59,130,246,0.3)' }}>NEW</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="section-title text-5xl md:text-7xl mb-6 leading-tight">
              <span className="gradient-text-animated">NEXUS</span><br />
              <span className="text-[var(--text-primary)]">Your Intelligence</span><br />
              <span className="text-[var(--text-primary)]">Operating System</span>
            </motion.h1>

            {/* Typewriter sub */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xl text-[var(--text-muted)] mb-4 max-w-2xl mx-auto">
              Discover your path to becoming a world-class
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-3xl font-display font-bold mb-10 h-12 flex items-center justify-center">
              <span className="gradient-text typing-cursor">{typed}</span>
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link to="/dashboard">
                <button className="btn-primary text-base px-8 py-4 rounded-2xl">
                  <span className="flex items-center gap-2">
                    <Zap size={18} /> Start Your Journey <ArrowRight size={16} />
                  </span>
                </button>
              </Link>
              <button onClick={toggleChat} className="btn-secondary text-base px-8 py-4 rounded-2xl">
                <Brain size={18} /> Talk to AI Mentor
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + i * 0.1 }}
                  className="glass-card p-4 text-center">
                  <p className="text-2xl font-display font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Features Grid */}
          <section className="max-w-6xl mx-auto px-6 pb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-12">
              <h2 className="section-title text-4xl mb-4 text-[var(--text-primary)]">
                Everything you need to <span className="gradient-text">master your career</span>
              </h2>
              <p className="text-[var(--text-muted)] max-w-xl mx-auto">Six powerful AI modules working in harmony to give you a complete career intelligence platform.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card glass-card-hover p-6 group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">{f.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ChevronRight size={12} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <section className="max-w-6xl mx-auto px-6 pb-24">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))' }} />
              <div className="relative z-10">
                <h2 className="section-title text-4xl mb-4 gradient-text">Ready to unlock your potential?</h2>
                <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">Join 50,000+ professionals who use NEXUS to navigate their career with AI-powered intelligence.</p>
                <Link to="/career">
                  <button className="btn-primary px-10 py-4 text-base rounded-2xl">
                    <span className="flex items-center gap-2">Get Started Free <ArrowRight size={16} /></span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="border-t border-[var(--border-glass)] py-8 text-center text-[var(--text-muted)] text-sm">
            <p className="gradient-text font-display font-bold text-lg mb-1">NEXUS</p>
            <p>© 2026 NEXUS AI. Human Intelligence Operating System.</p>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}

function Sparkles({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm0 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}
