import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, MessageCircle, Phone, Users } from 'lucide-react';
import Avatar from './Avatar.jsx';
import StatusBadge from './StatusBadge.jsx';
import { Stars } from './StarRating.jsx';
import { useConsult } from './ConsultProvider.jsx';
import { rupee } from '../utils.js';

export default function AstrologerCard({ a, index = 0 }) {
  const { start } = useConsult();
  const online = a.onlineStatus === 'ONLINE';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-royal-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <Link to={`/astrologer/${a.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-royal-100">
        <Avatar src={a.profileImage} name={a.name} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
        <StatusBadge status={a.onlineStatus} className="absolute left-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-1.5 text-2xl font-bold leading-tight text-royal-900">
              {a.name}
              {a.isVerified && <BadgeCheck size={18} className="text-sky-500" aria-label="Verified" />}
            </h3>
            <p className="text-sm text-slate-600">{a.title}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars value={a.rating} />
          <span className="font-semibold">{a.rating.toFixed(1)}</span>
          <span className="text-slate-500">({a.reviewCount.toLocaleString('en-IN')})</span>
        </div>

        <p className="mt-2 text-sm text-slate-600">{a.experience} years experience</p>
        <p className="mt-0.5 text-sm text-slate-600">{a.languages.join(', ')}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Users size={13} /> {a.totalConsultations.toLocaleString('en-IN')} consultations</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.specialization.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
        </div>

        <div className="mt-3 flex gap-4 border-t pt-3 text-sm">
          <span>Chat from <b className="text-royal-800">{rupee(a.chatPrice10Min)}</b></span>
          <span>Call from <b className="text-royal-800">{rupee(a.callPrice10Min)}</b></span>
        </div>

        <div className="mt-auto space-y-2 pt-4">
          {online ? (
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-gold" onClick={() => start(a, 'CHAT')}><MessageCircle size={16} /> Chat Now</button>
              <button className="btn-royal" onClick={() => start(a, 'CALL')}><Phone size={16} /> Call Now</button>
            </div>
          ) : (
            <div>
              <button className="btn-outline w-full" disabled>{a.onlineStatus === 'BUSY' ? 'Currently Busy' : 'Currently Offline'}</button>
              <p className="mt-1 text-center text-xs text-slate-500">Try Again Later</p>
            </div>
          )}
          <Link to={`/astrologer/${a.slug}`} className="block text-center text-sm font-medium text-royal-700 hover:underline">View Profile</Link>
        </div>
      </div>
    </motion.article>
  );
}
