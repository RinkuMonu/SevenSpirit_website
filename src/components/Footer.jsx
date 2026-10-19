import { Link } from 'react-router-dom';
import { Facebook, Instagram, Sparkles, Twitter, Youtube } from 'lucide-react';

const COL = (title, items) => (
  <div>
    <h4 className="mb-3 font-sans text-sm font-semibold text-gold-300">{title}</h4>
    <ul className="space-y-2 text-sm text-white/70">
      {items.map(([to, label]) => <li key={to}><Link to={to} className="hover:text-white">{label}</Link></li>)}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="sky text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold"><Sparkles className="text-gold-400" size={22} /> SevenSpirit</Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">Private chat and call consultations with experienced astrologers, from anywhere.</p>
          <div className="mt-4 flex gap-3">
            {[[Facebook, 'Facebook'], [Instagram, 'Instagram'], [Twitter, 'Twitter'], [Youtube, 'YouTube']].map(([Icon, label]) => (
              <a key={label} href="#" aria-label={label} className="rounded-full border border-white/20 p-2 text-white/80 hover:bg-white/10"><Icon size={16} /></a>
            ))}
          </div>
        </div>
        {COL('Explore', [['/about', 'About'], ['/astrologers', 'Astrologers'], ['/services', 'Services'], ['/contact', 'Contact']])}
        {COL('Policies', [['/terms', 'Terms & Conditions'], ['/privacy', 'Privacy Policy'], ['/refund', 'Refund Policy'], ['/disclaimer', 'Disclaimer']])}
        {COL('Help', [['/faq', 'FAQ'], ['/login', 'Login'], ['/register', 'Create account']])}
        {COL('Legal', [['/cancellation', 'Cancellation Policy']])}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} SevenSpirit. Astrology is offered for guidance and entertainment and is not a substitute for professional medical, legal or financial advice.
      </div>
    </footer>
  );
}
