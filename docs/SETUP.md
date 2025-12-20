# Development Setup Guide

## Initial Setup Steps

### 1. Install Prerequisites

#### Windows
```powershell
# Install Python 3.11
winget install Python.Python.3.11

# Install Node.js 18
winget install OpenJS.NodeJS.LTS

# Install PostgreSQL (optional, if not using Docker)
winget install PostgreSQL.PostgreSQL

# Install Docker Desktop
winget install Docker.DockerDesktop
```

#### macOS
```bash
# Using Homebrew
brew install python@3.11 node postgresql docker
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3.11 nodejs npm postgresql docker.io
```

### 2. Verify Installations

```bash
python --version  # Should be 3.11+
node --version    # Should be 18+
npm --version     # Should be 9+
psql --version    # Should be 15+
docker --version  # Latest version
```

## Backend Development Setup

### Step 1: Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### Step 2: Activate Virtual Environment

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows CMD:**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# Required:
# - DATABASE_URL
# - OPENAI_API_KEY
# - JWT_SECRET
```

### Step 5: Setup Database

**Option A: Docker (Recommended)**
```bash
docker run --name edupilot_postgres \
  -e POSTGRES_DB=edupilot_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb edupilot_db

# Or using psql
psql -U postgres
CREATE DATABASE edupilot_db;
\q
```

### Step 6: Run Migrations (Future)

```bash
# Initialize Alembic (when ready)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

### Step 7: Start Backend Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Or using Python
python main.py
```

Backend will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Development Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit if needed (default should work)
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 3: Start Development Server

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

### Step 4: Build for Production

```bash
npm run build
npm run preview
```

## Docker Development Setup

### Quick Start with Docker Compose

```bash
# From project root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build
```

### Individual Container Commands

```bash
# Build backend
docker build -t edupilot-backend ./backend

# Build frontend
docker build -t edupilot-frontend ./frontend

# Run backend
docker run -p 8000:8000 edupilot-backend

# Run frontend
docker run -p 5173:5173 edupilot-frontend
```

## Database Management

### Create Tables

```python
# In Python console or script
from database import Base, engine
from app.models.user import User
from app.models.academic import Subject, Skill
from app.models.project import Project, Milestone
from app.models.cv import CVVersion, Opportunity

# Create all tables
Base.metadata.create_all(bind=engine)
```

### Connect to Database

```bash
# Local PostgreSQL
psql -U postgres -d edupilot_db

# Docker PostgreSQL
docker exec -it edupilot_db psql -U postgres -d edupilot_db
```

### Useful SQL Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d users

-- Query data
SELECT * FROM users;

-- Drop all tables (careful!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## API Testing

### Using FastAPI Docs (Swagger)

1. Navigate to http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Using Postman

1. Import the API collection (to be created)
2. Set environment variables
3. Test endpoints

## Common Development Commands

### Backend

```bash
# Activate virtual environment
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1

# Install new package
pip install package-name
pip freeze > requirements.txt

# Run tests
pytest

# Format code
black .
isort .

# Lint code
flake8 .
pylint app/
```

### Frontend

```bash
# Install new package
npm install package-name

# Update packages
npm update

# Format code (if Prettier is configured)
npm run format

# Lint code
npm run lint

# Build for production
npm run build
```

## Troubleshooting

### Backend Issues

**Import errors:**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
docker ps  # For Docker
sudo systemctl status postgresql  # For Linux

# Test connection
psql -U postgres -d edupilot_db
```

**OpenAI API errors:**
```bash
# Verify API key in .env
# Check quota at platform.openai.com
# Ensure billing is set up
```

### Frontend Issues

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clear Vite cache
rm -rf .vite node_modules/.vite
npm run dev
```

**CORS errors:**
```bash
# Ensure backend ALLOWED_ORIGINS includes frontend URL
# Check backend/.env ALLOWED_ORIGINS setting
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Environment Variables Reference

### Backend .env

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edupilot_db

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=sk-...

# Application
APP_NAME=EduPilot
APP_VERSION=1.0.0
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend .env

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

## Next Steps

After environment setup:

1. ✅ Verify all services are running
2. ✅ Test API endpoints
3. ✅ Access frontend at http://localhost:5173
4. ⏭️ Start building authentication routes
5. ⏭️ Implement onboarding flow
6. ⏭️ Create AI agents
7. ⏭️ Build dashboard components

## Need Help?

- Check [README.md](../README.md) for overview
- Review [context.md](../context.md) for project context
- Check API docs at http://localhost:8000/docs
- Create an issue in the repository
