# GitHub Actions — Secrets Setup

After pushing to GitHub, add these secrets in:
**GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

---

## Firebase Secrets

| Secret Name | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCcuHQpZABIyrW6b2PNFwRIU09PGnsT8rU` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `campusshare-36583.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `campusshare-36583` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `campusshare-36583.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `421495219435` |
| `VITE_FIREBASE_APP_ID` | `1:421495219435:web:100600ff0f3024d4a40aae` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-5PNZH6JYX2` |
| `VITE_ADMIN_EMAIL` | `akshratiwari425@gmail.com` |

## Firebase CLI Token (for rule deployment)

Run this locally once:
```
firebase login:ci
```
Copy the token it prints. Add as:
| `FIREBASE_TOKEN` | (token from above command) |

## Vercel Secrets

1. Go to https://vercel.com/account/tokens → Create token → Copy it
   | `VERCEL_TOKEN` | (your token) |

2. Get your Org ID:
   - Go to https://vercel.com → Settings → General → copy **Team ID** (or your personal Org ID)
   | `VERCEL_ORG_ID` | (your org/team ID) |

3. Get Frontend Project ID:
   - Go to your frontend Vercel project → Settings → General → copy **Project ID**
   | `VERCEL_FRONTEND_PROJECT_ID` | (frontend project ID) |

4. Get Backend Project ID:
   - Go to your backend Vercel project → Settings → General → copy **Project ID**
   | `VERCEL_BACKEND_PROJECT_ID` | (backend project ID) |

## Cloudinary Secrets

| `VITE_CLOUDINARY_CLOUD_NAME` | (your Cloudinary cloud name) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `campusshare_unsigned` |

## Backend/API URL

| `VITE_API_URL` | `https://your-backend.vercel.app` |

---

## How the CI/CD pipeline works

```
git push → GitHub Actions triggers
    ├── Job 1: Frontend lint + build (always, on push + PRs)
    ├── Job 2: Backend install + validate (always, on push + PRs)
    └── On main branch push (if jobs 1+2 pass):
        ├── Job 3: Deploy frontend → Vercel
        ├── Job 4: Deploy backend → Vercel
        └── Job 5: Deploy Firestore rules + indexes → Firebase
```

**Pull Requests:** Only jobs 1 & 2 run (lint + build check). No deploy.
**Push to main:** All 5 jobs run. Full auto-deploy on every `git push`.
