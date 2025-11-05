#!/bin/bash

echo "🤖 Automated PWA Testing Suite"
echo "=============================="
echo ""

BASE_URL="http://localhost:3004"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

passed=0
failed=0

# Helper function
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $2"
        ((passed++))
    else
        echo -e "${RED}✗ FAIL${NC} - $2"
        ((failed++))
    fi
}

echo -e "${BLUE}1. Server Connectivity Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$response" = "200" ]; then
    test_result 0 "Main page accessible"
else
    test_result 1 "Main page returned HTTP $response"
fi
echo ""

echo -e "${BLUE}2. Web App Manifest Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check manifest endpoint
manifest_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/manifest.webmanifest")
test_result $([ "$manifest_response" = "200" ] && echo 0 || echo 1) "Manifest endpoint accessible"

# Download and validate manifest
manifest=$(curl -s "$BASE_URL/manifest.webmanifest")
if echo "$manifest" | grep -q '"name"'; then
    test_result 0 "Manifest has 'name' field"
else
    test_result 1 "Manifest missing 'name' field"
fi

if echo "$manifest" | grep -q '"display":"standalone"'; then
    test_result 0 "Display mode set to 'standalone'"
else
    test_result 1 "Display mode not set to 'standalone'"
fi

if echo "$manifest" | grep -q '"start_url"'; then
    test_result 0 "Manifest has 'start_url'"
else
    test_result 1 "Manifest missing 'start_url'"
fi

icons_count=$(echo "$manifest" | grep -o '"src"' | wc -l | tr -d ' ')
if [ "$icons_count" -ge 2 ]; then
    test_result 0 "Manifest has $icons_count icon(s) (minimum 2 required)"
else
    test_result 1 "Manifest only has $icons_count icon(s), need at least 2"
fi
echo ""

echo -e "${BLUE}3. PWA Icons Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test icon availability
for icon in "pwa-192x192.png" "pwa-512x512.png" "apple-touch-icon.png" "favicon.ico"; do
    icon_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$icon")
    if [ "$icon_response" = "200" ]; then
        size=$(curl -s "$BASE_URL/$icon" | wc -c)
        test_result 0 "$icon available (${size} bytes)"
    else
        test_result 1 "$icon not accessible (HTTP $icon_response)"
    fi
done
echo ""

echo -e "${BLUE}4. Service Worker Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check service worker file
sw_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sw.js")
test_result $([ "$sw_response" = "200" ] && echo 0 || echo 1) "Service worker file accessible"

if [ "$sw_response" = "200" ]; then
    sw_content=$(curl -s "$BASE_URL/sw.js")
    
    if echo "$sw_content" | grep -q "precacheAndRoute"; then
        test_result 0 "Service worker has precache configuration"
    else
        test_result 1 "Service worker missing precache configuration"
    fi
    
    if echo "$sw_content" | grep -q "registerRoute"; then
        test_result 0 "Service worker has route registration"
    else
        test_result 1 "Service worker missing route registration"
    fi
fi
echo ""

echo -e "${BLUE}5. HTML Meta Tags Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

html=$(curl -s "$BASE_URL/")

# Check for manifest link
if echo "$html" | grep -q "manifest"; then
    test_result 0 "HTML links to manifest"
else
    test_result 1 "HTML doesn't link to manifest"
fi

# Check for theme color
if echo "$html" | grep -q "theme-color"; then
    test_result 0 "HTML has theme-color meta tag"
else
    test_result 1 "HTML missing theme-color meta tag"
fi

# Check for viewport
if echo "$html" | grep -q 'name="viewport"'; then
    test_result 0 "HTML has viewport meta tag"
else
    test_result 1 "HTML missing viewport meta tag"
fi
echo ""

echo -e "${BLUE}6. HTTPS Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$BASE_URL" == https://* ]]; then
    test_result 0 "Using HTTPS (production ready)"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Using HTTP (HTTPS required for production PWA)"
fi
echo ""

echo -e "${BLUE}7. Caching Strategy Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$sw_response" = "200" ]; then
    sw_content=$(curl -s "$BASE_URL/sw.js")
    
    if echo "$sw_content" | grep -q "CacheFirst"; then
        test_result 0 "CacheFirst strategy configured"
    else
        test_result 1 "CacheFirst strategy not found"
    fi
    
    if echo "$sw_content" | grep -q "google-fonts"; then
        test_result 0 "Google Fonts caching configured"
    else
        test_result 1 "Google Fonts caching not configured"
    fi
fi
echo ""

echo -e "${BLUE}8. Build Artifacts Test${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "build/client/sw.js" ]; then
    test_result 0 "Production service worker exists"
else
    test_result 1 "Production service worker missing"
fi

if [ -f "build/client/manifest.webmanifest" ]; then
    test_result 0 "Production manifest exists"
else
    test_result 1 "Production manifest missing"
fi

if [ -d "build/client/assets" ]; then
    asset_count=$(ls -1 build/client/assets/*.js 2>/dev/null | wc -l | tr -d ' ')
    test_result 0 "Build has $asset_count JavaScript bundles"
else
    test_result 1 "Build assets directory missing"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 Test Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
total=$((passed + failed))
percentage=$((passed * 100 / total))

echo -e "Total Tests: $total"
echo -e "${GREEN}Passed: $passed${NC}"
if [ $failed -gt 0 ]; then
    echo -e "${RED}Failed: $failed${NC}"
else
    echo -e "Failed: $failed"
fi
echo -e "Success Rate: $percentage%"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✨ All automated tests passed!${NC}"
    echo ""
    echo "Your PWA is working correctly. Key features verified:"
    echo "  ✓ Service worker configured"
    echo "  ✓ Web manifest valid"
    echo "  ✓ Icons accessible"
    echo "  ✓ Caching strategies active"
    echo "  ✓ Build artifacts generated"
    echo ""
    echo "🚀 Ready for deployment!"
    exit 0
else
    echo -e "${RED}⚠ Some tests failed. Please review the results above.${NC}"
    exit 1
fi
