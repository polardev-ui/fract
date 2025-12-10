# fract uninstaller script for Windows
# Usage: iwr -useb https://raw.githubusercontent.com/polardev-ui/fract/main/uninstall.ps1 | iex

$ErrorActionPreference = "Stop"

$INSTALL_DIR = "$env:USERPROFILE\.fract"
$BIN_DIR = "$env:USERPROFILE\.fract\bin"

# Colors
function Write-Cyan { Write-Host $args -ForegroundColor Cyan }
function Write-Green { Write-Host $args -ForegroundColor Green }
function Write-Yellow { Write-Host $args -ForegroundColor Yellow }

Write-Host ""
Write-Cyan "╔══════════════════════════════════════╗"
Write-Cyan "║  fract uninstaller                   ║"
Write-Cyan "╚══════════════════════════════════════╝"
Write-Host ""
Write-Host "This will remove fract from your system."
Write-Host ""

$confirmation = Read-Host "Are you sure you want to uninstall fract? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Uninstall cancelled."
    exit 0
}

Write-Host ""
Write-Cyan "→ Removing fract files..."

if (Test-Path $INSTALL_DIR) {
    Remove-Item -Recurse -Force $INSTALL_DIR
    Write-Green "✓ Files removed"
} else {
    Write-Yellow "! Installation directory not found"
}

# Remove from PATH
Write-Host ""
Write-Cyan "→ Removing from PATH..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -like "*$BIN_DIR*") {
    $newPath = ($userPath.Split(';') | Where-Object { $_ -ne $BIN_DIR }) -join ';'
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Green "✓ Removed from PATH"
    Write-Host ""
    Write-Yellow "⚠ Please restart your terminal for PATH changes to take effect"
} else {
    Write-Yellow "! Not found in PATH"
}

Write-Host ""
Write-Green "╔══════════════════════════════════════╗"
Write-Green "║  ✓ fract uninstalled successfully!   ║"
Write-Green "╚══════════════════════════════════════╝"
Write-Host ""
