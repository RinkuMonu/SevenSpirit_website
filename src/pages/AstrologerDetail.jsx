import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BadgeCheck, Clock, Languages, MessageCircle, Phone, Users } from 'lucide-react';
import api, { SITE_URL, errMsg } from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import Avatar from '../components/Avatar.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { Stars } from '../components/StarRating.jsx';
import { useConsult } from '../components/ConsultProvider.jsx';
import { rupee } from '../utils.js';

function PlanGroup({ a, type, selected, onSelect, onStart }) {
  const isChat = type === 'CHAT';
  const Icon = isChat ? MessageCircle : Phone;
  const online = a.onlineStatus === 'ONLINE';
  const price = (d) => a[`${type.toLowerCase()}Price${d}Min`];
  return (
    <div className="rounded-2xl border border-royal-100 bg-white p-5">
      <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-royal-900"><Icon size={20} className="text-royal-600" /> {isChat ? 'Chat' : 'Call'}</h3>
      <div className="space-y-2">
        {[10, 30, 60].map((d) => (
          <button key={d} onClick={() => onSelect(d)} aria-pressed={selected === d}
            className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 text-sm transition ${selected === d ? 'border-royal-600 bg-royal-50' : 'border-slate-200 hover:border-royal-300'}`}>
            <span className="flex items-center gap-2"><Clock size={15} className="text-slate-400" /> {d} Minutes</span>
            <span className="font-semibold text-royal-800">{rupee(price(d))}</span>
          </button>
        ))}
      </div>
      {online ? (
        <button onClick={onStart} className={`${isChat ? 'btn-gold' : 'btn-royal'} mt-4 w-full`}><Icon size={16} /> {isChat ? 'Chat Now' : 'Call Now'}</button>
      ) : (
        <div className="mt-4"><button disabled className="btn-outline w-full">{a.onlineStatus === 'BUSY' ? 'Currently Busy' : 'Currently Offline'}</button><p className="mt-1 text-center text-xs text-slate-500">Try Again Later</p></div>
      )}
    </div>
  );
}

export default function AstrologerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useSelector((s) => s.auth);
  const { start } = useConsult();
  const [a, setA] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [img, setImg] = useState(0);
  const [chatDur, setChatDur] = useState(30);
  const [callDur, setCallDur] = useState(30);

  useEffect(() => {
    setA(null); setError('');
    api.get(`/astrologers/${slug}`).then((r) => {
      setA(r.data.data);
      api.get(`/reviews/astrologer/${r.data.data._id}`).then((rv) => setReviews(rv.data.data)).catch(() => {});
    }).catch((e) => setError(errMsg(e)));
  }, [slug]);

  // Returning from login: reopen checkout for the exact astrologer + service the visitor chose.
  useEffect(() => {
    const action = params.get('action');
    if (a && user && (action === 'chat' || action === 'call')) {
      start(a, action.toUpperCase(), Number(params.get('duration')) || undefined);
      navigate(`/astrologer/${slug}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, user]);

  if (error) return <div className="container-x py-24 text-center"><h1 className="text-4xl font-bold">Astrologer not found</h1><p className="mt-2 text-slate-600">{error}</p><Link to="/astrologers" className="btn-royal mt-6">Browse astrologers</Link></div>;
  if (!a) return <Spinner full />;

  const images = [a.profileImage, a.coverImage, ...(a.gallery || [])].filter(Boolean);
  const online = a.onlineStatus === 'ONLINE';
  const desc = `${a.name} – ${a.title}. ${a.experience} years experience. Chat from ${rupee(a.chatPrice10Min)}, call from ${rupee(a.callPrice10Min)}. Rated ${a.rating}/5 by ${a.reviewCount} customers.`;

  return (
    <>
      <Seo
        title={`${a.name} – ${a.title}`} description={desc} path={`/astrologer/${a.slug}`} image={a.profileImage} type="profile"
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'Service', name: `Astrology consultation with ${a.name}`, description: a.bio,
          url: `${SITE_URL}/astrologer/${a.slug}`, image: a.profileImage,
          provider: { '@type': 'Person', name: a.name, jobTitle: a.title },
          aggregateRating: a.reviewCount ? { '@type': 'AggregateRating', ratingValue: a.rating, reviewCount: a.reviewCount, bestRating: 5 } : undefined,
          offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: Math.min(a.chatPrice10Min, a.callPrice10Min), highPrice: Math.max(a.chatPrice60Min, a.callPrice60Min), availability: online ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
        }}
      />

      <div className="container-x pb-28 pt-8 lg:pb-12">
        <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb"><Link to="/" className="hover:underline">Home</Link> / <Link to="/astrologers" className="hover:underline">Astrologers</Link> / <span className="text-slate-800">{a.name}</span></nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border border-royal-100 bg-royal-100">
              <Avatar src={images[img]} name={a.name} className="aspect-square w-full object-cover object-top" />
              <StatusBadge status={a.onlineStatus} className="absolute left-3 top-3" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((src, i) => (
                  <button key={src} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${img === i ? 'border-royal-600' : 'border-transparent'}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-4xl font-bold text-royal-900 sm:text-5xl">
              {a.name} {a.isVerified && <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 font-sans text-xs font-semibold text-sky-700"><BadgeCheck size={14} /> Verified</span>}
            </h1>
            <p className="mt-1 text-lg text-slate-600">{a.title}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-700">
              <span className="flex items-center gap-2"><Stars value={a.rating} size={16} /> <b>{a.rating.toFixed(1)}</b> ({a.reviewCount.toLocaleString('en-IN')} reviews)</span>
              <span>{a.experience} years experience</span>
              <span className="flex items-center gap-1"><Users size={15} /> {a.totalConsultations.toLocaleString('en-IN')} consultations</span>
              <span className="flex items-center gap-1"><Languages size={15} /> {a.languages.join(', ')}</span>
            </div>

            <h2 className="mt-8 text-3xl font-bold text-royal-900">About</h2>
            <p className="mt-2 leading-relaxed text-slate-700">{a.bio}</p>

            <h2 className="mt-8 text-3xl font-bold text-royal-900">Expertise</h2>
            <div className="mt-2 flex flex-wrap gap-2">{a.specialization.map((s) => <Link key={s} to={`/astrologers?specialization=${s}`} className="chip !px-3 !py-1 !text-sm hover:bg-royal-100">{s}</Link>)}</div>

            <h2 className="mt-8 text-3xl font-bold text-royal-900">Consultation pricing</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <PlanGroup a={a} type="CHAT" selected={chatDur} onSelect={setChatDur} onStart={() => start(a, 'CHAT', chatDur)} />
              <PlanGroup a={a} type="CALL" selected={callDur} onSelect={setCallDur} onStart={() => start(a, 'CALL', callDur)} />
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-3xl font-bold text-royal-900">Customer reviews</h2>
          {reviews.length === 0 ? <p className="mt-3 text-slate-500">No reviews yet. Reviews appear after completed consultations.</p> : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <article key={r._id} className="rounded-xl border border-royal-100 bg-white p-4">
                  <div className="flex items-center justify-between"><b className="text-sm">{r.userName}</b><Stars value={r.rating} /></div>
                  {r.review && <p className="mt-2 text-sm text-slate-700">{r.review}</p>}
                  <p className="mt-2 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white p-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,.25)] lg:hidden">
        {online ? (
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => start(a, 'CHAT', chatDur)}><MessageCircle size={16} /> Chat · {rupee(a[`chatPrice${chatDur}Min`])}</button>
            <button className="btn-royal" onClick={() => start(a, 'CALL', callDur)}><Phone size={16} /> Call · {rupee(a[`callPrice${callDur}Min`])}</button>
          </div>
        ) : <button disabled className="btn-outline w-full">{a.onlineStatus === 'BUSY' ? 'Currently Busy' : 'Currently Offline'} — Try Again Later</button>}
      </div>
    </>
  );
}
