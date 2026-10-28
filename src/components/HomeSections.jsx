import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Compass, Lock, MessageCircle, ShieldCheck, Timer, UserSearch, Wallet } from 'lucide-react';
import { FAQS, SERVICES, TESTIMONIALS } from '../data/content.js';
import { Stars } from './StarRating.jsx';

const Heading = ({ title, sub, light }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center">
    <h2 className={`text-4xl font-bold sm:text-5xl ${light ? 'text-white' : 'text-royal-900'}`}>{title}</h2>
    {sub && <p className={`mt-3 ${light ? 'text-white/70' : 'text-slate-600'}`}>{sub}</p>}
  </div>
);

export function HowItWorks() {
  const steps = [
    { icon: UserSearch, t: 'Choose an Astrologer', d: 'Browse experienced astrologers and compare ratings, languages and prices.' },
    { icon: MessageCircle, t: 'Choose Chat or Call', d: 'Select your preferred way to consult and a 10, 30 or 60 minute plan.' },
    { icon: Wallet, t: 'Pay & Connect', d: 'Complete a secure payment and your private consultation starts instantly.' },
  ];
  return (
    <section className="bg-white py-16">
      <div className="container-x">
        <Heading title="How it works" sub="Three steps from browsing to talking." />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, t, d }, i) => (
            <li key={t} className="relative rounded-2xl border border-royal-100 bg-cream p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-royal-100">{i + 1}</span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-royal-800 text-gold-300"><Icon size={22} /></div>
              <h3 className="text-2xl font-bold text-royal-900">{t}</h3>
              <p className="mt-2 text-sm text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServicesGrid({ title = 'Astrology services', sub = 'Pick the area of life you want guidance on, then find an astrologer who specialises in it.' }) {
  return (
    <section className="py-16">
      <div className="container-x">
        <Heading title={title} sub={sub} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ title: t, desc, icon: Icon, spec }) => (
            <Link key={t} to={spec ? `/astrologers?specialization=${spec}` : '/astrologers'}
              className="group rounded-2xl border border-royal-100 bg-white p-5 transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft">
              <Icon className="text-gold-500 transition group-hover:scale-110" size={28} />
              <h3 className="mt-3 text-2xl font-bold text-royal-900">{t}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const items = [
    { icon: ShieldCheck, t: 'Verified astrologers', d: 'Profiles are reviewed before they are listed.' },
    { icon: Lock, t: 'Private & secure', d: 'Consultations are visible only to you. Payments run through Razorpay.' },
    { icon: Timer, t: 'Pay for time you choose', d: 'Fixed plans with a live timer. No surprise charges.' },
    { icon: Compass, t: 'Chat or call in the browser', d: 'Nothing to install. Works on phone and desktop.' },
  ];
  return (
    <section className="sky py-16">
      <div className="container-x">
        <Heading light title="Why choose SevenSpirit" sub="Straightforward pricing, real practitioners, and privacy by default." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white backdrop-blur">
              <Icon className="text-gold-300" size={26} />
              <h3 className="mt-3 text-2xl font-bold">{t}</h3>
              <p className="mt-1.5 text-sm text-white/70">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white py-16">
      {/* <div className="container-x">
        <Heading title="What our customers say" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-royal-100 bg-cream p-5">
              <Stars value={t.rating} size={16} />
              <blockquote className="mt-3 flex-1 text-sm text-slate-700">“{t.review}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <img src={t.image} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                <span className="text-sm font-semibold text-royal-900">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div> */}
    </section>
  );
}

export function FAQSection({ title = 'Frequently asked questions' }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-16">
      <div className="container-x max-w-3xl">
        <Heading title={title} />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-xl border border-royal-100 bg-white">
              <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-royal-900"
                aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}
                <ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-4 text-sm text-slate-600">{f.a}</motion.p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="px-4 pb-16 pt-4">
      <div className="sky container-x relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white">
        <h2 className="text-4xl font-bold sm:text-5xl">Ready to talk to an astrologer?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/75">Astrologers marked Online are available right now. Pick one and start in a couple of minutes.</p>
        <Link to="/astrologers?status=online" className="btn-gold mt-7 !px-8 !py-3 text-base">Talk to an Astrologer</Link>
      </div>
    </section>
  );
}
