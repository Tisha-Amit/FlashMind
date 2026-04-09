import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="text-center">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
          <p className="text-muted">Loading FlashMind…</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
