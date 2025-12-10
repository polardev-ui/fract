# fract installer script for Windows
# Usage: iwr -useb https://raw.githubusercontent.com/polardev-ui/fract/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

$REPO = "polardev-ui/fract"
$INSTALL_DIR = "$env:USERPROFILE\.fract"
$BIN_DIR = "$env:USERPROFILE\.fract\bin"

# Colors
function Write-Cyan { Write-Host $args -ForegroundColor Cyan }
function Write-Green { Write-Host $args -ForegroundColor Green }
function Write-Yellow { Write-Host $args -ForegroundColor Yellow }
function Write-Red { Write-Host $args -ForegroundColor Red }

Write-Host ""
Write-Cyan "╔══════════════════════════════════════╗"
Write-Cyan "║  fract installer                   ║"
Write-Cyan "╚══════════════════════════════════════╝"
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Red "Error: Node.js is not installed"
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}

$nodeVersion = (node -v).TrimStart('v').Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Yellow "Warning: Node.js version 18 or higher is recommended"
}

Write-Cyan "→ Checking system..."
Start-Sleep -Milliseconds 500
Write-Green "✓ Node.js detected: $(node -v)"

# Create installation directory
Write-Host ""
Write-Cyan "→ Creating directories..."
New-Item -ItemType Directory -Force -Path $INSTALL_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $BIN_DIR | Out-Null
New-Item -ItemType Directory -Force -Path "$INSTALL_DIR\packages" | Out-Null
Start-Sleep -Milliseconds 500
Write-Green "✓ Directories created"

# Download the latest release
Write-Host ""
Write-Cyan "→ Downloading fract..."

Set-Location $INSTALL_DIR

# Remove old cli directory if it exists
if (Test-Path "$INSTALL_DIR\cli") {
    Remove-Item -Recurse -Force "$INSTALL_DIR\cli"
}

try {
    # Download and extract
    $zipUrl = "https://github.com/$REPO/archive/refs/heads/main.zip"
    $zipFile = "$INSTALL_DIR\fract.zip"
    
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing
    
    Expand-Archive -Path $zipFile -DestinationPath $INSTALL_DIR -Force
    
    if ((Test-Path "fract-main\bin") -and (Test-Path "fract-main\lib") -and (Test-Path "fract-main\package.json")) {
        New-Item -ItemType Directory -Force -Path "$INSTALL_DIR\cli" | Out-Null
        
        # Copy CLI files
        Copy-Item -Path "fract-main\bin" -Destination "$INSTALL_DIR\cli\" -Recurse -Force
        Copy-Item -Path "fract-main\lib" -Destination "$INSTALL_DIR\cli\" -Recurse -Force
        Copy-Item -Path "fract-main\package.json" -Destination "$INSTALL_DIR\cli\" -Force
        
        Remove-Item -Recurse -Force "fract-main"
        Remove-Item -Force $zipFile
    } else {
        Write-Red "Error: CLI files not found in downloaded archive"
        Remove-Item -Recurse -Force "fract-main" -ErrorAction SilentlyContinue
        Remove-Item -Force $zipFile -ErrorAction SilentlyContinue
        exit 1
    }
} catch {
    Write-Red "Error: Failed to download fract"
    Write-Host "Please check your internet connection and try again"
    exit 1
}

Start-Sleep -Milliseconds 500
Write-Green "✓ Downloaded successfully"

# Install dependencies
Write-Host ""
Write-Cyan "→ Installing dependencies..."
Set-Location "$INSTALL_DIR\cli"
npm install --silent --no-progress 2>$null
Start-Sleep -Milliseconds 500
Write-Green "✓ Dependencies installed"

# Create batch wrapper
Write-Host ""
Write-Cyan "→ Setting up fract command..."
$batchFile = @"
@echo off
node "$INSTALL_DIR\cli\bin\fract.js" %*
"@
Set-Content -Path "$BIN_DIR\fract.bat" -Value $batchFile
Start-Sleep -Milliseconds 500
Write-Green "✓ Command setup complete"

# Add to PATH if not already there
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$BIN_DIR*") {
    Write-Host ""
    Write-Cyan "→ Adding fract to PATH..."
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$userPath;$BIN_DIR",
        "User"
    )
    Start-Sleep -Milliseconds 500
    Write-Green "✓ Added to PATH"
    Write-Host ""
    Write-Yellow "⚠ Please restart your terminal for PATH changes to take effect"
}

# Success message
Write-Host ""
Write-Green "╔══════════════════════════════════════╗"
Write-Green "║  ✓ fract installed successfully!    ║"
Write-Green "╚══════════════════════════════════════╝"
Write-Host ""
Write-Cyan "Get started with:"
Write-Cyan "  fract install <package>"
Write-Host ""
Write-Cyan "For help, run:"
Write-Cyan "  fract --help"
Write-Host ""
