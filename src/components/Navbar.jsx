import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, History, LogOut, Menu, Sparkles, UserCircle, X } from 'lucide-react';
import { logout } from '../store/authSlice.js';

const LINKS = [['/', 'Home'], ['/astrologers', 'Astrologers'], ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact']];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);

  const doLogout = () => { dispatch(logout()); navigate('/'); };
  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'text-gold-300' : 'text-white/80 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <Sparkles className="text-gold-400" size={22} /> SevenSpirit
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>)}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} aria-expanded={menu}
                className="flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10">
                <UserCircle size={20} className="text-gold-300" /> {user.name.split(' ')[0]} <ChevronDown size={14} />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-soft ring-1 ring-black/5">
                  <div className="border-b px-4 py-2 text-xs text-slate-500">{user.email}</div>
                  <Link to="/my-consultations" className="flex items-center gap-2 px-4 py-2.5 hover:bg-royal-50"><History size={16} /> My Consultations</Link>
                  <button onClick={doLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-royal-50"><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-gold !py-2">Login</Link>
          )}
        </div>

        <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-night px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            {LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>)}
          </nav>
          {user ? (
            <div className="space-y-2 border-t border-white/10 pt-3">
              <Link to="/my-consultations" className="btn-light w-full">My Consultations</Link>
              <button onClick={doLogout} className="btn-gold w-full">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-gold w-full">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
