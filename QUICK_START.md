# 🚀 Quick Start Guide - EduPilot

## Run the Application (2 Simple Steps)

### Step 1: Start Backend
```powershell
cd d:\Hackathon\backend
python main.py
```
✅ Backend running at: http://localhost:8000  
📚 API Docs at: http://localhost:8000/docs

---

### Step 2: Start Frontend
```powershell
cd d:\Hackathon\frontend  
npm run dev
```
✅ Frontend running at: http://localhost:5173

---

## 🎯 Access the Application

Open browser: **http://localhost:5173**

---

## 📝 Quick Test Flow

1. **Register**: Create account → test@example.com / Test123!
2. **Onboard**: Add degree, subjects, career goal
3. **Skills**: Click "Generate Roadmap with AI" ⚡
4. **Projects**: Click "Generate Project" 🚀
5. **CV**: Mark project complete → Generate CV 📄
6. **Jobs**: Click "Find Matches" 💼

---

## 🔑 Environment Variables (Already Configured)

### Backend (.env)
- ✅ DATABASE_URL: SQLite database
- ✅ SECRET_KEY: JWT authentication  
- ⚠️ OPENAI_API_KEY: **ADD YOUR KEY HERE**

### Frontend (.env)
- ✅ VITE_API_URL: http://localhost:8000/api

---

## ⚡ API Endpoints

### Auth
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get user

### Academic (AI)
- GET `/api/academic/subjects` - List subjects
- POST `/api/academic/subjects` - Add subject
- GET `/api/academic/roadmap` - **AI Generate Skills**
- GET `/api/academic/skills` - List skills

### Projects (AI)
- GET `/api/projects` - List projects
- POST `/api/projects/generate` - **AI Generate Project**
- PUT `/api/projects/{id}` - Update project

### CV
- GET `/api/cv/current` - Get CV
- POST `/api/cv/generate` - Generate CV

### Opportunities (AI)
- GET `/api/opportunities` - List opportunities
- POST `/api/opportunities/match` - **AI Match Jobs**

---

## 🎨 Pages

1. **/** - Landing page
2. **/login** - User login
3. **/register** - User registration
4. **/onboarding** - Setup profile
5. **/dashboard** - Main dashboard
6. **/projects** - Project management
7. **/skills** - Skill roadmap
8. **/cv** - CV generator
9. **/opportunities** - Job matching

---

## 🗄️ Database Tables

✅ Auto-created on first run:
- users
- subjects
- skills
- projects
- milestones
- cv
- opportunities

Location: `backend/edupilot.db`

---

## 🤖 AI Features

1. **Skill Roadmap** - Converts subjects → practical skills
2. **Project Generator** - Creates resume-worthy projects  
3. **CV Automation** - Generates CV from completed work
4. **Job Matching** - Finds opportunities based on skills

Powered by: **OpenAI GPT-3.5-turbo**

---

## 📊 Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy + SQLite
- OpenAI API
- JWT Authentication

### Frontend
- React 18 + Vite
- Tailwind CSS
- Zustand (State)
- Axios (HTTP)

---

## 🔧 Troubleshooting

### Backend won't start?
```powershell
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend won't start?
```powershell
cd frontend
npm install
npm run dev
```

### AI features not working?
1. Check `backend/.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...your-key...
   ```

### Database issues?
1. Delete `backend/edupilot.db`
2. Restart backend (recreates tables)

---

## ✅ Health Checks

Backend: http://localhost:8000/health  
Frontend: http://localhost:5173  
API Docs: http://localhost:8000/docs

---

## 🎯 Demo Credentials

**Test Account:**
- Email: test@example.com
- Password: Test123!

(Create during registration)

---

## 📱 Features Summary

✅ User Authentication  
✅ Multi-step Onboarding  
✅ AI Skill Roadmap Generation  
✅ AI Project Ideas  
✅ Progress Tracking  
✅ CV Auto-Generation  
✅ Job Opportunity Matching  
✅ Responsive Dashboard  
✅ Real-time Updates

---

## 🎉 That's It!

Your EduPilot application is now running and ready to use!

**Next Steps:**
1. Register an account
2. Complete onboarding  
3. Generate skills with AI
4. Create projects
5. Build your portfolio!

---

**Need help?** Check `docs/TESTING_GUIDE.md` for detailed testing instructions.

**Happy Learning! 🚀**
