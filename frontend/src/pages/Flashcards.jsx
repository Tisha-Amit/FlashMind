import { useEffect, useState } from 'react';
import { flashcardApi } from '../api/api';

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardsRes, subjectsRes] = await Promise.all([
          flashcardApi.list(),
          flashcardApi.subjects(),
        ]);
        setCards(cardsRes.data.flashcards);
        setSubjects(subjectsRes.data.subjects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = activeSubject === 'All'
    ? cards
    : cards.filter(c => c.subject === activeSubject);

  const current = filtered[currentIdx];
  const total = filtered.length;

  const handleFlip = () => setFlipped(f => !f);

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIdx(i => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIdx(i => Math.min(total - 1, i + 1));
  };

  const handleSubject = (s) => {
    setActiveSubject(s);
    setCurrentIdx(0);
    setFlipped(false);
  };

  const difficultyBadge = (d) => {
    const map = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
    return <span className={`badge ${map[d] || 'badge-medium'}`}>{d}</span>;
  };

  if (loading) return (
    <div className="page-content text-center" style={{ paddingTop: '6rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎴</div>
      <p className="text-muted">Loading your flashcards…</p>
    </div>
  );

  return (
    <div className="page-content fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h1>Study Mode 🎴</h1>
        {total > 0 && (
          <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
            {currentIdx + 1} / {total}
          </span>
        )}
      </div>

      {/* Subject Filter */}
      <div className="subject-filter mb-3">
        <button
          className={`subject-chip ${activeSubject === 'All' ? 'active' : ''}`}
          onClick={() => handleSubject('All')}
        >
          All
        </button>
        {subjects.map(s => (
          <button
            key={s}
            className={`subject-chip ${activeSubject === s ? 'active' : ''}`}
            onClick={() => handleSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🃏</div>
          <h3>No flashcards yet</h3>
          <p>Create some cards or use the AI generator to get started!</p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="progress-bar-wrap mb-3">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <div className="flashcard-scene" onClick={handleFlip}>
            <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-label">Question</div>
                <div className="flashcard-text">{current?.question}</div>
                <div className="flashcard-hint">Click to reveal answer</div>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-label">Answer</div>
                <div className="flashcard-text">{current?.answer}</div>
                {current?.difficulty && (
                  <div style={{ marginTop: '1rem' }}>{difficultyBadge(current.difficulty)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-3" style={{ maxWidth: 580, margin: '1.5rem auto 0' }}>
            <button
              className="btn btn-ghost"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleFlip}
            >
              {flipped ? 'Show Question' : 'Show Answer'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentIdx === total - 1}
            >
              Next →
            </button>
          </div>

          {/* Subject & difficulty info */}
          {current && (
            <div className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              📂 {current.subject} &nbsp;·&nbsp; {difficultyBadge(current.difficulty)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
