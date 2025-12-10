#!/bin/bash

# fract installer script
# Usage: curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash

set -e 

REPO="polardev-ui/fract"
INSTALL_DIR="$HOME/.fract"
BIN_DIR="$HOME/.local/bin"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${CYAN}fract${NC} installer                   ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Warning: Node.js version 18 or higher is recommended${NC}"
fi

echo -e "${CYAN}→ Checking system...${NC}"
sleep 1
echo -e "${GREEN}✓ Node.js detected: $(node -v)${NC}"

# Create installation directory
echo ""
echo -e "${CYAN}→ Creating directories...${NC}"
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
mkdir -p "$INSTALL_DIR/packages"
sleep 1
echo -e "${GREEN}✓ Directories created${NC}"

# Download the latest release
echo ""
echo -e "${CYAN}→ Downloading fract...${NC}"

cd "$INSTALL_DIR"

# Remove old cli directory if it exists
if [ -d "$INSTALL_DIR/cli" ]; then
    rm -rf "$INSTALL_DIR/cli"
fi

# Download and extract
if curl -fsSL "https://github.com/$REPO/archive/refs/heads/main.tar.gz" -o fract.tar.gz; then
    tar -xzf fract.tar.gz
    
    if [ -d "fract-main" ] && [ -d "fract-main/bin" ] && [ -d "fract-main/lib" ] && [ -f "fract-main/package.json" ]; then
        mkdir -p "$INSTALL_DIR/cli"
        
        # Copy CLI files to the installation directory
        cp -r fract-main/bin "$INSTALL_DIR/cli/"
        cp -r fract-main/lib "$INSTALL_DIR/cli/"
        cp fract-main/package.json "$INSTALL_DIR/cli/"
        
        rm -rf fract-main fract.tar.gz
    else
        echo -e "${RED}Error: CLI files not found${NC}"
        echo -e "${RED}Expected structure: fract-main/bin, fract-main/lib, fract-main/package.json${NC}"
        echo ""
        echo -e "${RED}What we found:${NC}"
        if [ -d "fract-main" ]; then
            ls -la fract-main/ 2>&1 | head -20
        else
            echo "fract-main directory doesn't exist"
        fi
        rm -rf fract-main fract.tar.gz
        exit 1
    fi
else
    echo -e "${RED}Error: Failed to download fract${NC}"
    echo "Please check your internet connection and try again"
    exit 1
fi

sleep 1
echo -e "${GREEN}✓ Downloaded successfully${NC}"

# Install dependencies
echo ""
echo -e "${CYAN}→ Installing dependencies...${NC}"
cd "$INSTALL_DIR/cli"
npm install --silent --no-progress > /dev/null 2>&1
sleep 1
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create symlink
echo ""
echo -e "${CYAN}→ Setting up fract command...${NC}"
ln -sf "$INSTALL_DIR/cli/bin/fract.js" "$BIN_DIR/fract"
chmod +x "$BIN_DIR/fract"
chmod +x "$INSTALL_DIR/cli/bin/fract.js"
sleep 1
echo -e "${GREEN}✓ Command setup complete${NC}"

# Add to PATH if not already there
SHELL_CONFIG=""
if [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
fi

if [ -n "$SHELL_CONFIG" ] && [ -f "$SHELL_CONFIG" ]; then
    if ! grep -q "$BIN_DIR" "$SHELL_CONFIG"; then
        echo ""
        echo -e "${CYAN}→ Adding fract to PATH...${NC}"
        echo "" >> "$SHELL_CONFIG"
        echo "# fract package manager" >> "$SHELL_CONFIG"
        echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_CONFIG"
        sleep 1
        echo -e "${GREEN}✓ Added to PATH${NC}"
        echo ""
        echo -e "${YELLOW}⚠ Please restart your terminal or run:${NC}"
        echo -e "  ${CYAN}source $SHELL_CONFIG${NC}"
    fi
fi

# Success message
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${GREEN}✓ fract installed successfully!${NC}    ${GREEN}║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Get started with:${NC}"
echo -e "  ${CYAN}fract install <package>${NC}"
echo ""
echo -e "${CYAN}For help, run:${NC}"
echo -e "  ${CYAN}fract --help${NC}"
echo ""
