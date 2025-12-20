# EduPilot - AI-Powered Student Career & Learning Co-Pilot

![EduPilot](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 Overview

EduPilot is an AI-powered platform that guides students throughout their academic journey by converting university courses into skill roadmaps, real-world projects, and continuously updated career assets (CV, portfolio, opportunities).

**Mission**: Ensure no student ever graduates with a blank CV again.

## 🚀 Features

- **Academic Skill Mapping**: Converts courses into real-world skills
- **AI Project Generation**: Creates resume-worthy projects for each subject
- **Progress Tracking**: Monitors learning milestones and consistency
- **Auto-CV Generation**: Automatically updates CV as skills are acquired
- **Opportunity Matching**: Matches students with relevant internships and jobs
- **Career Guidance**: Long-term educational and career planning

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **AI/LLM**: OpenAI API, LangChain
- **PDF Generation**: ReportLab

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Routing**: React Router v6

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15

## 📋 Prerequisites

Ensure you have the following installed:
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+** (or use Docker)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Hackathon
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your:
# - DATABASE_URL
# - OPENAI_API_KEY
# - JWT_SECRET

# Run migrations (after setting up database)
# alembic upgrade head

# Start the server
python main.py
# or
uvicorn main:app --reload
```

Backend will run on: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

### 4. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create database
createdb edupilot_db

# Update backend/.env with your database credentials
DATABASE_URL=postgresql://username:password@localhost:5432/edupilot_db
```

#### Option B: Docker Compose (Recommended)

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
Hackathon/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents (Academic, Project, CV, etc.)
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── routes/          # API endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container config
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── Dockerfile           # Frontend container config
│
├── docs/                    # Documentation
├── database/                # Database migrations & schemas
├── docker-compose.yml       # Docker orchestration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Academic
- `GET /api/academic/subjects` - Get user subjects
- `POST /api/academic/subjects` - Add subject
- `GET /api/academic/roadmap` - Get skill roadmap

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `POST /api/projects/generate` - AI-generate project
- `PUT /api/projects/{id}` - Update project

### CV
- `GET /api/cv/current` - Get current CV
- `POST /api/cv/generate` - Generate new CV
- `GET /api/cv/download` - Download CV PDF

### Opportunities
- `GET /api/opportunities` - Get matched opportunities
- `POST /api/opportunities/match` - Match new opportunities

## 🚀 Quick Start (Docker)

The fastest way to get started:

```bash
# 1. Clone repository
git clone <repository-url>
cd Hackathon

# 2. Create backend .env
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY

# 3. Create frontend .env
cp frontend/.env.example frontend/.env

# 4. Start everything
docker-compose up

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/edupilot_db
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🗺️ Development Roadmap

### MVP (Hackathon Version)
- [x] Environment setup
- [ ] User authentication
- [ ] Onboarding flow
- [ ] Subject-to-skill mapping
- [ ] AI project generation
- [ ] Basic dashboard
- [ ] CV auto-generation

### Future Enhancements
- [ ] University LMS integration
- [ ] Blockchain skill certificates
- [ ] Multi-language support
- [ ] Institutional dashboards
- [ ] Peer collaboration features
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Your Name] - [Role]
- [Team Member] - [Role]

## 🔗 Links

- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **Repository**: [GitHub URL]

## 🆘 Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Ensure PostgreSQL is running
# Check DATABASE_URL in .env
```

**OpenAI API error:**
```bash
# Verify OPENAI_API_KEY in .env
# Check API quota and billing
```

### Frontend Issues

**Cannot connect to backend:**
```bash
# Ensure backend is running on port 8000
# Check VITE_API_BASE_URL in .env
```

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact: [your-email@example.com]

---

**Built with ❤️ for students who deserve better career preparation**
