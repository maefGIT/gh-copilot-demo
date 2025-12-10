#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Album API v2 - Setup and Run Script  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Navigate to album-api-v2 directory
cd "$(dirname "$0")/album-api-v2" || exit 1

echo -e "${YELLOW}Step 1: Installing API dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install API dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Building TypeScript code...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build TypeScript code${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Running API tests...${NC}"
npm test

if [ $? -ne 0 ]; then
    echo -e "${RED}Some tests failed. Review the output above.${NC}"
    echo -e "${YELLOW}Do you want to continue and start the server anyway? (y/n)${NC}"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  API Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Starting API server on port 3000...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

npm start
