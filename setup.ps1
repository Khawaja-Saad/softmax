# EduPilot Quick Start Script for Windows PowerShell
# Run this script to quickly set up and start the development environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   EduPilot Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✓ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Setup Backend
Set-Location backend

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
if (!(Test-Path "venv")) {
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create .env if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created from template" -ForegroundColor Green
    Write-Host "⚠ IMPORTANT: Edit backend/.env and add your OPENAI_API_KEY" -ForegroundColor Red
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Return to root directory
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Setup Frontend
Set-Location frontend

# Install dependencies
Write-Host "Installing Node.js dependencies (this may take a moment)..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create .env if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Return to root directory
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Backend environment configured" -ForegroundColor Green
Write-Host "✓ Frontend environment configured" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Setup Database (choose one option):" -ForegroundColor Yellow
Write-Host "   Option A - Docker (Recommended):" -ForegroundColor White
Write-Host "   docker run --name edupilot_postgres -e POSTGRES_DB=edupilot_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option B - Docker Compose:" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure Environment Variables:" -ForegroundColor Yellow
Write-Host "   Edit backend/.env and add:" -ForegroundColor White
Write-Host "   - OPENAI_API_KEY=your-key-here" -ForegroundColor Gray
Write-Host "   - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edupilot_db" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Backend Server (in new terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start Frontend Server (in new terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Access Application:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md - Project overview" -ForegroundColor White
Write-Host "   - docs/SETUP.md - Detailed setup guide" -ForegroundColor White
Write-Host "   - docs/API.md - API documentation" -ForegroundColor White
Write-Host "   - docs/PROJECT_SUMMARY.md - Complete summary" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
Write-Host ""
