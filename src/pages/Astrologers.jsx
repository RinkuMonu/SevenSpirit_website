import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api, { errMsg } from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import AstrologerCard from '../components/AstrologerCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { LANGUAGES, SPECIALIZATIONS } from '../data/content.js';

const GROUPS = [
  { key: 'experience', label: 'Experience', options: [['', 'Any'], ['5', '5+ years'], ['10', '10+ years'], ['15', '15+ years'], ['20', '20+ years']] },
  { key: 'price', label: 'Price (starting)', options: [['', 'Any'], ['under-199', 'Under ₹199'], ['199-499', '₹199–₹499'], ['500-999', '₹499–₹999'], ['1000-plus', '₹999+']] },
  { key: 'rating', label: 'Rating', options: [['', 'Any'], ['4', '4+'], ['4.5', '4.5+'], ['4.8', '4.8+']] },
  { key: 'status', label: 'Availability', options: [['', 'All'], ['online', 'Online'], ['offline', 'Offline']] },
];

export default function Astrologers() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => Object.fromEntries(['specialization', 'language', 'experience', 'price', 'rating', 'status', 'sort'].map((k) => [k, params.get(k) || ''])), [params]);
  const q = params.get('q') || '';

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
    setPage(1);
  };

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => { const t = setTimeout(() => search !== q && setParam('q', search.trim()), 350); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    api.get('/astrologers', { params: { q, ...filters, page, limit: 12 } })
      .then((r) => {
        if (cancelled) return;
        setItems((prev) => (page === 1 ? r.data.data : [...prev, ...r.data.data]));
        setMeta({ total: r.data.total, pages: r.data.pages });
      })
      .catch((e) => !cancelled && setError(errMsg(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [q, filters, page]);

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== 'sort').length;
  const clear = () => { setSearch(''); setParams({}, { replace: true }); setPage(1); };

  const Panel = (
    <div className="space-y-5 text-sm">
      <div>
        <p className="label">Specialization</p>
        <div className="flex flex-wrap gap-1.5">
          {['', ...SPECIALIZATIONS].map((s) => (
            <button key={s || 'all'} onClick={() => setParam('specialization', s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${filters.specialization === s ? 'border-royal-700 bg-royal-700 text-white' : 'border-slate-300 bg-white hover:border-royal-400'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="lang">Language</label>
        <select id="lang" className="input" value={filters.language} onChange={(e) => setParam('language', e.target.value)}>
          <option value="">Any language</option>
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      {GROUPS.map((g) => (
        <fieldset key={g.key}>
          <legend className="label">{g.label}</legend>
          <div className="space-y-1">
            {g.options.map(([v, l]) => (
              <label key={v} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name={g.key} className="accent-royal-700" checked={filters[g.key] === v} onChange={() => setParam(g.key, v)} /> {l}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {(activeCount > 0 || q) && <button onClick={clear} className="text-sm font-medium text-royal-700 underline">Clear all filters</button>}
    </div>
  );

  return (
    <>
      <Seo title="Find Your Perfect Astrologer" description="Browse verified astrologers by specialization, language, experience, price and rating. Chat or call online." path="/astrologers" />
      <section className="sky py-12 text-center text-white">
        <div className="container-x">
          <h1 className="text-4xl font-bold sm:text-5xl">Find Your Perfect Astrologer</h1>
          <div className="relative mx-auto mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, specialization or language"
              className="input !rounded-full !py-3 pl-11 text-slate-800" aria-label="Search astrologers" />
          </div>
        </div>
      </section>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-royal-100 bg-white p-5">{Panel}</div></aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">{loading && page === 1 ? 'Searching…' : `${meta.total} astrologer${meta.total === 1 ? '' : 's'} found`}</p>
            <div className="flex items-center gap-2">
              <button className="btn-outline !py-2 lg:hidden" onClick={() => setShowFilters(true)}><SlidersHorizontal size={16} /> Filters{activeCount ? ` (${activeCount})` : ''}</button>
              <select className="input !w-auto !py-2" aria-label="Sort" value={filters.sort} onChange={(e) => setParam('sort', e.target.value)}>
                <option value="">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="experience">Most experienced</option>
                <option value="popular">Most consultations</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
          {!error && !loading && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-royal-200 bg-white p-10 text-center">
              <p className="font-display text-2xl font-bold text-royal-900">No astrologers match these filters</p>
              <button onClick={clear} className="btn-royal mt-4">Clear filters</button>
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((a, i) => <AstrologerCard key={a._id} a={a} index={i} />)}
          </div>
          {loading && <Spinner />}
          {!loading && page < meta.pages && <div className="mt-8 text-center"><button className="btn-outline" onClick={() => setPage((p) => p + 1)}>Load more</button></div>}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="flex items-center justify-between border-b px-4 py-3"><h2 className="text-2xl font-bold">Filters</h2><button onClick={() => setShowFilters(false)} aria-label="Close"><X /></button></div>
          <div className="flex-1 overflow-y-auto p-4">{Panel}</div>
          <div className="border-t p-4"><button className="btn-gold w-full" onClick={() => setShowFilters(false)}>Show {meta.total} results</button></div>
        </div>
      )}
    </>
  );
}
