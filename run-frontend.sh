#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Album Viewer - Setup and Run Script  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Navigate to album-viewer directory
cd "$(dirname "$0")/album-viewer" || exit 1

echo -e "${YELLOW}Step 1: Installing frontend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Running frontend tests...${NC}"
npm test -- --run

if [ $? -ne 0 ]; then
    echo -e "${RED}Some tests failed. Review the output above.${NC}"
    echo -e "${YELLOW}Do you want to continue and start the dev server anyway? (y/n)${NC}"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Frontend Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Starting development server on port 3001...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

npm run dev
