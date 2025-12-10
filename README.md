# fract

A modern package manager with beautiful terminal animations.

## Installation

### Linux / macOS

Install fract using curl:

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash
\`\`\`

Or with wget:

\`\`\`bash
wget -qO- https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash
\`\`\`

### Windows

Install fract using PowerShell (run as Administrator):

\`\`\`powershell
iwr -useb https://raw.githubusercontent.com/polardev-ui/fract/main/install.ps1 | iex
\`\`\`

**Note:** After installation, restart your terminal for the PATH changes to take effect.

## Usage

### Install a package

\`\`\`bash
fract install <package-name>
# or
fract i <package-name>
\`\`\`

Install globally:

\`\`\`bash
fract install <package-name> --global
# or
fract i <package-name> -g
\`\`\`

### Uninstall a package

\`\`\`bash
fract uninstall <package-name>
# or
fract remove <package-name>
\`\`\`

### List installed packages

\`\`\`bash
fract list
# or
fract ls
\`\`\`

### Search for packages

\`\`\`bash
fract search <query>
\`\`\`

### Update a package

\`\`\`bash
fract update <package-name>
\`\`\`

## Uninstallation

### Linux / macOS

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/uninstall.sh | bash
\`\`\`

### Windows

\`\`\`powershell
iwr -useb https://raw.githubusercontent.com/polardev-ui/fract/main/uninstall.ps1 | iex
\`\`\`

## Features

- **Cross-platform** - Works on Linux, macOS, and Windows
- Beautiful terminal animations with custom progress indicators
- Fast package installation with parallel processing
- Simple and intuitive commands
- Local and global package support
- Live status updates during installation
- Package registry integration at [fract.vercel.app](https://fract.vercel.app)

## Package Terminology

fract uses unique terminology:

- **Fetching** - Downloading packages
- **Compiling** - Processing packages
- **Installed** - Package ready to use

## Author

Built by [Polar](https://github.com/polardev-ui)

## License

MIT
\`\`\`

```tsx file="" isHidden
