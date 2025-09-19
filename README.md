<<<<<<< HEAD
# brightlife
"BrightLife – A digital learning platform for rural students with study material, AI tutor, quizzes, and progress tracking."
=======
# Bright Life – Nabha Rural Student Portal

Starter workspace for the Bright Life educational app (Expo React Native + Firebase Functions).


## AI provider options

The backend supports HuggingFace Inference API by default (set `HUGGINGFACE_API_KEY` in `functions/.env`).

Optionally you can use SambaNova Cloud's API — set these environment variables in `functions/.env`:

```
SAMBANOVA_API_KEY=your_sambanova_api_key_here
SAMBANOVA_ENDPOINT=https://cloud.sambanova.ai/apis/your-endpoint
```

The server will prefer HuggingFace when `HUGGINGFACE_API_KEY` is present. If missing and SambaNova variables are set, it will call the SambaNova endpoint instead.

Please check SambaNova API docs for the exact expected request and response formats if you encounter errors; adjust `functions/aiProxy.js` accordingly.

Structure
- `client/` — Expo app (mobile + web)
- `functions/` — Node Express functions (AI proxy, sample endpoints)

Quick start (PowerShell)

1. Ensure Node.js and npm are installed:
```powershell
node -v
npm -v
```

2. Backend (functions):
```powershell
cd functions
npm install
# copy .env.example to .env and set HUGGINGFACE_API_KEY or SambaNova keys
npm run start
```

3. Frontend (client):
```powershell
cd client
npm install
npx expo start --tunnel
```

Files to configure:
- `functions/.env` — set `HUGGINGFACE_API_KEY` and/or `SAMBANOVA_API_KEY` + `SAMBANOVA_ENDPOINT`.
- `client/firebaseConfig.js` — set your Firebase project config.

This is a minimal scaffold. Next steps: implement lesson pages, offline sync, and E2E testing.
>>>>>>> f77b3cc (Initial commit)
