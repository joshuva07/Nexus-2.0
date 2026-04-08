import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Sparkles, Minimize2, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore';
import { chatbotSuggestions } from '../../data/sampleData';
import { careers, matchCareers } from '../../data/careerData';


// AI response engine (client-side rule-based + optional API)
function generateAIResponse(message, user) {
  const msg = message.toLowerCase();

  if (msg.includes('career') || msg.includes('path') || msg.includes('what should i')) {
    const matches = matchCareers(user?.skills || [], 'All', msg);
    const top = matches.slice(0, 3);
    return `Based on your profile, here are your **top career matches**:\n\n${top.map((c, i) =>
      `${i + 1}. **${c.emoji} ${c.title}** — ${c.matchScore}% match\n   💰 Avg salary: $${c.salaryRange.avg.toLocaleString()}/yr\n   📈 Demand: ${c.demandScore}/100`
    ).join('\n\n')}\n\n👉 Head to the **Career Page** for a full analysis with courses and knowledge gaps!`;
  }

  if (msg.includes('skill') || msg.includes('gap') || msg.includes('missing')) {
    const gaps = ['System Design', 'Kubernetes', 'LLM Engineering', 'MLOps'];
    return `I analyzed your skill profile and found **${gaps.length} key gaps** to close:\n\n${gaps.map((g, i) =>
      `${i + 1}. 🔴 **${g}** — High priority`
    ).join('\n')}\n\n📚 I recommend:\n- *System Design Primer* (free on GitHub)\n- *Hugging Face NLP Course* (free)\n- *Kubernetes Official Docs*\n\nWant me to build you a personalized study plan?`;
  }

  if (msg.includes('simulation') || msg.includes('practice') || msg.includes('experience')) {
    return `🎮 **Simulations available for you:**\n\n1. **🔧 System Outage at 3AM** — Engineering\n   Hard difficulty • 5 min • Tests: logic, speed\n\n2. **🏥 Emergency Room: Code Blue** — Medical\n   Hard difficulty • 4 min • Tests: clinical instinct\n\n3. **🚀 Product Launch Crisis** — Business\n   Medium difficulty • 5 min • Tests: decision making\n\nHead to the **Simulation page** to start! Each scenario adapts to your performance and gives AI-powered feedback.`;
  }

  if (msg.includes('predict') || msg.includes('future') || msg.includes('growth')) {
    return `🔮 **Your Career Prediction (as of today):**\n\n- **Job Readiness:** 82% ↑ trending up\n- **6-Month Projection:** 93% if you close skill gaps\n- **Growth Potential:** 91/100 — 🟢 Excellent\n- **Risk Level:** Low\n\n**Optimistic Path:** AI/ML Engineer at a top tech company within 18 months\n\n**Key actions to accelerate:**\n1. Complete 1 simulation/week\n2. Close System Design gap\n3. Build 2 AI portfolio projects\n\nVisit the **Prediction page** for the full growth chart!`;
  }

  if (msg.includes('course') || msg.includes('learn') || msg.includes('study')) {
    return `📚 **Top courses based on your goal (AI/ML Engineer):**\n\n1. 🏆 **Deep Learning Specialization** — DeepLearning.AI / Coursera\n   ⭐ 4.9 • 4 months • Best for foundations\n\n2. 🤗 **Hugging Face NLP Course** — Free\n   ⭐ 4.8 • 3 weeks • Best for LLMs\n\n3. ☁️ **AWS Solutions Architect** — A Cloud Guru\n   ⭐ 4.8 • 2 months • Best for deployment\n\n4. 🔥 **Fast.ai Deep Learning** — Free\n   ⭐ 4.9 • 7 weeks • Best for practitioners\n\nWant me to create a week-by-week learning roadmap?`;
  }

  if (msg.includes('salary') || msg.includes('money') || msg.includes('pay') || msg.includes('earn')) {
    return `💰 **Salary insights for top tech careers:**\n\n| Career | Avg Salary | Range |\n|--------|-----------|-------|\n| AI/ML Engineer | $180K | $110K–$280K |\n| Cloud Architect | $175K | $120K–$250K |\n| Data Scientist | $135K | $80K–$200K |\n| Software Engineer | $120K | $70K–$180K |\n| Product Manager | $150K | $90K–$220K |\n\n💡 Your skills position you well for **$100K–$150K** roles today, with potential to reach **$180K+** in 12–18 months.`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('start')) {
    return `👋 Welcome back, **${user?.name?.split(' ')[0] || 'there'}**!\n\nI'm your NEXUS AI career mentor. Here's what I can do:\n\n🎯 **Recommend careers** based on your skills\n📊 **Detect skill gaps** and suggest fixes\n🎮 **Guide you** through simulations\n🔮 **Predict** your career trajectory\n📚 **Curate courses** personalized for you\n\nWhat would you like to explore?`;
  }

  if (msg.includes('ai engineer') || msg.includes('machine learning') || msg.includes('ml')) {
    return `🤖 **AI/ML Engineer — Full Roadmap:**\n\n**Phase 1 — Foundations (Month 1–2)**\n• Python mastery → NumPy, Pandas, Matplotlib\n• Statistics & Linear Algebra\n• *Course: Math for ML (Coursera)*\n\n**Phase 2 — Core ML (Month 3–4)**\n• Scikit-learn, Regression, Classification, Clustering\n• *Course: ML Specialization — Andrew Ng*\n\n**Phase 3 — Deep Learning (Month 5–6)**\n• PyTorch, CNNs, Transformers, BERT\n• *Course: Fast.ai + Hugging Face*\n\n**Phase 4 — Production (Month 7–9)**\n• MLOps, Docker, FastAPI, AWS SageMaker\n• Build 2 end-to-end projects\n\n**Your current readiness: 74%** — you're well on track! 🚀\n\nWant me to generate a custom weekly schedule?`;
  }

  // Default smart response
  const responses = [
    `That's a great question! Based on your profile as an **${user?.careerGoal || 'aspiring tech professional'}**, here's my take:\n\nYour strongest skills — **${(user?.skills || ['Python', 'React']).slice(0, 3).join(', ')}** — open doors to multiple high-growth careers.\n\n**My recommendation:** Focus on closing your top 2 skill gaps (System Design + MLOps) and complete at least 2 simulations to build real-world confidence.\n\nAsk me anything specific — careers, courses, salaries, simulations, or predictions!`,
    `Great question! Let me analyze your profile...\n\nWith your current skill set, you're positioned for **mid-to-senior level** roles in tech. Your **${user?.careerGoal || 'career goal'}** is achievable within 12–18 months if you stay consistent.\n\n💡 **Top priority action:** Head to the Career page and run a full analysis — I'll show you exactly what's needed.\n\nWhat specific aspect would you like to dive deeper into?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function ChatbotWidget() {
  const { chatOpen, toggleChat, chatMessages, addMessage, isChatLoading, setChatLoading, user } = useStore();
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [chatMessages, chatOpen, minimized]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    addMessage({ role: 'user', content: msg, timestamp: new Date().toISOString() });
    setChatLoading(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = generateAIResponse(msg, user);
    addMessage({ role: 'assistant', content: response, timestamp: new Date().toISOString() });
    setChatLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl btn-primary flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
        animate={chatOpen ? {} : { boxShadow: ['0 0 0px rgba(59,130,246,0.5)', '0 0 25px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0.5)'] }}
        transition={{ duration: 2.5, repeat: Infinity }}>
        <AnimatePresence mode="wait">
          {chatOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={20} className="text-white" /></motion.div>
            : <motion.div key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Brain size={20} className="text-white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[620px] flex flex-col glass-card overflow-hidden"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.1)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-glass)]"
              style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">NEXUS AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-emerald-400">Online • Career Intelligence</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(v => !v)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-white/10 transition-colors">
                  <Minimize2 size={13} />
                </button>
                <button onClick={toggleChat}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-white/10 transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-panel" style={{ maxHeight: '380px' }}>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <Brain size={12} className="text-white" />
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm'
                            : 'glass-card border-0 text-[var(--text-primary)] rounded-tl-sm'
                        }`}>
                        {msg.role === 'assistant'
                          ? <div className="prose prose-xs max-w-none text-[var(--text-primary)]" style={{ fontSize: '12px', lineHeight: 1.6 }}>
                              <MarkdownContent content={msg.content} />
                            </div>
                          : <p>{msg.content}</p>
                        }
                      </motion.div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Brain size={12} className="text-white" />
                      </div>
                      <div className="glass-card border-0 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div className="px-4 py-2 border-t border-[var(--border-glass)]">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scroll-panel" style={{ scrollbarWidth: 'none' }}>
                    {chatbotSuggestions.map((s) => (
                      <button key={s} onClick={() => handleSend(s)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium border border-[var(--border-glass)] text-[var(--text-muted)] hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-[var(--border-glass)]">
                  <div className="flex items-center gap-2">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask your AI mentor..."
                      className="nexus-input flex-1 text-xs py-2.5"
                    />
                    <button onClick={() => handleSend()}
                      disabled={!input.trim() || isChatLoading}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white disabled:opacity-40 transition-all hover:shadow-glow-blue">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple inline markdown renderer (no extra deps)
function MarkdownContent({ content }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('# '))  return <h3 key={i} className="font-bold text-sm text-blue-400">{line.slice(2)}</h3>;
        if (line.startsWith('## ')) return <h4 key={i} className="font-semibold text-xs text-purple-400">{line.slice(3)}</h4>;
        if (line.startsWith('### '))return <h5 key={i} className="font-semibold text-xs text-blue-300">{line.slice(4)}</h5>;
        if (line.startsWith('|'))   return <TableRow key={i} line={line} />;
        if (line.match(/^\d+\./))   return <p key={i} className="text-[var(--text-primary)] pl-2">{renderInline(line)}</p>;
        if (line.startsWith('• '))  return <p key={i} className="text-[var(--text-primary)] pl-2">• {renderInline(line.slice(2))}</p>;
        if (line.trim() === '')     return <div key={i} className="h-1" />;
        return <p key={i} className="text-[var(--text-primary)]">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function TableRow({ line }) {
  if (line.match(/^[\|\s\-]+$/)) return null;
  const cells = line.split('|').filter(c => c.trim());
  return (
    <div className="flex gap-2 text-[10px]">
      {cells.map((c, i) => (
        <span key={i} className={`flex-1 ${i === 0 ? 'font-semibold text-blue-400' : 'text-[var(--text-muted)]'}`}>{c.trim()}</span>
      ))}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="text-[var(--text-primary)] font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*'))   return <em key={i} className="text-blue-300">{p.slice(1, -1)}</em>;
    return p;
  });
}
