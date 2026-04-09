import { useState } from 'react';
import { flashcardApi } from '../api/api';

const INITIAL = { question: '', answer: '', subject: '', difficulty: 'Medium' };

export default function CreateFlashcard() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.question.trim() || !form.answer.trim()) {
      setError('Question and answer are required.');
      return;
    }

    setLoading(true);
    try {
      await flashcardApi.create(form);
      setSuccess('Flashcard saved successfully! 🎉');
      setForm(INITIAL);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save flashcard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-in-up" style={{ maxWidth: 640 }}>
      <div className="mb-3">
        <h1>Create Flashcard ✍️</h1>
        <p className="text-muted">Add a new question-answer pair to your collection.</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && <div className="alert alert-error mb-2">⚠️ {error}</div>}
        {success && <div className="alert alert-success mb-2">✅ {success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="question">Question</label>
            <textarea
              id="question"
              className="input-field"
              name="question"
              placeholder="Enter your question here…"
              value={form.question}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="answer">Answer</label>
            <textarea
              id="answer"
              className="input-field"
              name="answer"
              placeholder="Enter the answer here…"
              value={form.answer}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                className="input-field"
                type="text"
                name="subject"
                placeholder="e.g. Biology"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                className="input-field"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? <><span className="spinner"></span> Saving…</> : '💾 Save Flashcard'}
          </button>
        </form>
      </div>
    </div>
  );
}
