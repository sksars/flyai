# MyAI — Offline Multilingual Chatbot

MyAI is a serverless, offline-capable multilingual AI chatbot built with **pure HTML, CSS, and JavaScript** (`index.html`, `src/styles.css`, `src/app.js`, `src/knowledge.js`, `src/research.js`).

## Features

- **Serverless & Offline-Ready**: Runs 100% in the browser with `localStorage` persistence for chats, preferences, custom offline memory, and learned browser knowledge.
- **Multilingual UI & Replies**: Supports English, हिन्दी (Hindi), Hinglish, Español, Français, and العربية (RTL).
- **Voice Input & Text-to-Speech**: Uses the Web Speech API (`SpeechRecognition` & `speechSynthesis`) with Hindi voice resilience and phonetic speech fallback.
- **Browser Research + Auto-Learning**: Searches live browser-accessible encyclopedia & dictionary APIs when online, remembers active conversation topics across follow-up turns, and automatically saves learned summaries into `localStorage` for offline reuse.
- **Responsive Design**: ChatGPT-style splash screen, collapsible desktop sidebar, mobile drawer navigation, and light/dark themes.

## Local Development

```bash
npm install
npm run dev
```

Or serve the root directory directly with any static file server since `index.html` and `src/` use standard browser ES modules.

## Deploy to GitHub Pages

### Option 1: GitHub Actions (Recommended)
1. Push this repository to GitHub on the `main` branch.
2. Go to **Repository Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow builds `dist/` and deploys automatically on every push to `main`.

### Option 2: Direct Branch Deploy (Zero Build)
1. Push this repository to GitHub on the `main` branch.
2. Go to **Repository Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch** → select `main` and `/ (root)`.
4. Save — GitHub Pages serves `index.html` and `./src/*` directly.

## Google AdSense Compliance Setup

MyAI includes standalone static pages (`about.html`, `privacy-policy.html`, `terms.html`, `contact.html`), an interactive cookie/privacy consent notice, `public/robots.txt`, and `public/ads.txt`. Before submitting your domain for AdSense review:

1. Replace `pub-0000000000000000` inside `public/ads.txt` with your real Google AdSense Publisher ID and uncomment the line.
2. Update the support email placeholder (`contact@myai-assistant.example`) in `contact.html` and `src/legal.js` with your real publisher email address.
3. Add your AdSense verification `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>` snippet in `<head>` once your custom domain or GitHub Pages URL is ready.

