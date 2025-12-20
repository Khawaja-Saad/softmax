CONTEXT.md
AI-Powered Student Career & Learning Co-Pilot
________________________________________
1. Project Overview
Project Name (Working)
EduPilot – An AI-Driven Academic & Career Journey Co-Pilot for University Students
One-Line Description
EduPilot is a web-based, AI-powered platform that guides students throughout their academic journey by converting university courses into skill roadmaps, real-world projects, and continuously updated career assets (CV, portfolio, opportunities).
Problem Statement
Most university students focus only on academics and realize too late—often at graduation—that they lack:
•	Practical projects
•	Industry-ready skills
•	A strong CV or portfolio
•	Professional visibility
•	Consistent career planning
EduPilot solves this by acting as a long-term educational and career guidance system, ensuring students graduate with demonstrable skills, projects, and career readiness—not just a degree.
________________________________________
2. Target Users
•	Undergraduate students (Years 1–4)
•	Technical & non-technical degree students
•	Career-focused learners
•	Universities & education platforms (future B2B scope)
________________________________________
3. Core Objectives
•	Convert academic coursework into practical, showcase-ready projects
•	Maintain consistent progress over multiple years
•	Automatically generate and update CVs and professional content
•	Reduce overwhelm through structured, AI-driven planning
•	Improve educational outcomes, not just grades
________________________________________
4. System Architecture (High Level)
The system follows a modular AI-agent architecture:
Frontend (Web App)
   |
Backend API (Node.js / FastAPI)
   |
AI Services Layer
   ├── Academic Planning Agent
   ├── Project Generation Agent
   ├── Progress & Consistency Agent
   ├── CV & Content Generation Agent
   └── Opportunity Matching Agent
   |
Database (User, Progress, Projects)
________________________________________
5. Environment Setup
5.1 Prerequisites
Ensure the following are installed:
•	Node.js (v18+)
•	Python (v3.10+)
•	Git
•	PostgreSQL or MongoDB
•	OpenAI API key (or any LLM provider)
•	Basic knowledge of REST APIs
________________________________________
5.2 Frontend Setup
Recommended Stack
•	React + Vite
•	Tailwind CSS
•	Axios
cd frontend
npm install
npm run dev
Environment variables (.env):
VITE_API_BASE_URL=http://localhost:8000
________________________________________
5.3 Backend Setup
Recommended Stack
•	FastAPI (Python) or Node.js (Express)
•	JWT Authentication
•	ORM (SQLAlchemy / Prisma)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Environment variables (.env):
OPENAI_API_KEY=your_key_here
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
________________________________________
5.4 Database Schema (Core Tables)
•	Users
•	Degrees
•	Subjects
•	Skills
•	Projects
•	Milestones
•	CV Versions
•	Opportunities
________________________________________
6. Project Flow (End-to-End)
Step 1: User Onboarding
User provides:
•	Degree program
•	Current year/semester
•	Subjects enrolled
•	Career goal (e.g., Software Engineer, Data Analyst)
________________________________________
Step 2: Academic Skill Mapping
The Academic Planning Agent:
•	Breaks subjects into core concepts
•	Maps concepts to real-world skills
•	Defines expected skill level after each semester
Output
•	Personalized learning roadmap
•	Weekly & monthly goals
________________________________________
Step 3: Project Generation
For each major subject:
•	AI generates a resume-worthy project
•	Project includes:
o	Problem statement
o	Required concepts
o	Deliverables
o	Evaluation criteria
Example:
“After completing Programming Fundamentals, build a CRUD-based mini application demonstrating OOP and data handling.”
________________________________________
Step 4: Progress Tracking & Consistency
The system:
•	Tracks milestones
•	Adjusts timelines if progress slows
•	Prevents overload through adaptive pacing
User sees:
•	Progress dashboard
•	Upcoming goals
•	Skill mastery indicators
________________________________________
Step 5: CV & Portfolio Automation
When a milestone is completed:
•	CV updates automatically
•	Project descriptions are generated
•	Skills are added with evidence
Output formats:
•	PDF CV
•	Web portfolio (future scope)
________________________________________
Step 6: Professional Content Generation
The platform:
•	Generates professional updates (e.g., project completion summaries)
•	Schedules content drafts
•	Keeps a consistent professional narrative
(Auto-posting can be optional or simulated in MVP)
________________________________________
Step 7: Opportunity Matching
The Opportunity Agent:
•	Matches user profile with internships & entry-level roles
•	Highlights best-fit opportunities
•	Tracks applications and interview status
________________________________________
7. Complete Feature List
Academic Features
•	Degree-aligned learning roadmap
•	Subject-wise skill breakdown
•	AI-guided mastery checkpoints
Project Features
•	One major project per key subject
•	Increasing difficulty over time
•	Resume-validated outcomes
Career Features
•	Auto-generated CV
•	Skill-evidence mapping
•	Internship & job matching
Productivity & Balance
•	Realistic goal pacing
•	Burnout prevention logic
•	Long-term consistency focus
________________________________________
8. MVP Scope (Hackathon Version)
Included in MVP
•	User onboarding
•	One subject → skill roadmap
•	One AI-generated project
•	CV auto-update
•	Dashboard view
Excluded from MVP
•	Full automation of applications
•	Social media API posting
•	Advanced health analytics
________________________________________
9. Future Enhancements
•	University LMS integration
•	Blockchain-based skill certificates
•	Multi-language support
•	Institutional dashboards
•	Peer collaboration features
________________________________________
10. Expected Impact
•	Students graduate with proof of skills
•	Reduced skill-degree mismatch
•	Higher employability
•	Structured, stress-free learning journeys
________________________________________
11. Hackathon Value Proposition
“EduPilot ensures no student ever graduates with a blank CV again.”
This project demonstrates:
•	Real educational impact
•	Scalable startup potential
•	Advanced AI usage
•	Clear problem-solution alignment
________________________________________
12. Repository Structure (Suggested)
/frontend
/backend
/docs
  └── CONTEXT.md
README.md
________________________________________
13. License
MIT License (recommended for hackathons)