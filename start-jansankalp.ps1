# JanSankalp AI - Quick Launcher Script
# Author: AI Assistant
# Description: Ek click me complete application start kare

Write-Host "🚀 JanSankalp AI Launcher" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Function to check if Docker is running
function Test-Docker {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to get container status
function Get-ContainerStatus {
    param($ServiceName)
    try {
        $status = docker ps --filter "name=jansankalp-$ServiceName-dev" --format "{{.Status}}"
        if ($status -eq "Up") {
            return "✅ Running"
        }
        else {
            return "❌ Stopped"
        }
    }
    catch {
        return "❓ Not Found"
    }
}

# Function to show service URLs
function Show-ServiceURLs {
    Write-Host "`n📋 Service URLs:" -ForegroundColor Yellow
    Write-Host "┌─────────────────────────────────────────────────┐" -ForegroundColor Gray
    Write-Host "│ Frontend (Next.js) │ http://localhost:3000 │" -ForegroundColor White
    Write-Host "│ Backend (FastAPI)  │ http://localhost:8000 │" -ForegroundColor White  
    Write-Host "│ API Docs          │ http://localhost:8000/docs │" -ForegroundColor White
    Write-Host "│ Database           │ localhost:5432 (Internal)   │" -ForegroundColor Gray
    Write-Host "│ Redis Cache        │ localhost:6379 (Internal)   │" -ForegroundColor Gray
    Write-Host "└─────────────────────────────────────────────────┘" -ForegroundColor Gray
}

# Function to show live status
function Show-LiveStatus {
    Write-Host "`n🔴 LIVE STATUS:" -ForegroundColor Red
    
    # Check each service
    $client = Get-ContainerStatus "client"
    $server = Get-ContainerStatus "server"
    $postgres = Get-ContainerStatus "postgres"
    $redis = Get-ContainerStatus "redis"
    
    Write-Host "┌─────────────────────────────────────────────────┐" -ForegroundColor Gray
    Write-Host "│ Service    │ Status    │ URL               │" -ForegroundColor White
    Write-Host "├─────────────────────────────────────────────────┤" -ForegroundColor Gray
    Write-Host "│ Frontend   │ $client │ http://localhost:3000 │" -ForegroundColor $(if($client -eq "✅ Running") {"Green"} else {"Red"})
    Write-Host "│ Backend    │ $server │ http://localhost:8000 │" -ForegroundColor $(if($server -eq "✅ Running") {"Green"} else {"Red"})
    Write-Host "│ Database   │ $postgres │ Internal          │" -ForegroundColor $(if($postgres -eq "✅ Running") {"Green"} else {"Red"})
    Write-Host "│ Redis      │ $redis    │ Internal          │" -ForegroundColor $(if($redis -eq "✅ Running") {"Green"} else {"Red"})
    Write-Host "└─────────────────────────────────────────────────┘" -ForegroundColor Gray
}

# Function to open URLs
function Open-Services {
    Write-Host "`n🌐 Opening Services..." -ForegroundColor Yellow
    
    # Wait a moment for services to be ready
    Start-Sleep -Seconds 3
    
    try {
        Start-Process "http://localhost:3000" -ErrorAction SilentlyContinue
        Write-Host "✅ Frontend opened: http://localhost:3000" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to open frontend" -ForegroundColor Red
    }
    
    try {
        Start-Process "http://localhost:8000/docs" -ErrorAction SilentlyContinue
        Write-Host "✅ API Docs opened: http://localhost:8000/docs" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to open API docs" -ForegroundColor Red
    }
}

# Main execution
try {
    # Check Docker
    if (-not (Test-Docker)) {
        Write-Host "❌ Docker is not running! Please start Docker Desktop first." -ForegroundColor Red
        Write-Host "📥 Download Docker: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        pause
        exit 1
    }
    
    Write-Host "✅ Docker is running" -ForegroundColor Green
    
    # Check if already running
    $existing = docker ps --filter "name=jansankalp" --format "{{.Names}}" | Measure-Object | Select-Object -ExpandProperty Count
    if ($existing -gt 0) {
        Write-Host "`n⚠️  JanSankalp containers already running!" -ForegroundColor Yellow
        Show-LiveStatus
        Show-ServiceURLs
        
        $choice = Read-Host "`nOptions: [R]estart, [S]top, [O]pen URLs, [Q]uit"
        switch ($choice.ToUpper()) {
            "R" {
                Write-Host "`n🔄 Restarting services..." -ForegroundColor Yellow
                docker compose -f docker-compose.dev.yml down
                Start-Sleep -Seconds 2
                docker compose -f docker-compose.dev.yml up -d
                Write-Host "✅ Services restarted!" -ForegroundColor Green
                Start-Sleep -Seconds 5
                Show-LiveStatus
                Show-ServiceURLs
                Open-Services
            }
            "S" {
                Write-Host "`n🛑 Stopping services..." -ForegroundColor Yellow
                docker compose -f docker-compose.dev.yml down
                Write-Host "✅ Services stopped!" -ForegroundColor Green
            }
            "O" {
                Open-Services
            }
            "Q" {
                Write-Host "👋 Goodbye!" -ForegroundColor Cyan
                exit 0
            }
            default {
                Write-Host "❌ Invalid choice" -ForegroundColor Red
            }
        }
    }
    else {
        # Start fresh
        Write-Host "`n🚀 Starting JanSankalp AI..." -ForegroundColor Green
        
        Set-Location "C:\Users\arunk\Desktop\ReactProjects25-26\JanSankalp AI"
        
        # Start services
        docker compose -f docker-compose.dev.yml up -d
        
        Write-Host "`n⏳ Waiting for services to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Show status
        Show-LiveStatus
        Show-ServiceURLs
        
        Write-Host "`n🌐 Opening services in browser..." -ForegroundColor Yellow
        Open-Services
    }
    
    Write-Host "`n🎉 JanSankalp AI is ready!" -ForegroundColor Green
    Write-Host "📊 Live Dashboard: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
    Write-Host "🤖 AI Models: http://localhost:8000/models/status" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📞 Please check the error and try again" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
