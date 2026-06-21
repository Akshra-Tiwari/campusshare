#!/bin/bash

set -e

BLUE='\033[0;34m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      CampusShare Setup Script        ║${NC}"
echo -e "${BLUE}║      JNCT Bhopal                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org (v18+)${NC}"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}✗ Node.js v18+ required. Current: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

echo ""
echo -e "${YELLOW}▶ Installing frontend dependencies...${NC}"
cd frontend
npm install --silent
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo -e "${YELLOW}▶ Installing backend dependencies...${NC}"
cd ../backend
npm install --silent
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..

echo ""
echo -e "${YELLOW}▶ Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
  echo -e "${YELLOW}  Firebase CLI not found. Installing globally...${NC}"
  npm install -g firebase-tools --silent
  echo -e "${GREEN}✓ Firebase CLI installed${NC}"
else
  echo -e "${GREEN}✓ Firebase CLI $(firebase --version)${NC}"
fi

echo ""
echo -e "${YELLOW}▶ Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}  Vercel CLI not found. Installing globally...${NC}"
  npm install -g vercel --silent
  echo -e "${GREEN}✓ Vercel CLI installed${NC}"
else
  echo -e "${GREEN}✓ Vercel CLI ready${NC}"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  Setup complete!                             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo ""
echo -e "  1. ${BLUE}Deploy Firebase rules:${NC}"
echo -e "     firebase login"
echo -e "     firebase deploy --only firestore:rules,firestore:indexes"
echo ""
echo -e "  2. ${BLUE}Start frontend:${NC}"
echo -e "     cd frontend && npm run dev"
echo ""
echo -e "  3. ${BLUE}Start backend (new terminal):${NC}"
echo -e "     cd backend && npm run dev"
echo ""
echo -e "  4. ${BLUE}Open:${NC} http://localhost:5173"
echo ""
echo -e "  5. ${BLUE}Deploy to Vercel:${NC}"
echo -e "     ./deploy.sh"
echo ""
