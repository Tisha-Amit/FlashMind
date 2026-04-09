# FlashMind – README

## How to Start the App

### Easiest way (one click):
1. Open the `Flashcard website` folder
2. Right-click `start_backend.ps1`
3. Select **"Run with PowerShell"**

That's it — it will start both servers and open the browser automatically.

---

### Manual way (two terminals):

**Terminal 1 – Backend:**
```
cd "Flashcard website\backend"
python app.py
```
You should see: `Running on http://127.0.0.1:5000`

**Terminal 2 – Frontend:**
```
cd "Flashcard website\frontend"
npm run dev
```
You should see: `VITE v4... ready`

Then open: **http://localhost:5173**

---

## Common Issues

| Problem | Cause | Fix |
|---|---|---|
| "Address already in use" on port 5000 | Old Flask process still running | Run the launcher script — it kills old processes first |
| Registration fails | Backend isn't running | Make sure Terminal 1 shows `Running on http://127.0.0.1:5000` |
| Red squiggles in VS Code | IDE can't find Python venv | Reload VS Code window (Ctrl+Shift+P → "Reload Window") |
| 404 on `python app.py` | Running from wrong folder | Always `cd backend` first then `python app.py` |

---

## Tech Stack
- **Frontend:** React + Vite (port 5173)
- **Backend:** Flask + SQLite (port 5000)
- **AI:** Gemini 1.5 Flash
- **Auth:** JWT tokens
