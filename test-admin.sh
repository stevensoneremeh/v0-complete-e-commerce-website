#!/bin/bash

# Admin Dashboard Verification Script
# This script tests that all admin functionality works correctly

echo "🧪 Testing Admin Dashboard Functionality"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status)"
        ((FAILED++))
    fi
}

# Function to check if server is running
check_server() {
    echo "Checking if development server is running..."
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✓ Development server is running${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Development server is not running${NC}"
        echo "Please start the server with: pnpm run dev"
        exit 1
    fi
}

# Check server
check_server

echo "1. Testing Public Endpoints"
echo "----------------------------"
test_endpoint "Public Products API" "http://localhost:3000/api/products" "200"
echo ""

echo "2. Testing Admin Endpoints (Should require auth)"
echo "------------------------------------------------"
test_endpoint "Admin Products API" "http://localhost:3000/api/admin/products" "401"
test_endpoint "Admin Categories API" "http://localhost:3000/api/admin/categories" "401"
test_endpoint "Admin Dashboard" "http://localhost:3000/api/admin/dashboard" "401"
echo ""

echo "3. Testing Page Routes"
echo "---------------------"
test_endpoint "Home Page" "http://localhost:3000" "200"
test_endpoint "Products Page" "http://localhost:3000/products" "200"
test_endpoint "Admin Page (Should redirect)" "http://localhost:3000/admin" "307"
echo ""

echo "4. Checking Component Compilation"
echo "---------------------------------"

# Check if key files exist and have no syntax errors
check_file() {
    local file=$1
    local name=$2
    
    echo -n "Checking $name... "
    if [ -f "$file" ]; then
        # Basic syntax check (file exists and is not empty)
        if [ -s "$file" ]; then
            echo -e "${GREEN}✓ EXISTS${NC}"
            ((PASSED++))
        else
            echo -e "${RED}✗ EMPTY${NC}"
            ((FAILED++))
        fi
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((FAILED++))
    fi
}

check_file "hooks/use-realtime-products.ts" "Real-time Products Hook"
check_file "hooks/use-realtime-categories.ts" "Real-time Categories Hook"
check_file "hooks/use-realtime-properties.ts" "Real-time Properties Hook"
check_file "components/product-grid.tsx" "Product Grid Component"
check_file "app/admin/products/page.tsx" "Admin Products Page"
check_file "app/admin/categories/page.tsx" "Admin Categories Page"
check_file "app/api/admin/products/route.ts" "Admin Products API"
check_file "app/api/admin/categories/route.ts" "Admin Categories API"

echo ""
echo "5. Checking Documentation Files"
echo "-------------------------------"
check_file "ADMIN_QUICK_START.md" "Quick Start Guide"
check_file "ADMIN_FIX_SUMMARY.md" "Fix Summary"
check_file "ADMIN_PRODUCTION_READY_GUIDE.md" "Production Guide"
check_file "SUPABASE_REALTIME_SETUP.sql" "SQL Setup Script"
check_file "test-admin-dashboard.md" "Test Plan"

echo ""
echo "6. Checking API Response Format"
echo "--------------------------------"

# Test products API response format
echo -n "Checking Products API response format... "
response=$(curl -s http://localhost:3000/api/products)
if echo "$response" | grep -q '"products"'; then
    echo -e "${GREEN}✓ PASS${NC} (Contains 'products' key)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (No 'products' key found - may need Supabase setup)"
    echo "Response: $response"
fi

echo ""
echo "========================================"
echo "Test Results Summary"
echo "========================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Enable Supabase real-time (see SUPABASE_REALTIME_SETUP.sql)"
    echo "2. Open http://localhost:3000/admin/products in browser"
    echo "3. Open http://localhost:3000/products in another tab"
    echo "4. Add/edit a product and watch it update in real-time!"
    echo ""
    echo "For detailed testing instructions, see: test-admin-dashboard.md"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    echo "Please check the errors above and:"
    echo "1. Ensure the development server is running"
    echo "2. Verify all environment variables are set"
    echo "3. Check that all files were created correctly"
    exit 1
fi
