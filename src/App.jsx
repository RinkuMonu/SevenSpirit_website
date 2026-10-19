import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMe, logout } from './store/authSlice.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ConsultProvider } from './components/ConsultProvider.jsx';
import Home from './pages/Home.jsx';
import Astrologers from './pages/Astrologers.jsx';
import AstrologerDetail from './pages/AstrologerDetail.jsx';
import { Services, About, Contact, FaqPage, Legal, NotFound } from './pages/Static.jsx';
import { Login, Register, ForgotPassword, ResetPassword } from './pages/Auth.jsx';
import Chat from './pages/Chat.jsx';
import Call from './pages/Call.jsx';
import MyConsultations from './pages/MyConsultations.jsx';

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(fetchMe());
    const expired = () => { dispatch(logout()); navigate('/login', { state: { expired: true } }); };
    window.addEventListener('auth:expired', expired);
    return () => window.removeEventListener('auth:expired', expired);
  }, [dispatch, navigate]);

  return (
    <ConsultProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/astrologers" element={<Astrologers />} />
            <Route path="/astrologer/:slug" element={<AstrologerDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/refund" element={<Legal kind="refund" />} />
            <Route path="/disclaimer" element={<Legal kind="disclaimer" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/call/:id" element={<ProtectedRoute><Call /></ProtectedRoute>} />
            <Route path="/my-consultations" element={<ProtectedRoute><MyConsultations /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ConsultProvider>
  );
}
