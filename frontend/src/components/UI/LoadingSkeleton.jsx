export default function LoadingSkeleton({ lines = 3, height = 'h-4', className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton ${height} rounded-lg`}
          style={{ width: i === lines - 1 ? '70%' : '100%' }} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded w-1/3" />
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      </div>
      <div className="skeleton h-32 rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 rounded" />
        <div className="skeleton h-3 rounded w-4/5" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="skeleton h-7 w-16 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}
