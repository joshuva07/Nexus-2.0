import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useStore from './store/useStore';

import Navbar        from './components/Layout/Navbar';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';
import Landing       from './pages/Landing';
import Dashboard     from './pages/Dashboard';
import Career        from './pages/Career';
import Simulation    from './pages/Simulation';
import Prediction    from './pages/Prediction';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Landing    />} />
        <Route path="/dashboard"  element={<Dashboard  />} />
        <Route path="/career"     element={<Career     />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { isDark } = useStore();

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <AppRoutes />
        <ChatbotWidget />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
