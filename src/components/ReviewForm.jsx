import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import api, { errMsg } from '../api/axios.js';
import { StarInput } from './StarRating.jsx';

export default function ReviewForm({ consultationId, onDone }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Choose a star rating');
    setBusy(true); setError('');
    try {
      await api.post('/reviews', { consultationId, rating, review: text });
      setDone(true); onDone?.();
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  if (done) return <p className="flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 size={18} /> Thank you for your review.</p>;
  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <p className="font-medium text-slate-800">How was your consultation?</p>
      <StarInput value={rating} onChange={setRating} />
      <textarea className="input" rows={3} maxLength={1000} placeholder="Share a few words (optional)" value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="btn-royal" disabled={busy}>{busy ? 'Submitting…' : 'Submit review'}</button>
    </form>
  );
}
