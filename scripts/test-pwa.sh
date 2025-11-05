#!/bin/bash

echo "🧪 PWA Test Suite"
echo "================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check build artifacts
echo "1️⃣  Checking build artifacts..."
if [ -f "build/client/sw.js" ] && [ -f "build/client/manifest.webmanifest" ]; then
    echo -e "${GREEN}✓${NC} Service worker and manifest exist"
else
    echo -e "${RED}✗${NC} Missing build artifacts. Run: bun run build"
    exit 1
fi

# Test 2: Check PWA icons
echo ""
echo "2️⃣  Checking PWA icons..."
icons_ok=true
for icon in "public/pwa-192x192.png" "public/pwa-512x512.png" "public/apple-touch-icon.png"; do
    if [ -f "$icon" ]; then
        size=$(du -h "$icon" | cut -f1)
        echo -e "${GREEN}✓${NC} $icon ($size)"
    else
        echo -e "${RED}✗${NC} Missing: $icon"
        icons_ok=false
    fi
done

if [ "$icons_ok" = false ]; then
    echo -e "${YELLOW}⚠${NC}  Some icons are missing"
fi

# Test 3: Check TypeScript
echo ""
echo "3️⃣  Running TypeScript check..."
bun typecheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript check passed"
else
    echo -e "${RED}✗${NC} TypeScript errors found"
    bun typecheck
    exit 1
fi

# Test 4: Verify manifest content
echo ""
echo "4️⃣  Verifying manifest content..."
if command -v jq &> /dev/null; then
    manifest=$(cat build/client/manifest.webmanifest)
    name=$(echo $manifest | jq -r .name)
    display=$(echo $manifest | jq -r .display)
    icons_count=$(echo $manifest | jq '.icons | length')
    
    echo -e "${GREEN}✓${NC} App Name: $name"
    echo -e "${GREEN}✓${NC} Display: $display"
    echo -e "${GREEN}✓${NC} Icons: $icons_count defined"
else
    echo -e "${YELLOW}⚠${NC}  jq not installed, skipping JSON validation"
    echo "  Manifest exists at: build/client/manifest.webmanifest"
fi

# Test 5: Check service worker
echo ""
echo "5️⃣  Checking service worker..."
if grep -q "precacheAndRoute" build/client/sw.js; then
    echo -e "${GREEN}✓${NC} Service worker has precache configuration"
else
    echo -e "${RED}✗${NC} Service worker might be misconfigured"
fi

if grep -q "google-fonts-cache" build/client/sw.js; then
    echo -e "${GREEN}✓${NC} Google Fonts caching enabled"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Automated tests completed!"
echo ""
echo "📋 Manual Testing Steps:"
echo ""
echo "1. Start dev server: ${YELLOW}bun dev${NC}"
echo "2. Open: ${YELLOW}http://localhost:3004${NC}"
echo "3. Open Chrome DevTools (F12)"
echo "4. Go to: ${YELLOW}Application → Manifest${NC}"
echo "5. Go to: ${YELLOW}Application → Service Workers${NC}"
echo "6. Test offline: ${YELLOW}Network → Offline${NC} → Reload"
echo "7. Run audit: ${YELLOW}Lighthouse → PWA${NC}"
echo "8. Install: Click ⊕ icon in address bar"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
