# fract

A modern package manager with beautiful terminal animations.

## Installation

Install fract using the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash
```

Or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash
```

## Usage

### Install a package

```bash
fract install <package-name>
# or
fract i <package-name>
```

Install globally:

```bash
fract install <package-name> --global
# or
fract i <package-name> -g
```

### Uninstall a package

```bash
fract uninstall <package-name>
# or
fract remove <package-name>
```

### List installed packages

```bash
fract list
# or
fract ls
```

### Search for packages

```bash
fract search <query>
```

### Update a package

```bash
fract update <package-name>
```

## Features

- Beautiful terminal animations with custom progress indicators
- Fast package installation with parallel processing
- Simple and intuitive commands
- Local and global package support
- Live status updates during installation
- Package registry integration at [fract-cli.vercel.app](https://fract-cli.vercel.app)

## Package Terminology

fract uses unique terminology:

- **Fetching** - Downloading packages
- **Compiling** - Processing packages
- **Installed** - Package ready to use

## Author

Built by [Polar](https://github.com/polardev-ui)

## License

MIT
