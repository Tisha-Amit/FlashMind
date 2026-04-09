import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span>🧠</span> FlashMind
      </Link>
      <div className="navbar-actions">
        {user && (
          <>
            <Link to="/flashcards" className="btn btn-ghost btn-sm">Study</Link>
            <Link to="/create" className="btn btn-secondary btn-sm">+ Create</Link>
            <Link to="/ai-generate" className="btn btn-sm" style={{ background: 'var(--lavender-light)', color: 'var(--text)' }}>
              ✨ AI Generate
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
