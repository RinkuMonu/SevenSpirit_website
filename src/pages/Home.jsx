import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import api from '../api/axios.js';
import Seo from '../components/Seo.jsx';
import ZodiacWheel from '../components/ZodiacWheel.jsx';
import AstrologerCard from '../components/AstrologerCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { CTA, FAQSection, HowItWorks, ServicesGrid, Testimonials, WhyUs } from '../components/HomeSections.jsx';
import { SITE_URL } from '../api/axios.js';

export default function Home() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/astrologers/featured').then((r) => setList(r.data.data)).catch(() => setList([])); }, []);

  return (
    <>
      <Seo
        description="Chat or call verified astrologers online for love, marriage, career and business guidance. Choose a plan, pay securely with Razorpay and start instantly."
        path="/"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'SevenSpirit', url: SITE_URL }}
      />

      <section className="sky relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">Connect With Trusted Astrologers</h1>
            <p className="mt-5 max-w-lg text-lg text-white/80">Get personalized guidance from experienced astrologers through private chat and calls.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/astrologers?status=online" className="btn-gold !px-6 !py-3 text-base"><MessageCircle size={18} /> Talk to an Astrologer</Link>
              <Link to="/astrologers" className="btn-light !px-6 !py-3 text-base"><Search size={18} /> Explore Astrologers</Link>
            </div>
            <p className="mt-6 text-sm text-white/60">Pay only for the minutes you choose — 10, 30 or 60.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="mx-auto w-full max-w-md lg:max-w-lg">
            <ZodiacWheel />
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-royal-900 sm:text-5xl">Featured astrologers</h2>
            <p className="mt-3 text-slate-600">Top-rated, verified and ready to talk.</p>
          </div>
          {list === null ? <Spinner /> : list.length === 0 ? (
            <p className="text-center text-slate-500">No astrologers to show yet. Run <code>npm run seed:astrologers</code> on the server.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a, i) => <AstrologerCard key={a._id} a={a} index={i} />)}
            </div>
          )}
          <div className="mt-10 text-center"><Link to="/astrologers" className="btn-royal">View all astrologers</Link></div>
        </div>
      </section>

      <HowItWorks />
      <ServicesGrid />
      <WhyUs />
      <Testimonials />
      <FAQSection />
      <CTA />
    </>
  );
}
