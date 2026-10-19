const MAP = {
  ONLINE: { dot: 'bg-emerald-500', text: 'Online' },
  BUSY: { dot: 'bg-amber-400', text: 'Busy' },
  OFFLINE: { dot: 'bg-slate-500', text: 'Offline' },
};

export default function StatusBadge({ status = 'OFFLINE', className = '' }) {
  const s = MAP[status] || MAP.OFFLINE;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow ${className}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot} ${status === 'ONLINE' ? 'animate-pulse' : ''}`} />
      {s.text}
    </span>
  );
}
