import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import api, { errMsg } from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import Spinner from '../components/Spinner.jsx';
import { fmtDate, rupee } from '../utils.js';

const STATUS_CLS = { ACTIVE: 'bg-emerald-100 text-emerald-800', COMPLETED: 'bg-slate-100 text-slate-700', EXPIRED: 'bg-amber-100 text-amber-800', CANCELLED: 'bg-red-100 text-red-700' };

export default function MyConsultations() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    api.get('/consultations/mine').then((r) => { setRows(r.data.data); setOffset(new Date(r.data.serverTime) - Date.now()); }).catch((e) => setError(errMsg(e)));
  }, []);

  return (
    <div className="container-x max-w-4xl py-10">
      <Seo title="My Consultations" noindex />
      <h1 className="text-4xl font-bold text-royal-900">My consultations</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {!rows && !error && <Spinner />}
      {rows?.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-royal-200 bg-white p-10 text-center">
          <p className="text-slate-600">You have not booked a consultation yet.</p>
          <Link to="/astrologers" className="btn-gold mt-4">Browse astrologers</Link>
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {rows?.map((c) => {
          const live = c.status === 'ACTIVE' && new Date(c.expiresAt).getTime() > Date.now() + offset;
          const Icon = c.type === 'CHAT' ? MessageCircle : Phone;
          return (
            <li key={c._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-royal-100 bg-white p-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold text-royal-900"><Icon size={16} className="text-royal-600" /> {c.astrologer?.name || 'Astrologer'}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLS[c.status] || ''}`}>{live ? 'ACTIVE' : c.status === 'ACTIVE' ? 'COMPLETED' : c.status}</span></p>
                <p className="mt-1 text-sm text-slate-600">{c.type === 'CHAT' ? 'Chat' : 'Call'} · {c.duration} min · {rupee(c.amount)} · {fmtDate(c.startTime || c.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {live && <Link to={`/${c.type === 'CHAT' ? 'chat' : 'call'}/${c._id}`} className="btn-gold !py-2">Rejoin</Link>}
                {!live && ['ACTIVE', 'COMPLETED'].includes(c.status) && <Link to={`/${c.type === 'CHAT' ? 'chat' : 'call'}/${c._id}`} className="btn-outline !py-2">View / Review</Link>}
                {c.astrologer?.slug && <Link to={`/astrologer/${c.astrologer.slug}`} className="btn-outline !py-2">Book again</Link>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
