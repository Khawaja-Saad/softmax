# EduPilot Testing Guide

## 🧪 How to Test the Complete Application

### Prerequisites
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:5173
- ✅ OpenAI API key configured in backend/.env

---

## 📋 Test Scenarios

### 1. User Registration & Login
**Steps:**
1. Go to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Fill in registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!@#
4. Click "Register"
5. Should redirect to onboarding page

**Expected Result:** ✅ User account created, redirected to onboarding

---

### 2. Onboarding Process
**Steps:**
1. Step 1: Academic Information
   - Degree: Computer Science
   - Year: 3
   - Semester: 5
   - Career Goal: Software Engineer
   - Click "Continue"
2. Step 2: Add Subjects
   - Subject 1: Data Structures
   - Code: CS201
   - Credits: 4
   - Click "Add Another Subject"
   - Subject 2: Web Development
   - Code: CS301
   - Credits: 3
   - Click "Complete Setup"

**Expected Result:** ✅ Profile created, subjects added, redirected to dashboard

---

### 3. Dashboard Overview
**Steps:**
1. View dashboard after onboarding
2. Check statistics cards:
   - Subjects: Should show 2
   - Skills: 0 (not generated yet)
   - Projects: 0/0
   - Avg Skill Level: 0.0

**Expected Result:** ✅ Dashboard loads with correct stats

---

### 4. Generate Skill Roadmap (AI)
**Steps:**
1. Click "View Skills" from Quick Actions
2. Click "✨ Generate Roadmap with AI"
3. Wait for AI to generate skills (10-15 seconds)
4. View generated skills organized by category

**Expected Result:** 
✅ AI generates 5-10 skills based on subjects
✅ Skills show:
- Name, description
- Current level / Target level
- Category (Technical, Soft Skills, etc.)
- Priority (High/Medium/Low)
- Time estimates
- Learning resources
- Progress bars

---

### 5. Generate AI Project
**Steps:**
1. Click "Generate Project" from dashboard
2. Select a subject (e.g., "Data Structures")
3. Wait for AI to generate project (5-10 seconds)
4. View project details:
   - Title
   - Description
   - Tech stack
   - Difficulty level
   - Deliverables
   - Learning outcomes
   - Evaluation criteria

**Expected Result:** 
✅ AI creates a unique, resume-worthy project
✅ Project appears in dashboard and Projects page
✅ Status initially "Not Started"

---

### 6. Update Project Status
**Steps:**
1. Go to Projects page
2. Change project status from dropdown:
   - Not Started → In Progress → Completed
3. View progress percentage update

**Expected Result:** 
✅ Status updates immediately
✅ Color changes based on status
✅ Dashboard reflects changes

---

### 7. Generate CV
**Steps:**
1. First, mark at least one project as "Completed"
2. Go to CV page
3. Click "✨ Generate CV"
4. Wait for CV generation (2-3 seconds)
5. View generated CV with:
   - Personal info
   - Professional summary
   - Skills with progress bars
   - Completed projects
   - Education

**Expected Result:** 
✅ CV auto-generated from projects and skills
✅ Professional formatting
✅ All sections populated
✅ Regenerate button available

---

### 8. Find Career Opportunities (AI)
**Steps:**
1. Ensure you have generated skills (step 4)
2. Go to Opportunities page
3. Click "✨ Find Matches"
4. Wait for AI matching (3-5 seconds)
5. View matched opportunities:
   - Internships
   - Full-time jobs
   - Research positions
6. Check match scores (80%+ = excellent match)
7. Filter by type (Internship/Job/Research)

**Expected Result:** 
✅ 4-6 opportunities matched
✅ Match scores displayed
✅ Required skills listed
✅ Filter functionality works

---

## 🔍 API Testing (Optional)

### Using FastAPI Docs
1. Go to http://localhost:8000/docs
2. Click "Authorize" button
3. Login to get JWT token
4. Test endpoints:

**Test Auth:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

**Test Academic:**
- GET /api/academic/subjects
- POST /api/academic/subjects
- GET /api/academic/roadmap (AI)
- GET /api/academic/skills

**Test Projects:**
- GET /api/projects
- POST /api/projects/generate (AI)
- PUT /api/projects/{id}

**Test CV:**
- GET /api/cv/current
- POST /api/cv/generate

**Test Opportunities:**
- GET /api/opportunities
- POST /api/opportunities/match (AI)

