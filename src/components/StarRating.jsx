import { Star } from 'lucide-react';

export function Stars({ value = 0, size = 14 }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-gold-400 text-gold-400' : 'text-slate-300'} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? 's' : ''}`}
          onClick={() => onChange(i)} className="rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
          <Star size={28} className={i <= value ? 'fill-gold-400 text-gold-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  );
}
