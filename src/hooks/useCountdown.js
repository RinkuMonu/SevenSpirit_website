import { useEffect, useState } from 'react';

/** Seconds remaining until `expiresAt`, corrected by the server/client clock offset. */
export default function useCountdown(expiresAt, offsetMs = 0) {
  const calc = () => (expiresAt ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - (Date.now() + offsetMs)) / 1000)) : 0);
  const [secs, setSecs] = useState(calc);
  useEffect(() => {
    setSecs(calc());
    if (!expiresAt) return undefined;
    const t = setInterval(() => setSecs(calc()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt, offsetMs]);
  return secs;
}

export const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
