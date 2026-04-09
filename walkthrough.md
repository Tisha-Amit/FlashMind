# FlashMind – Build Walkthrough ✅

## What Was Built

A full-stack flashcard learning system: **React + Vite frontend** + **Flask REST API backend** + **SQLite database** + **Gemini AI generation**.

---

## File Structure

```
Flashcard website/
├── backend/
│   ├── app.py              # Flask app factory (CORS, JWT, SQLAlchemy)
│   ├── models.py           # User + Flashcard SQLAlchemy models
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Gemini API key + secrets
│   ├── routes/
│   │   ├── auth.py         # Register, Login, Me endpoints
│   │   ├── flashcards.py   # Full CRUD, scoped to user
│   │   └── ai_generate.py  # Gemini AI → Q&A flashcards
│   └── tests/
│       └── test_api.py     # 11 pytest smoke tests
│
└── frontend/
    └── src/
        ├── index.css           # Pastel design system (Nunito font)
        ├── App.jsx             # Router + auth guards
        ├── main.jsx            # React entry point
        ├── api/api.js          # Axios helper with JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── PrivateRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Flashcards.jsx    # Flip-card study mode
            ├── CreateFlashcard.jsx
            └── AiGenerate.jsx
```

---

## Test Results

### Pytest (11/11 passed ✅)
| Test | Result |
|---|---|
| Register success | ✅ |
| Register duplicate email | ✅ |
| Register missing fields | ✅ |
| Login success | ✅ |
| Login wrong password | ✅ |
| Login nonexistent user | ✅ |
| Create flashcard | ✅ |
| List flashcards | ✅ |
| Create missing fields | ✅ |
| Unauthorized access | ✅ |
| Delete flashcard | ✅ |

### Browser Smoke Test (All steps passed ✅)
| Step | Result |
|---|---|
| Navigate → auto-redirects to /login | ✅ |
| Register new account → lands on /dashboard | ✅ |
| Dashboard shows greeting + stats | ✅ |
| Create flashcard → success message | ✅ |
| Study page → card flip animation | ✅ |
| AI Generate → Gemini returns Q&A cards | ✅ |
| Save AI card → confirmation | ✅ |
| Logout → redirects to /login | ✅ |

---

## Browser Recording

![FlashMind full smoke test](file:///C:/Users/Tisha/.gemini/antigravity/brain/ea60d4f9-0407-430f-9e28-43a1d0ee43f5/flashmind_final_test_1775720788307.webp)

---

## How to Run

### Backend
```powershell
cd "Flashcard website\backend"
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```powershell
cd "Flashcard website\frontend"
npm install
npm run dev
# Runs on http://localhost:5173
```

Then open http://localhost:5173 in your browser.

---

## Key Design Decisions

- **`db` lives in [models.py](file:///c:/Users/Tisha/OneDrive/Desktop/Flashcard%20website/backend/models.py)** (not [app.py](file:///c:/Users/Tisha/OneDrive/Desktop/Flashcard%20website/backend/app.py)) — prevents Flask-SQLAlchemy app context errors when blueprints import it
- **React Router v6** (not v7) — required for Node v16 compatibility
- **Gemini `gemini-1.5-flash`** model with regex fallback if API fails
- **JWT tokens** stored in `localStorage`, attached via Axios interceptor
