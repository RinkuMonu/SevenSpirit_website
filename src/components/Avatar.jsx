import { useState } from 'react';

export default function Avatar({ src, name = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-royal-700 to-royal-900 font-display text-4xl text-gold-300 ${className}`}>
        {initials}
      </div>
    );
  }
  return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={className} />;
}
