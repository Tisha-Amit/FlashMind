import { useState } from 'react';
import { aiApi, flashcardApi } from '../api/api';

export default function AiGenerate() {
  const [text, setText] = useState('');
  const [cards, setCards] = useState([]);
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setError('');
    if (!text.trim() || text.trim().length < 30) {
      setError('Please paste at least 30 characters of notes or content.');
      return;
    }
    setLoading(true);
    setCards([]);
    setSaved({});
    setGenerated(false);
    try {
      const res = await aiApi.generate(text);
      setCards(res.data.flashcards);
      setGenerated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (card, idx) => {
    setSaving(s => ({ ...s, [idx]: true }));
    try {
      await flashcardApi.create({
        question: card.question,
        answer: card.answer,
        subject: 'AI Generated',
        difficulty: 'Medium',
      });
      setSaved(s => ({ ...s, [idx]: true }));
    } catch {
      // silently ignore
    } finally {
      setSaving(s => ({ ...s, [idx]: false }));
    }
  };

  const handleSaveAll = async () => {
    const unsaved = cards.filter((_, i) => !saved[i]);
    for (let i = 0; i < unsaved.length; i++) {
      const idx = cards.indexOf(unsaved[i]);
      await handleSave(unsaved[i], idx);
    }
  };

  return (
    <div className="page-content fade-in-up" style={{ maxWidth: 720 }}>
      <div className="mb-3">
        <h1>AI Flashcard Generator ✨</h1>
        <p className="text-muted">Paste your notes below and let AI create flashcards for you instantly.</p>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        {error && <div className="alert alert-error mb-2">⚠️ {error}</div>}

        <div className="input-group mb-2">
          <label className="input-label" htmlFor="notes">Your Notes</label>
          <textarea
            id="notes"
            className="input-field"
            placeholder="Paste your study notes, textbook content, or any text here…"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ minHeight: 200 }}
          />
          <span className="text-muted" style={{ fontSize: '0.8rem', alignSelf: 'flex-end' }}>
            {text.length} characters
          </span>
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner"></span> Generating with AI…</>
            : '✨ Generate Flashcards'}
        </button>
      </div>

      {/* Results */}
      {generated && cards.length === 0 && (
        <div className="alert alert-info">No flashcards could be generated. Try providing more detailed notes.</div>
      )}

      {cards.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2>{cards.length} cards generated 🎉</h2>
            <button className="btn btn-mint btn-sm" onClick={handleSaveAll}>
              Save All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cards.map((card, i) => (
              <div key={i} className="preview-card" style={{ animation: `fadeInUp 0.35s ease ${i * 0.06}s both` }}>
                <div className="preview-q">
                  <span>Question</span>
                  {card.question}
                </div>
                <div className="preview-a">
                  <span>Answer</span>
                  {card.answer}
                </div>
                <div>
                  {saved[i] ? (
                    <span className="alert alert-success" style={{ padding: '4px 12px', display: 'inline-flex' }}>
                      ✅ Saved!
                    </span>
                  ) : (
                    <button
                      className="btn btn-mint btn-sm"
                      onClick={() => handleSave(card, i)}
                      disabled={saving[i]}
                    >
                      {saving[i] ? '…' : '💾 Save'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
