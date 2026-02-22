# JanSankalp AI — Docker Startup Script (Windows PowerShell)
# Chalane ke liye: Right-click > "Run with PowerShell"
# Ya terminal me: .\start-docker.ps1

param(
    [Parameter(HelpMessage="Kaunsa environment start karna hai")]
    [ValidateSet("dev", "prod")]
    [string]$Mode = "dev"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

# ─── Colors Helper ──────────────────────────────────────────────────
function Write-Step  { param($msg) Write-Host "`n🔷 $msg" -ForegroundColor Cyan }
function Write-OK    { param($msg) Write-Host "  ✅ $msg" -ForegroundColor Green }
function Write-Warn  { param($msg) Write-Host "  ⚠️  $msg" -ForegroundColor Yellow }
function Write-Error2 { param($msg) Write-Host "  ❌ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     JanSankalp AI — Docker Launcher    ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# ─── Step 1: Docker Check ───────────────────────────────────────────
Write-Step "Docker Desktop check kar raha hoon..."
try {
    $dockerVersion = docker --version 2>&1
    Write-OK "Docker mila: $dockerVersion"
} catch {
    Write-Error2 "Docker nahi mila! Docker Desktop install karo: https://www.docker.com/products/docker-desktop"
    exit 1
}

try {
    docker info > $null 2>&1
    Write-OK "Docker Desktop chal raha hai"
} catch {
    Write-Error2 "Docker daemon nahi chal raha. Docker Desktop start karo aur dobara try karo."
    exit 1
}

# ─── Step 2: .env File Check ────────────────────────────────────────
Write-Step ".env file check kar raha hoon..."
$envFile = Join-Path $ProjectRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Warn ".env file nahi mili! .env.docker se copy kar raha hoon..."
    $envDockerFile = Join-Path $ProjectRoot ".env.docker"
    if (Test-Path $envDockerFile) {
        Copy-Item $envDockerFile $envFile
        Write-OK ".env.docker se .env copy ho gayi"
        Write-Warn "ZARURI: .env file kholo aur apni actual API keys bharo!"
        Start-Sleep 3
    } else {
        Write-Error2 ".env.docker bhi nahi mili. Manually .env file banao."
        exit 1
    }
} else {
    Write-OK ".env file mil gayi"
}

# ─── Step 3: Choose Compose File ────────────────────────────────────
Write-Step "Mode: $Mode"

if ($Mode -eq "dev") {
    $ComposeFile = Join-Path $ProjectRoot "docker-compose.dev.yml"
    Write-OK "Development stack: Next.js + FastAPI + Postgres + Redis"
    Write-Warn "Kafka aur Weaviate dev mode me nahi chalenge (lighter setup)"
} else {
    $ComposeFile = Join-Path $ProjectRoot "infrastructure\docker-compose.yml"
    Write-OK "Production stack: Sab services (Kafka, Weaviate, Nginx included)"
}

# ─── Step 4: Build & Start ──────────────────────────────────────────
Write-Step "Docker images build ho rahi hain (pehli baar thoda time lagega)..."

Set-Location $ProjectRoot

docker compose -f $ComposeFile build
if ($LASTEXITCODE -ne 0) {
    Write-Error2 "Build fail hua! Upar ki errors dekho."
    exit 1
}
Write-OK "Build successful!"

Write-Step "Services start ho rahi hain..."
docker compose -f $ComposeFile up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error2 "Services start nahi hui! Logs dekho: docker compose -f $ComposeFile logs"
    exit 1
}

# ─── Step 5: Wait & Status ──────────────────────────────────────────
Write-Step "Services ready hone ka wait kar raha hoon (30 sec)..."
Start-Sleep 30

Write-Host ""
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  SERVICE STATUS" -ForegroundColor White
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
docker compose -f $ComposeFile ps

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🚀 APP CHAL RAHI HAI!          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 Frontend (Next.js) : http://localhost:3000" -ForegroundColor Cyan
Write-Host "  🤖 AI Engine (FastAPI): http://localhost:8000/docs" -ForegroundColor Cyan
if ($Mode -eq "prod") {
    Write-Host "  🔀 Nginx Proxy        : http://localhost:80" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "  📋 Logs dekhne ke liye:"
Write-Host "     docker compose -f $ComposeFile logs -f" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  🛑 Band karne ke liye:"
Write-Host "     docker compose -f $ComposeFile down" -ForegroundColor DarkGray
Write-Host ""

# Open browser
Start-Process "http://localhost:3000"
