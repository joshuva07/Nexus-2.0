import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import useStore from '../../store/useStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-4 py-3 text-xs space-y-1">
        <p className="text-[var(--text-muted)] font-semibold mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[var(--text-muted)]">{p.name}:</span>
            <span className="font-bold" style={{ color: p.color }}>{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrowthChart({ data }) {
  const { isDark } = useStore();
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const tickColor = 'var(--text-muted)';

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', color: tickColor }} />
        <Area type="monotone" dataKey="score"     name="Skill Score" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorScore)"     dot={false} strokeDasharray={d => d.projected ? '5 5' : '0'} />
        <Area type="monotone" dataKey="readiness" name="Job Readiness" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorReadiness)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