---

## 🎯 Feature Checklist

### Authentication ✅
- [ ] User can register
- [ ] User can login
- [ ] Token persists in localStorage
- [ ] Protected routes work
- [ ] Logout works

### Onboarding ✅
- [ ] Multi-step form works
- [ ] Validation on both steps
- [ ] Can add multiple subjects
- [ ] Can remove subjects
- [ ] Profile updates correctly

### Dashboard ✅
- [ ] Shows correct statistics
- [ ] Quick actions navigate correctly
- [ ] Projects display properly
- [ ] Skills show progress
- [ ] Subjects list appears

### Skills (AI) ✅
- [ ] AI generates roadmap
- [ ] Skills grouped by category
- [ ] Progress bars work
- [ ] Statistics accurate
- [ ] Can regenerate roadmap

### Projects (AI) ✅
- [ ] AI generates unique projects
- [ ] Can select different subjects
- [ ] Status dropdown works
- [ ] Project details modal opens
- [ ] Progress updates

### CV Generation ✅
- [ ] CV auto-generates
- [ ] Shows completed projects
- [ ] Displays skills
- [ ] Professional formatting
- [ ] Can regenerate

### Opportunities (AI) ✅
- [ ] AI matches opportunities
- [ ] Match scores displayed
- [ ] Filters work
- [ ] Statistics accurate
- [ ] Can refresh matches

---

## ⚠️ Common Issues & Solutions

### Issue: "Failed to generate roadmap"
**Solution:** Check OpenAI API key in backend/.env

### Issue: "No CV found"
**Solution:** Complete at least one project first, then generate CV

### Issue: "Failed to match opportunities"
**Solution:** Generate skill roadmap first (need skills for matching)

### Issue: Tailwind CSS warnings
**Solution:** These are normal - CSS IntelliSense warnings. App works fine.

### Issue: Backend not responding
**Solution:** 
1. Check if backend is running: http://localhost:8000/health
2. Restart backend: `cd backend && python main.py`

### Issue: Frontend not loading
**Solution:**
1. Check if frontend is running: http://localhost:5173
2. Restart frontend: `cd frontend && npm run dev`

---

## 🎬 Demo Flow (5 minutes)

**Perfect demonstration sequence:**

1. **Register** (30s) - Create account
2. **Onboard** (1m) - Add degree, subjects, career goal
3. **Dashboard** (30s) - Show personalized dashboard
4. **Generate Skills** (30s) - AI creates skill roadmap
5. **Generate Project** (30s) - AI creates project idea
6. **Update Project** (20s) - Mark as completed
7. **Generate CV** (30s) - Auto-create resume
8. **Find Opportunities** (40s) - AI matches jobs
9. **Summary** (30s) - Show complete journey

**Total: 5 minutes** for complete demo! ⏱️

---

## 📊 Expected AI Responses

### Skill Roadmap Example:
```json
{
  "skills": [
    {
      "name": "Python Programming",
      "category": "Technical",
      "target_level": 4,
      "priority": "high",
      "estimated_hours": 40
    },
    {
      "name": "Data Structures",
      "category": "Technical", 
      "target_level": 5,
      "priority": "high",
      "estimated_hours": 60
    }
  ]
}
```

### Project Example:
```json
{
  "title": "E-Commerce Product Recommendation System",
  "description": "Build a recommendation engine using collaborative filtering",
  "tech_stack": ["Python", "Pandas", "Scikit-learn"],
  "difficulty_level": "intermediate",
  "estimated_hours": 25,
  "deliverables": [
    "Recommendation algorithm implementation",
    "User interface",
    "Testing suite"
  ]
}
```

---

## ✅ Success Criteria

The project is working correctly if:

1. ✅ All pages load without errors
2. ✅ User can complete full registration flow
3. ✅ AI generates skills from subjects
4. ✅ AI generates unique project ideas
5. ✅ CV auto-creates from completed work
6. ✅ Opportunities match with good scores
7. ✅ Dashboard updates in real-time
8. ✅ All navigation works smoothly
9. ✅ Data persists in database
10. ✅ JWT authentication secure

---

## 🎉 You're Ready!

If all tests pass, your EduPilot application is fully functional and ready for:
- 🎬 Demo presentations
- 🧪 User testing
- 📊 Feature additions
- 🚀 Deployment to production
- 🏆 Hackathon submission

**Happy Testing! 🚀**
