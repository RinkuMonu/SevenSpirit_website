import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Check, CheckCheck, Send, Timer } from 'lucide-react';
import api, { SOCKET_URL, errMsg } from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import Avatar from '../components/Avatar.jsx';
import Spinner from '../components/Spinner.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import useCountdown, { fmtClock } from '../hooks/useCountdown.js';
import { fmtTime } from '../utils.js';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState('');
  const [sendErr, setSendErr] = useState('');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);
  const endedRef = useRef(false);

  const remaining = useCountdown(c?.status === 'ACTIVE' ? c.expiresAt : null, offset);

  const finish = useCallback(() => {
    endedRef.current = true;
    setEnded(true);
    socketRef.current?.disconnect();
  }, []);

  // Load consultation + history
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/consultations/${id}`);
        if (!alive) return;
        if (data.data.type !== 'CHAT') return navigate(`/call/${id}`, { replace: true });
        setC(data.data);
        setOffset(new Date(data.serverTime).getTime() - Date.now());
        const h = await api.get(`/chat/${id}/messages`);
        if (alive) setMsgs(h.data.data);
        if (data.data.status !== 'ACTIVE') setEnded(true);
      } catch (e) { if (alive) setError(errMsg(e)); }
    })();
    return () => { alive = false; };
  }, [id, navigate]);

  // Socket connection (only while the consultation is active)
  useEffect(() => {
    if (!c || c.status !== 'ACTIVE' || endedRef.current) return undefined;
    const socket = io(SOCKET_URL, { auth: { token: localStorage.getItem('token') }, transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('room:join', { consultationId: id }, (res) => {
        if (!res?.ok) { setSendErr(res?.error || 'Could not join chat'); finish(); }
      });
    });
    socket.on('chat:message', (m) => {
      setMsgs((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m]));
      if (m.senderModel === 'Astrologer') socket.emit('chat:read', { consultationId: id });
    });
    socket.on('chat:typing', (t) => t.by === 'ASTROLOGER' && setTyping(t.isTyping));
    socket.on('chat:read', ({ by }) => by === 'ASTROLOGER' && setMsgs((prev) => prev.map((m) => (m.senderModel === 'User' ? { ...m, isRead: true } : m))));
    socket.on('consultation:ended', finish);
    socket.on('connect_error', () => setSendErr('Connection problem. Retrying…'));
    socket.io.on('reconnect', () => setSendErr(''));
    return () => { socket.disconnect(); };
  }, [c, id, finish]);

  // Local timer hit zero -> re-sync with server (server is the source of truth)
  useEffect(() => {
    if (c?.status === 'ACTIVE' && !ended && remaining === 0 && c.expiresAt) {
      api.get(`/consultations/${id}`).then((r) => { setC(r.data.data); finish(); }).catch(finish);
    }
  }, [remaining, c, ended, id, finish]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing, ended]);

  const send = (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || ended) return;
    setText(''); setSendErr('');
    socketRef.current?.emit('chat:typing', { consultationId: id, isTyping: false });
    socketRef.current?.emit('chat:send', { consultationId: id, message }, (res) => {
      if (!res?.ok) { setSendErr(res?.error || 'Message failed'); if (/ended/i.test(res?.error || '')) finish(); }
    });
  };

  const onType = (e) => {
    setText(e.target.value);
    socketRef.current?.emit('chat:typing', { consultationId: id, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socketRef.current?.emit('chat:typing', { consultationId: id, isTyping: false }), 1500);
  };

  const endNow = async () => {
    if (!window.confirm('End this consultation now? Any remaining time will be forfeited.')) return;
    try { await api.post(`/consultations/${id}/end`); finish(); } catch (e) { setSendErr(errMsg(e)); }
  };

  if (error) return <div className="container-x py-24 text-center"><p className="text-red-700">{error}</p><Link to="/my-consultations" className="btn-royal mt-4">My consultations</Link></div>;
  if (!c) return <Spinner full />;
  const a = c.astrologer;
  const low = !ended && remaining <= 60;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col bg-white shadow-soft sm:my-0">
      <Seo title="Chat consultation" noindex />
      <header className="flex items-center gap-3 border-b bg-night px-4 py-3 text-white">
        <Avatar src={a.profileImage} name={a.name} className="h-11 w-11 rounded-full object-cover text-lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold leading-tight">{a.name}</p>
          <p className="text-xs text-white/70">{typing ? 'typing…' : a.onlineStatus === 'ONLINE' ? '🟢 Online' : a.onlineStatus === 'BUSY' ? '🟡 Busy' : '⚫ Offline'}</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums ${low ? 'bg-red-500 text-white' : 'bg-white/10 text-gold-200'}`} aria-live="off">
          <Timer size={15} /> {ended ? '00:00' : fmtClock(remaining)}
        </div>
        {!ended && <button onClick={endNow} className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-medium hover:bg-white/10">End</button>}
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto bg-[#f7f2e8] px-3 py-4" aria-live="polite">
        {msgs.length === 0 && !ended && <p className="mx-auto mt-6 max-w-xs text-center text-sm text-slate-500">Your consultation has started. Say hello and ask your question.</p>}
        {msgs.map((m) => {
          const mine = m.senderModel === 'User';
          return (
            <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${mine ? 'rounded-br-sm bg-royal-700 text-white' : 'rounded-bl-sm bg-white text-slate-800'}`}>
                <p className="whitespace-pre-wrap break-words">{m.message}</p>
                <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>
                  {fmtTime(m.createdAt)}
                  {mine && (m.isRead ? <CheckCheck size={13} className="text-gold-300" aria-label="Read" /> : <Check size={13} aria-label="Sent" />)}
                </p>
              </div>
            </div>
          );
        })}
        {typing && !ended && <div className="flex"><div className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-slate-400 shadow-sm"><span className="inline-flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:.15s]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:.3s]" /></span></div></div>}

        {ended && (
          <div className="mx-auto mt-4 max-w-sm space-y-4 rounded-2xl bg-white p-5 text-center shadow-soft">
            <p className="font-display text-2xl font-bold text-royal-900">Your consultation has ended.</p>
            <Link to={`/astrologer/${a.slug}`} className="btn-gold w-full">Book Another Consultation</Link>
            {!c.hasReview && c.status !== 'PENDING' && <div className="border-t pt-4"><ReviewForm consultationId={c._id} onDone={() => setC({ ...c, hasReview: true })} /></div>}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {sendErr && <p className="bg-red-50 px-4 py-1.5 text-xs text-red-700" role="alert">{sendErr}</p>}
      <form onSubmit={send} className="flex items-center gap-2 border-t bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <input value={text} onChange={onType} disabled={ended} maxLength={1000} placeholder={ended ? 'Consultation ended' : 'Type message…'} aria-label="Message"
          className="input !rounded-full disabled:bg-slate-100" />
        <button className="btn-gold !rounded-full !px-4" disabled={ended || !text.trim()} aria-label="Send"><Send size={18} /></button>
      </form>
    </div>
  );
}
