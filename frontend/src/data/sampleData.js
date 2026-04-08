// Sample data for dashboards, predictions, and demo mode
export const sampleUser = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex@nexus.ai',
  avatar: null,
  level: 'Intermediate',
  xp: 3450,
  nextLevelXp: 5000,
  joinedAt: '2024-09-01',
  careerGoal: 'AI/ML Engineer',
  domain: 'Engineering',
  skills: ['Python', 'React', 'SQL', 'Git', 'Statistics', 'Machine Learning'],
  badges: ['🔥 First Simulation', '⚡ Fast Thinker', '🧠 Deep Thinker', '📊 Data Wizard'],
};

export const sampleSkillScores = [
  { skill: 'Programming', score: 78, max: 100 },
  { skill: 'Data Analysis', score: 85, max: 100 },
  { skill: 'System Design', score: 62, max: 100 },
  { skill: 'Communication', score: 70, max: 100 },
  { skill: 'Problem Solving', score: 88, max: 100 },
  { skill: 'ML/AI', score: 74, max: 100 },
];

export const sampleRadarData = [
  { subject: 'Programming',    A: 78, fullMark: 100 },
  { subject: 'Data Analysis',  A: 85, fullMark: 100 },
  { subject: 'System Design',  A: 62, fullMark: 100 },
  { subject: 'Communication',  A: 70, fullMark: 100 },
  { subject: 'Problem Solving',A: 88, fullMark: 100 },
  { subject: 'ML / AI',        A: 74, fullMark: 100 },
];

export const sampleGrowthData = [
  { month: 'Oct',  score: 42, readiness: 38 },
  { month: 'Nov',  score: 51, readiness: 45 },
  { month: 'Dec',  score: 58, readiness: 52 },
  { month: 'Jan',  score: 65, readiness: 60 },
  { month: 'Feb',  score: 71, readiness: 66 },
  { month: 'Mar',  score: 78, readiness: 74 },
  { month: 'Apr',  score: 83, readiness: 80 },
  { month: 'May',  score: 88, readiness: 85, projected: true },
  { month: 'Jun',  score: 92, readiness: 90, projected: true },
  { month: 'Jul',  score: 95, readiness: 93, projected: true },
];

export const sampleSimulationHistory = [
  { id: 1, scenario: 'System Outage at 3AM', domain: 'Engineering', score: 87, date: '2024-03-28', time: '4m 12s' },
  { id: 2, scenario: 'Product Launch Crisis', domain: 'Business',   score: 74, date: '2024-03-20', time: '5m 45s' },
  { id: 3, scenario: 'Emergency Room: Code Blue', domain: 'Medical', score: 91, date: '2024-03-15', time: '3m 58s' },
];

export const samplePrediction = {
  jobReadiness:    82,
  growthPotential: 91,
  riskLevel:      'Low',
  riskScore:       18,
  topStrength:    'Data Analysis',
  topGap:         'System Design',
  sixMonthTarget:  93,
  careerLevel:    'Mid-level',
  promotionChance: 74,
  scenarios: {
    optimistic:  { label: 'Optimistic',  score: 95, color: '#10b981' },
    realistic:   { label: 'Realistic',   score: 82, color: '#3b82f6' },
    pessimistic: { label: 'Pessimistic', score: 65, color: '#f59e0b' },
  },
};

export const sampleKnowledgeGaps = [
  { skill: 'System Design',    priority: 'High',   progress: 30, resources: ['System Design Primer (GitHub)', 'Grokking the System Design Interview'] },
  { skill: 'Kubernetes',       priority: 'High',   progress: 20, resources: ['Kubernetes Official Docs', 'CKAD Practice Labs'] },
  { skill: 'LLM Engineering',  priority: 'Medium', progress: 45, resources: ['Hugging Face Course', 'LangChain Docs'] },
  { skill: 'MLOps',            priority: 'Medium', progress: 35, resources: ['MLflow Docs', 'Full Stack MLOps Course'] },
  { skill: 'Data Visualization',priority:'Low',    progress: 65, resources: ['D3.js Official', 'Observable Notebooks'] },
];

export const chatbotSuggestions = [
  '🎯 What career should I pursue?',
  '📊 Analyze my skill gaps',
  '🚀 Show me a simulation',
  '🔮 Predict my career growth',
  '📚 Recommend courses for me',
  '💡 How do I become an AI Engineer?',
];

export const activityFeed = [
  { icon: '🎮', text: 'Completed System Outage simulation', time: '2 hours ago', color: '#3b82f6' },
  { icon: '📊', text: 'Skill radar updated — ML/AI +8%',  time: '1 day ago',   color: '#8b5cf6' },
  { icon: '🏆', text: 'Earned badge: Fast Thinker',         time: '3 days ago',  color: '#f59e0b' },
  { icon: '💬', text: 'AI mentor session: Career insights', time: '5 days ago',  color: '#10b981' },
];
