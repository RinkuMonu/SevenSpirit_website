import { motion } from 'framer-motion';

const SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const STARS = [[30, 40], [80, 90], [300, 60], [340, 200], [60, 330], [320, 340], [190, 14], [14, 190]];

export default function ZodiacWheel({ className = '' }) {
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      <motion.svg viewBox="0 0 400 400" className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}>
        <g fill="none" stroke="#e6bb4e" strokeOpacity=".55">
          <circle cx="200" cy="200" r="190" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="150" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" strokeWidth=".8" strokeDasharray="3 6" />
          {SIGNS.map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <line key={i} x1={200 + 150 * Math.cos(a)} y1={200 + 150 * Math.sin(a)} x2={200 + 190 * Math.cos(a)} y2={200 + 190 * Math.sin(a)} strokeWidth="1" />;
          })}
          <polygon points="200,60 321,270 79,270" strokeOpacity=".35" />
          <polygon points="200,340 79,130 321,130" strokeOpacity=".35" />
        </g>
        {SIGNS.map((s, i) => {
          const a = ((i * 30 + 15) * Math.PI) / 180;
          return <text key={i} x={200 + 170 * Math.cos(a)} y={200 + 170 * Math.sin(a)} fill="#f1d481" fontSize="20" textAnchor="middle" dominantBaseline="central">{s}</text>;
        })}
        <circle cx="200" cy="200" r="34" fill="#e6bb4e" fillOpacity=".15" stroke="#f1d481" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="12" fill="#f1d481" />
      </motion.svg>
      {STARS.map(([x, y], i) => (
        <span key={i} className="twinkle absolute h-1.5 w-1.5 rounded-full bg-gold-200" style={{ left: `${x / 4}%`, top: `${y / 4}%`, animationDelay: `${i * 0.4}s` }} />
      ))}
    </div>
  );
}
