#!/bin/bash

set -e

BLUE='\033[0;34m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    CampusShare — Deploy to Vercel    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Installing Vercel CLI...${NC}"
  npm install -g vercel
fi

# ── Deploy Backend ────────────────────────────────────────────────────────────
echo -e "${YELLOW}▶ Deploying BACKEND...${NC}"
cd backend

BACKEND_URL=$(vercel --prod --yes 2>&1 | grep "Production:" | awk '{print $2}')

if [ -z "$BACKEND_URL" ]; then
  echo -e "${YELLOW}  Could not auto-detect backend URL.${NC}"
  echo -e "  Please paste your backend Vercel URL (e.g. https://campusshare-api.vercel.app):"
  read -r BACKEND_URL
fi

echo -e "${GREEN}✓ Backend deployed: ${BACKEND_URL}${NC}"

# Set backend env vars
echo -e "${YELLOW}  Setting backend environment variables...${NC}"
vercel env add FIREBASE_PROJECT_ID production <<< "campusshare-36583" 2>/dev/null || true
vercel env add FIREBASE_CLIENT_EMAIL production <<< "firebase-adminsdk-fbsvc@campusshare-36583.iam.gserviceaccount.com" 2>/dev/null || true
vercel env add NODE_ENV production <<< "production" 2>/dev/null || true
vercel env add ADMIN_EMAIL production <<< "akshratiwari425@gmail.com" 2>/dev/null || true

echo -e "${YELLOW}  ⚠ IMPORTANT: Add FIREBASE_PRIVATE_KEY and FRONTEND_URL manually in Vercel dashboard${NC}"
echo -e "    → https://vercel.com/dashboard → campusshare-backend → Settings → Environment Variables"

cd ..

# ── Deploy Frontend ───────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}▶ Deploying FRONTEND...${NC}"
cd frontend

# Patch API URL in .env to point to deployed backend
if [ -f ".env" ]; then
  sed -i.bak "s|VITE_API_URL=.*|VITE_API_URL=${BACKEND_URL}|g" .env
  echo -e "${GREEN}  ✓ Patched VITE_API_URL → ${BACKEND_URL}${NC}"
fi

FRONTEND_URL=$(vercel --prod --yes 2>&1 | grep "Production:" | awk '{print $2}')

if [ -z "$FRONTEND_URL" ]; then
  echo -e "${YELLOW}  Could not auto-detect frontend URL.${NC}"
  echo -e "  Please paste your frontend Vercel URL:"
  read -r FRONTEND_URL
fi

echo -e "${GREEN}✓ Frontend deployed: ${FRONTEND_URL}${NC}"

# Set frontend env vars
echo -e "${YELLOW}  Setting frontend environment variables...${NC}"
vercel env add VITE_FIREBASE_API_KEY production <<< "AIzaSyCcuHQpZABIyrW6b2PNFwRIU09PGnsT8rU" 2>/dev/null || true
vercel env add VITE_FIREBASE_AUTH_DOMAIN production <<< "campusshare-36583.firebaseapp.com" 2>/dev/null || true
vercel env add VITE_FIREBASE_PROJECT_ID production <<< "campusshare-36583" 2>/dev/null || true
vercel env add VITE_FIREBASE_STORAGE_BUCKET production <<< "campusshare-36583.firebasestorage.app" 2>/dev/null || true
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production <<< "421495219435" 2>/dev/null || true
vercel env add VITE_FIREBASE_APP_ID production <<< "1:421495219435:web:100600ff0f3024d4a40aae" 2>/dev/null || true
vercel env add VITE_ADMIN_EMAIL production <<< "akshratiwari425@gmail.com" 2>/dev/null || true
vercel env add VITE_API_URL production <<< "${BACKEND_URL}" 2>/dev/null || true

cd ..

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🚀  Deployment complete!                                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Frontend :${NC} ${FRONTEND_URL}"
echo -e "  ${BLUE}Backend  :${NC} ${BACKEND_URL}"
echo ""
echo -e "  ${YELLOW}⚠ Manual steps remaining in Vercel dashboard:${NC}"
echo -e "     1. Add FIREBASE_PRIVATE_KEY to backend env vars"
echo -e "        (copy the full key from backend/.env)"
echo -e "     2. Add FRONTEND_URL=${FRONTEND_URL} to backend env vars"
echo -e "     3. Redeploy backend after adding those vars"
echo ""
echo -e "  ${BLUE}Firebase Console:${NC}"
echo -e "     Add ${FRONTEND_URL} to Authorized Domains:"
echo -e "     Authentication → Settings → Authorized domains → Add domain"
echo ""
