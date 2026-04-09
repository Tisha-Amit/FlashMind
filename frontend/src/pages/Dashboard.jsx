import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flashcardApi } from '../api/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cardsRes, subjectsRes] = await Promise.all([
          flashcardApi.list(),
          flashcardApi.subjects(),
        ]);
        setStats({
          total: cardsRes.data.flashcards.length,
          subjects: subjectsRes.data.subjects.length,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-content fade-in-up" style={{ paddingTop: '2.5rem' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '0.25rem' }}>
          {greeting()}, {user?.username} 👋
        </h1>
        <p className="text-muted">Ready to learn something new today?</p>
      </div>

      {/* Stats */}
      <div className="grid-2 mb-3">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--pink-light)' }}>📚</div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.total}</div>
            <div className="stat-label">Total Flashcards</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--blue-light)' }}>📂</div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.subjects}</div>
            <div className="stat-label">Subjects</div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Actions */}
      <h2 className="mb-2">What would you like to do?</h2>
      <div className="grid-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <ActionCard
          icon="✍️"
          title="Create Flashcard"
          desc="Manually add a new question & answer card."
          to="/create"
          color="var(--pink-light)"
          btn="Create"
          btnClass="btn-primary"
        />
        <ActionCard
          icon="🎴"
          title="Study Flashcards"
          desc="Flip through your saved cards at your own pace."
          to="/flashcards"
          color="var(--blue-light)"
          btn="Start Studying"
          btnClass="btn-secondary"
        />
        <ActionCard
          icon="✨"
          title="AI Generator"
          desc="Paste your notes and let AI create cards for you."
          to="/ai-generate"
          color="var(--lavender-light)"
          btn="Generate"
          btnClass="btn-ghost"
        />
      </div>

      {/* Tips */}
      {stats.total === 0 && !loading && (
        <div className="alert alert-info mt-2">
          💡 <strong>Tip:</strong> Start by creating your first flashcard or try the AI generator!
        </div>
      )}
    </div>
  );
}

function ActionCard({ icon, title, desc, to, color, btn, btnClass }) {
  return (
    <div className="card" style={{ padding: '1.5rem', transition: 'all 0.25s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 12, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', marginBottom: '1rem'
      }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.4rem' }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>{desc}</p>
      <Link to={to} className={`btn ${btnClass} btn-sm`}>{btn} →</Link>
    </div>
  );
}
