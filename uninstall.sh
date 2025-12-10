#!/bin/bash

# fract uninstaller script
# Usage: curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/uninstall.sh | bash

set -e

INSTALL_DIR="$HOME/.fract"
BIN_DIR="$HOME/.local/bin"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}╔══════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║${NC}  fract uninstaller                   ${YELLOW}║${NC}"
echo -e "${YELLOW}╚══════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}This will remove fract from your system.${NC}"
read -p "Are you sure? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}Uninstall cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}→ Removing fract...${NC}"

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo -e "${GREEN}✓ Removed installation directory${NC}"
fi

# Remove symlink
if [ -L "$BIN_DIR/fract" ]; then
    rm "$BIN_DIR/fract"
    echo -e "${GREEN}✓ Removed fract command${NC}"
fi

# Clean up shell config
SHELL_CONFIG=""
if [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
fi

# Clean up shell config
SHELL_CONFIG=""
if [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
fi

if [ -n "$SHELL_CONFIG" ] && [ -f "$SHELL_CONFIG" ]; then
    if grep -q "# fract package manager" "$SHELL_CONFIG"; then
        echo -e "${CYAN}→ Cleaning up shell configuration...${NC}"

        # Determine the correct sed -i flag for cross-platform compatibility
        # BSD sed (macOS) requires an argument for -i, even if it's empty.
        # GNU sed (Linux) is happy either way.
        if sed -i '' '/# fract package manager/,+1d' "$SHELL_CONFIG" 2>/dev/null; then
            # macOS sed was successful (used -i '')
            true
        else
            # Fallback for GNU sed (or failed attempt)
            sed -i.bak '/# fract package manager/,+1d' "$SHELL_CONFIG"
            rm -f "$SHELL_CONFIG.bak" 2>/dev/null
        fi

        echo -e "${GREEN}✓ Cleaned up shell configuration${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✓ fract uninstalled successfully${NC}"
echo ""
