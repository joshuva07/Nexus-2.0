import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleUser } from '../data/sampleData';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────────────────
      isDark: true,
      toggleTheme: () => set(s => ({ isDark: !s.isDark })),

      // ── User ───────────────────────────────────────────────────
      user: sampleUser,
      setUser: (user) => set({ user }),
      updateSkills: (skills) => set(s => ({ user: { ...s.user, skills } })),
      addXP: (xp) => set(s => ({ user: { ...s.user, xp: s.user.xp + xp } })),

      // ── Auth ───────────────────────────────────────────────────
      isAuthenticated: true, // demo mode
      token: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null }),

      // ── Chatbot ────────────────────────────────────────────────
      chatOpen: false,
      chatMessages: [
        {
          id: 1,
          role: 'assistant',
          content: "👋 Hi! I'm **NEXUS AI**, your personal career intelligence mentor.\n\nI can help you:\n- 🎯 Discover the right career path\n- 📊 Analyze your skill gaps\n- 🎮 Recommend simulations\n- 🔮 Predict your career future\n\nWhat would you like to explore today?",
          timestamp: new Date().toISOString(),
        },
      ],
      isChatLoading: false,
      toggleChat: () => set(s => ({ chatOpen: !s.chatOpen })),
      closeChat: () => set({ chatOpen: false }),
      addMessage: (message) => set(s => ({ chatMessages: [...s.chatMessages, { id: Date.now(), ...message }] })),
      setChatLoading: (loading) => set({ isChatLoading: loading }),
      clearChat: () => set({ chatMessages: [] }),

      // ── Career Results ─────────────────────────────────────────
      careerResults: null,
      setCareerResults: (results) => set({ careerResults: results }),

      // ── Simulation State ───────────────────────────────────────
      activeSimulation: null,
      simulationStep: 0,
      simulationScores: { accuracy: 0, logic: 0, risk: 0, speed: 0 },
      simulationChoices: [],
      simulationComplete: false,
      setActiveSimulation: (sim) => set({ activeSimulation: sim, simulationStep: 0, simulationScores: { accuracy: 0, logic: 0, risk: 0, speed: 0 }, simulationChoices: [], simulationComplete: false }),
      advanceStep: (choice) => set(s => {
        const newScores = {
          accuracy: s.simulationScores.accuracy + (choice.score.accuracy || 0),
          logic:    s.simulationScores.logic    + (choice.score.logic    || 0),
          risk:     s.simulationScores.risk     + (choice.score.risk     || 0),
          speed:    s.simulationScores.speed    + (choice.score.speed    || 0),
        };
        const steps = s.activeSimulation?.steps || [];
        const nextStep = s.simulationStep + 1;
        const complete = nextStep >= steps.length;
        return {
          simulationChoices: [...s.simulationChoices, { step: s.simulationStep, choice }],
          simulationScores: newScores,
          simulationStep: nextStep,
          simulationComplete: complete,
        };
      }),
      resetSimulation: () => set({ activeSimulation: null, simulationStep: 0, simulationScores: { accuracy: 0, logic: 0, risk: 0, speed: 0 }, simulationChoices: [], simulationComplete: false }),

      // ── Notification ───────────────────────────────────────────
      notification: null,
      setNotification: (msg) => set({ notification: msg }),
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: 'nexus-store',
      partialise: (s) => ({ isDark: s.isDark, user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useStore;
