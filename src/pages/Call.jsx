import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Mic, MicOff, PhoneOff, Timer } from 'lucide-react';
import api, { SOCKET_URL, errMsg } from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import Avatar from '../components/Avatar.jsx';
import Spinner from '../components/Spinner.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import useCountdown, { fmtClock } from '../hooks/useCountdown.js';

const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
if (import.meta.env.VITE_TURN_URL) {
  iceServers.push({ urls: import.meta.env.VITE_TURN_URL, username: import.meta.env.VITE_TURN_USER, credential: import.meta.env.VITE_TURN_PASS });
}

const STATUS_TEXT = { init: 'Preparing microphone…', waiting: 'Waiting for the astrologer to join…', connecting: 'Connecting…', connected: 'Connected', reconnecting: 'Reconnecting…', ended: 'Call ended' };

export default function Call() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState('init');
  const [muted, setMuted] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [error, setError] = useState('');
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const endedRef = useRef(false);

  const remaining = useCountdown(c?.status === 'ACTIVE' ? c.expiresAt : null, offset);
  const ended = status === 'ended';

  const release = useCallback(() => {
    pcRef.current?.close(); pcRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null;
    socketRef.current?.disconnect();
  }, []);

  const teardown = useCallback(() => {
    endedRef.current = true;
    release();
    setStatus('ended');
  }, [release]);

  useEffect(() => {
    let alive = true;
    api.get(`/consultations/${id}`).then(({ data }) => {
      if (!alive) return;
      if (data.data.type !== 'CALL') return navigate(`/chat/${id}`, { replace: true });
      setC(data.data); setOffset(new Date(data.serverTime).getTime() - Date.now());
      if (data.data.status !== 'ACTIVE') setStatus('ended');
    }).catch((e) => alive && setError(errMsg(e)));
    return () => { alive = false; };
  }, [id, navigate]);

  // WebRTC + signalling. The user side makes the offer; the astrologer-side client answers.
  useEffect(() => {
    if (!c || c.status !== 'ACTIVE' || endedRef.current) return undefined;
    let cancelled = false;
    const socket = io(SOCKET_URL, { auth: { token: localStorage.getItem('token') } });
    socketRef.current = socket;

    const ensurePc = () => {
      if (pcRef.current) return pcRef.current;
      const pc = new RTCPeerConnection({ iceServers });
      streamRef.current?.getTracks().forEach((t) => pc.addTrack(t, streamRef.current));
      pc.onicecandidate = (e) => e.candidate && socket.emit('call:signal', { consultationId: id, data: { type: 'candidate', candidate: e.candidate } });
      pc.ontrack = (e) => { if (audioRef.current) audioRef.current.srcObject = e.streams[0]; };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') setStatus('connected');
        if (pc.connectionState === 'disconnected') setStatus('reconnecting');
        if (pc.connectionState === 'failed') { setStatus('waiting'); pcRef.current = null; pc.close(); }
      };
      pcRef.current = pc;
      return pc;
    };
    const makeOffer = async () => {
      const pc = ensurePc();
      setStatus('connecting');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('call:signal', { consultationId: id, data: { type: 'offer', sdp: pc.localDescription } });
    };

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
      } catch {
        if (!cancelled) setError('Microphone access is required for calls. Allow it in your browser settings and reload this page.');
        return;
      }
      if (cancelled) return;
      setStatus('waiting');

      socket.on('connect', () => {
        socket.emit('room:join', { consultationId: id }, (res) => {
          if (!res?.ok) return teardown();
          socket.emit('call:ready', { consultationId: id });
          if (res.peers > 0) makeOffer().catch(() => {});
        });
      });
      socket.on('call:peer-ready', () => makeOffer().catch(() => {}));
      socket.on('call:signal', async (d) => {
        try {
          const pc = ensurePc();
          if (d.type === 'offer') {
            await pc.setRemoteDescription(d.sdp);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('call:signal', { consultationId: id, data: { type: 'answer', sdp: pc.localDescription } });
          } else if (d.type === 'answer') await pc.setRemoteDescription(d.sdp);
          else if (d.type === 'candidate') await pc.addIceCandidate(d.candidate);
        } catch (e) { console.warn('signal error', e); }
      });
      socket.on('call:peer-left', () => { pcRef.current?.close(); pcRef.current = null; if (!endedRef.current) setStatus('waiting'); });
      socket.on('consultation:ended', teardown);
    })();

    return () => { cancelled = true; release(); };
  }, [c, id, teardown, release]);

  // Call duration (counts while connected)
  useEffect(() => {
    if (status !== 'connected') return undefined;
    const t = setInterval(() => setCallSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  // Timer reached zero -> sync with server
  useEffect(() => {
    if (c?.status === 'ACTIVE' && !ended && remaining === 0) {
      api.get(`/consultations/${id}`).then((r) => { setC(r.data.data); teardown(); }).catch(teardown);
    }
  }, [remaining, c, ended, id, teardown]);

  const toggleMute = () => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setMuted(next);
  };
  const endCall = async () => {
    if (!window.confirm('End this call? Any remaining time will be forfeited.')) return;
    try { await api.post(`/consultations/${id}/end`); } catch { /* server sweep will close it anyway */ }
    teardown();
  };

  if (error && !c) return <div className="container-x py-24 text-center"><p className="text-red-700">{error}</p><Link to="/my-consultations" className="btn-royal mt-4">My consultations</Link></div>;
  if (!c) return <Spinner full />;
  const a = c.astrologer;

  return (
    <div className="sky flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-10 text-white">
      <Seo title="Call consultation" noindex />
      <audio ref={audioRef} autoPlay />
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto h-36 w-36">
          {status === 'connected' && <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/30" />}
          <Avatar src={a.profileImage} name={a.name} className="relative h-36 w-36 rounded-full border-4 border-gold-400/70 object-cover" />
        </div>
        <h1 className="mt-5 text-4xl font-bold">{a.name}</h1>
        <p className="mt-1 text-sm text-gold-200">{STATUS_TEXT[status]}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/10 p-3"><p className="text-white/60">Call duration</p><p className="mt-1 text-2xl font-semibold tabular-nums">{fmtClock(callSecs)}</p></div>
          <div className={`rounded-xl p-3 ${remaining <= 60 && !ended ? 'bg-red-500/80' : 'bg-white/10'}`}><p className="flex items-center justify-center gap-1 text-white/70"><Timer size={13} /> Time left</p><p className="mt-1 text-2xl font-semibold tabular-nums">{ended ? '00:00' : fmtClock(remaining)}</p></div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm" role="alert">{error}</p>}

        {!ended ? (
          <div className="mt-8 flex justify-center gap-5">
            <button onClick={toggleMute} aria-pressed={muted} className={`flex h-16 w-16 items-center justify-center rounded-full ${muted ? 'bg-white text-night' : 'bg-white/15 hover:bg-white/25'}`} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <MicOff /> : <Mic />}
            </button>
            <button onClick={endCall} className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-700" aria-label="End call"><PhoneOff /></button>
          </div>
        ) : (
          <div className="mt-8 space-y-4 rounded-2xl bg-white p-5 text-slate-800">
            <p className="font-display text-2xl font-bold text-royal-900">Your consultation has ended.</p>
            <Link to={`/astrologer/${a.slug}`} className="btn-gold w-full">Book Another Consultation</Link>
            {!c.hasReview && <div className="border-t pt-4"><ReviewForm consultationId={c._id} onDone={() => setC({ ...c, hasReview: true })} /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
