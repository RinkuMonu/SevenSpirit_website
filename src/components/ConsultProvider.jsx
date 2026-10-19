import { createContext, useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './CheckoutModal.jsx';

const Ctx = createContext(null);
export const useConsult = () => useContext(Ctx);

/**
 * start(astrologer, 'CHAT'|'CALL', duration?)
 *  - logged out -> /login, remembering astrologer + type + duration so we return to the same page
 *  - logged in  -> opens the plan/checkout modal directly (no dashboard in between)
 */
export function ConsultProvider({ children }) {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  const start = useCallback((astrologer, type, duration) => {
    if (astrologer.onlineStatus !== 'ONLINE') return;
    if (!user) {
      const qs = `?action=${type.toLowerCase()}${duration ? `&duration=${duration}` : ''}`;
      navigate('/login', { state: { from: { pathname: `/astrologer/${astrologer.slug}`, search: qs }, intent: { name: astrologer.name, type } } });
      return;
    }
    setSession({ astrologer, type, duration });
  }, [user, navigate]);

  return (
    <Ctx.Provider value={{ start }}>
      {children}
      {session && <CheckoutModal {...session} onClose={() => setSession(null)} />}
    </Ctx.Provider>
  );
}
