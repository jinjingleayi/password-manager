# Password Manager (Vue 3 + Vite + Element Plus)

A simple, local-first password manager built with Vue 3, Pinia, Element Plus, and Vite. Data is encrypted at-rest and stored in the browser via localStorage. Includes password generation, copy helpers with mobile fallbacks, and responsive design.

## Demo
https://github.com/user-attachments/assets/0c2785f0-90f8-482f-b74f-468606fb5e80

## Features

- URL-required entries with title, username, password
- Click “生成” in Add/Edit to generate a strong password and auto-copy
- Clipboard helper with fallback for mobile (shows password if copy fails)
- Edit entry by clicking the website title; delete with confirmation
- Display shows website hostname (or title/unknown), hide/show username, copy username
- AES encryption at rest (local-only demo secret)
- Responsive layout (mobile-friendly)

## Quick Start

Prerequisites: Node 18+

Install dependencies:
```bash
npm install
```

Start dev server:
```bash
npm run dev
```

Open the Local URL that Vite prints (e.g. http://localhost:5173 or 5174).

### Use on your phone (same Wi‑Fi)
```bash
npm run dev -- --host
```
Open the Network URL on your phone’s browser (http://<your-ip>:5173).

Notes: Mobile clipboard over HTTP may be restricted. The app falls back to showing the generated password for manual copy when needed.

## Build & Preview

Build production assets:
```bash
npm run build
```

Preview locally:
```bash
npm run preview -- --host
```

## How It Works

- State: Pinia stores entries in `src/store/passwords.js`
- Crypto: AES via `crypto-js` in `src/utils/crypto.js`
- Clipboard: robust helper with fallback in `src/utils/clipboard.js`
- Persistence: encrypted JSON saved to localStorage
- UI: Element Plus components; global size set to small
- Routing: `/login` → `/passwords`

## Key UX Details

- “新增条目”: URL is required. Title auto-fills from URL hostname; falls back to `unknown` if not provided.
- “生成密码” (toolbar): generates and copies a password for general use.
- “生成” (in dialog): generates into the password field and copies.
- List entries show website (hostname/title), hidden username with Show/Hide toggle, copy-username, masked password field with copy button, and delete.

## Security Notes

- This is a demo. The encryption secret is a fixed local string for convenience. Do not use for sensitive production data without adding:
  - A real user auth flow and per-user secrets
  - Deriving keys from a master password
  - Secure storage and sync

## Tech Stack

- Vue 3, Vite, Pinia, Vue Router
- Element Plus UI, CryptoJS

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## License

MIT
