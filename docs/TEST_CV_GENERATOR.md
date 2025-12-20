# Quick Test Guide - CV Generator Auto-Generation

## Test the New Auto-Generation Feature

### Prerequisites
1. Make sure backend is running (port 8000)
2. Make sure frontend is running (port 5174)
3. Have some profile data saved (go to Profile page and fill in your info)

### Test Steps

#### Test 1: Auto-Generation on Format Change
1. Navigate to **CV Generator** page
2. You should see NO "Generate CV" button anymore
3. If you have profile data saved, CV should auto-generate with American format (default)
4. Click on **European Format** radio button
   - CV should automatically regenerate in European style
   - You should see a loading spinner while generating
5. Click on **ATS Optimized** radio button
   - CV should automatically regenerate in ATS style
   - Should see clean formatting: ALL CAPS headers, bullet points, right-aligned dates
6. Try switching between all 5 formats - each should auto-generate

#### Test 2: ATS Format Verification
When you select **ATS Optimized**, verify the format has:
- ✅ Name in bold at top
- ✅ Contact info: email • phone • location • LinkedIn • GitHub
- ✅ Section headers in ALL CAPS (EDUCATION, SKILLS, WORK EXPERIENCE, etc.)
- ✅ Bullet points for all items
- ✅ Dates on the right side (MM/YYYY - MM/YYYY)
- ✅ Bold text for job titles, company names, project names
- ✅ Clean, simple formatting with no colors

#### Test 3: PDF Download
1. After CV is generated in any format
2. Click **Download PDF** button (top right)
3. PDF should download with proper formatting
4. Test PDF download for all 5 formats

#### Test 4: Error Handling
1. Create a new user account (or use account with no profile data)
2. Go to CV Generator
3. Should see error message: "Please complete your profile first before generating CV"
4. No crash or infinite loading

#### Test 5: Loading States
1. Select a format
2. While CV is generating, you should see:
   - Loading spinner
   - "Generating your professional CV..." message
3. CV should appear after generation completes

### Expected Behavior

✅ **Working Correctly:**
- CV auto-generates when format is selected
- Smooth transitions between formats
- No manual "Generate CV" button visible
- ATS format has clean, professional formatting
- PDF downloads work properly
- Error messages show if profile is incomplete

❌ **Issues to Report:**
- CV doesn't generate automatically
- Loading state gets stuck
- Format switching doesn't work
- ATS format doesn't match standards
- PDF download fails

### Sample Profile Data (if needed)

If you need to test with sample data, fill in Profile page with:
- **Name:** John Doe
- **Email:** john.doe@example.com
- **Phone:** +1 234-567-8900
- **Location:** New York, NY
- **LinkedIn:** linkedin.com/in/johndoe
- **GitHub:** github.com/johndoe

**Education:**
- Degree: Bachelor of Science in Computer Science
- Institution: University of Technology
- Year: 2020-2024
- GPA: 3.8

**Experience:**
- Title: Software Developer Intern
- Company: Tech Corp
- Duration: Jun 2023 - Aug 2023
- Description: Developed web applications using React and Node.js

**Skills:**
- Technical: Python, JavaScript, React, Node.js, PostgreSQL
- Soft: Communication, Teamwork, Problem Solving
- Languages: English (Native), Spanish (Intermediate)

**Projects:**
- Title: Task Management App
- Description: Full-stack web application for task tracking
- Technologies: React, Express, MongoDB
- URL: github.com/johndoe/task-app

**Certifications:**
- Name: AWS Certified Developer
- Issuer: Amazon Web Services
- Year: 2023

---

## Quick Commands

### Start Backend
```powershell
cd d:\University\EduPilot\backend
python -m uvicorn main:app --reload
```

### Start Frontend
```powershell
cd d:\University\EduPilot\frontend
npm run dev
```

### Check if Services are Running
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:5174

---

**Happy Testing! 🚀**
