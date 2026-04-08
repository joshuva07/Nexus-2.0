import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Brain, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import useStore from '../../store/useStore';

const navLinks = [
  { path: '/',           label: 'Home'       },
  { path: '/dashboard',  label: 'Dashboard'  },
  { path: '/career',     label: 'Career'     },
  { path: '/simulation', label: 'Simulation' },
  { path: '/prediction', label: 'Prediction' },
];

export default function Navbar() {
  const { isDark, toggleTheme, user, toggleChat } = useStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-3 rounded-2xl border-0"
        style={{ background: isDark ? 'rgba(10,11,20,0.85)' : 'rgba(240,244,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-glow-blue transition-all duration-300">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">NEXUS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Chat Button */}
            <button onClick={toggleChat}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200">
              <Brain size={14} />
              <span>AI Mentor</span>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Bell */}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all relative">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 glow-pulse" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-glass)] cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={12} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)]"
              onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[var(--border-glass)] px-6 pb-4">
              <div className="flex flex-col gap-1 pt-3">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
