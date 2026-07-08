# Backend for AI Mind Reader (simple parser)

This folder contains a minimal Express backend that exposes:

- `POST /api/parse-task` — accepts `{ text }` and returns a parsed task JSON.

To run locally:

```bash
cd backend
npm install
npm start
```

Set this URL as `VITE_API_URL` in the frontend (e.g. `http://localhost:5000/api`).
