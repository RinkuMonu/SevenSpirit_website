import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertCircle, Clock, Loader2, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react';
import api, { errMsg } from '../api/axios.js';
import { loadRazorpay, rupee } from '../utils.js';

const DURATIONS = [10, 30, 60];

export default function CheckoutModal({ astrologer, type, duration: initial, onClose }) {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [duration, setDuration] = useState(DURATIONS.includes(initial) ? initial : 30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isChat = type === 'CHAT';
  const price = (d) => astrologer[`${type.toLowerCase()}Price${d}Min`];
  const Icon = isChat ? MessageCircle : Phone;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [busy, onClose]);

  const pay = async () => {
    setBusy(true); setError('');
    try {
      await loadRazorpay();
      const { data } = await api.post('/payments/order', { astrologerId: astrologer._id, type, duration });
      const o = data.data;
      const rzp = new window.Razorpay({
        key: o.keyId, amount: o.amount, currency: o.currency, order_id: o.orderId,
        name: 'SevenSpirit',
        description: `${isChat ? 'Chat' : 'Call'} with ${astrologer.name} · ${duration} min`,
        prefill: { name: user.name, email: user.email, contact: user.mobile },
        theme: { color: '#552395' },
        // The browser only forwards proof of payment. The server decides whether it is valid.
        handler: async (resp) => {
          try {
            const v = await api.post('/payments/verify', resp);
            const { consultationId, type: t } = v.data.data;
            onClose();
            navigate(`/${t === 'CHAT' ? 'chat' : 'call'}/${consultationId}`);
          } catch (e) {
            setError(`${errMsg(e)} If money was deducted, contact support with payment ID ${resp.razorpay_payment_id}.`);
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on('payment.failed', (r) => { setError(r.error?.description || 'Payment failed. Please try again.'); setBusy(false); });
      rzp.open();
    } catch (e) {
      setError(errMsg(e)); setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/70 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Choose consultation plan">
      <div className="flex h-full w-full flex-col bg-white shadow-2xl sm:h-auto sm:max-w-md sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-royal-900"><Icon size={20} className="text-royal-600" /> {isChat ? 'Chat' : 'Call'} with {astrologer.name}</h2>
          <button onClick={onClose} disabled={busy} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600"><Clock size={16} /> Choose duration</p>
          <div className="space-y-2" role="radiogroup">
            {DURATIONS.map((d) => (
              <label key={d} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition ${duration === d ? 'border-royal-600 bg-royal-50' : 'border-slate-200 hover:border-royal-300'}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="duration" className="accent-royal-700" checked={duration === d} onChange={() => setDuration(d)} />
                  <span className="font-medium">{d} Minutes</span>
                </span>
                <span className="font-semibold text-royal-800">{rupee(price(d))}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
            <span className="text-sm text-slate-600">Total</span>
            <span className="font-display text-3xl font-bold text-royal-900">{rupee(price(duration))}</span>
          </div>

          {error && <p className="mt-4 flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}</p>}
        </div>

        <div className="border-t px-5 py-4">
          <button onClick={pay} disabled={busy} className="btn-gold w-full !py-3 text-base">
            {busy ? <><Loader2 className="animate-spin" size={18} /> Processing…</> : `Pay & Start ${isChat ? 'Chat' : 'Call'}`}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck size={14} /> Secure payment by Razorpay. Your session starts right after payment.</p>
        </div>
      </div>
    </div>
  );
}
