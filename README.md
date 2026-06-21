# CampusShare — JNCT Bhopal

Centralized study resource portal for Jai Narain College of Technology.  
Upload, search and download notes, PYQs, assignments and lab manuals.

---

## Quick Start (Local)

### 1. Clone & Install

```bash
# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Firebase Setup

In **Firebase Console** (https://console.firebase.google.com):

1. Enable **Authentication** → Sign-in methods → Email/Password ✅ and Google ✅
2. Create **Firestore Database** (production mode)
3. Create **Storage** bucket
4. Deploy rules (see below)

### 3. Environment Variables

**frontend/.env** — already filled with your credentials.

**backend/.env** — already filled with your service account.

### 4. Deploy Firestore & Storage Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login

# From project root
firebase deploy --only firestore:rules,firestore:indexes
```

> **Note:** This project does NOT use Firebase Storage (which requires the paid Blaze plan). Files are stored as Base64 directly inside Firestore documents, capped at 700KB per file, so everything works on the free Spark plan.

### 5. Run Locally

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend && npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:5000

---

## Deploy to Vercel

### Frontend

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Set these environment variables in Vercel dashboard:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL=https://your-backend.vercel.app
VITE_ADMIN_EMAIL=akshratiwari425@gmail.com
```

### Backend

```bash
cd backend
vercel --prod
```

Set these environment variables in Vercel dashboard:
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_EMAIL=akshratiwari425@gmail.com
NODE_ENV=production
```

---

## Project Structure

```
campusshare/
├── frontend/                  # React + Vite + TailwindCSS
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── config/            # Firebase init, constants, RGPV subjects
│   │   ├── context/           # AuthContext (login, register, Google)
│   │   ├── services/          # Firestore CRUD, storage upload
│   │   ├── components/
│   │   │   ├── common/        # ResourceCard, StarRating, Spinner, EmptyState
│   │   │   ├── layout/        # Navbar, Footer, Layout
│   │   │   └── resources/     # SearchFilters
│   │   └── pages/             # All 8 pages
│   ├── vercel.json
│   └── .env
│
├── backend/                   # Node.js + Express
│   ├── config/firebase.js     # Admin SDK init
│   ├── middleware/auth.js      # Token verification
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── index.js               # Entry point
│   ├── vercel.json
│   └── .env
│
├── firestore.rules            # Firestore security rules
├── storage.rules              # Storage security rules
└── README.md
```

---

## Features

- Register / Login / Google OAuth
- Upload PDF + Images (max 20MB) with drag & drop
- RGPV syllabus subjects by branch + semester
- Browse with full-text search + filters
- PDF preview in browser
- Download tracking
- 1–5 star ratings
- Admin panel (manage resources + users, toggle admin role)
- Mobile responsive

## Admin Access

Sign in with **akshratiwari425@gmail.com** — automatically gets admin role.

---

## Tech Stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS       |
| Routing    | React Router v6                   |
| Backend    | Node.js, Express                  |
| Database   | Firebase Firestore                |
| Auth       | Firebase Auth (Email + Google)    |
| Storage    | Firebase Storage                  |
| Deployment | Vercel                            |
