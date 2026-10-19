import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner.jsx';

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!initialized) return <Spinner full />;
  if (!user) return <Navigate to="/login" replace state={{ from: { pathname: location.pathname, search: location.search } }} />;
  return children;
}
