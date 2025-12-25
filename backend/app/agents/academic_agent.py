from openai import OpenAI
from config import settings
from typing import List, Dict
import json

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


class AcademicAgent:
    """AI Agent for academic planning and skill mapping."""
    
    @staticmethod
    def generate_skill_roadmap(subjects: List[Dict], career_goal: str = None) -> Dict:
        """Generate a skill roadmap from enrolled subjects."""
        
        if not subjects:
            return {
                "roadmap": [],
                "total_skills": 0,
                "estimated_weeks": 0
            }
        
        subject_list = "\n".join([f"- {s.get('name', 'Unknown')}" for s in subjects])
        
        prompt = f"""You are an academic advisor AI. Generate a practical skill roadmap.

Enrolled Subjects:
{subject_list}

Career Goal: {career_goal or 'Software Development'}

For each subject, identify 3-5 key practical skills that students should master.
Focus on real-world, resume-worthy skills.

Return a JSON with this structure:
{{
  "roadmap": [
    {{
      "subject": "Subject Name",
      "skills": [
        {{
          "name": "Skill name",
          "category": "Technical|Soft|Domain-specific",
          "target_level": 80,
          "estimated_weeks": 4,
          "why_important": "Brief explanation"
        }}
      ]
    }}
  ]
}}"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert academic advisor helping students map courses to practical skills."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # Calculate totals
            total_skills = sum(len(item.get("skills", [])) for item in result.get("roadmap", []))
            total_weeks = sum(
                skill.get("estimated_weeks", 4)
                for item in result.get("roadmap", [])
                for skill in item.get("skills", [])
            )
            
            result["total_skills"] = total_skills
            result["estimated_weeks"] = total_weeks
            
            return result
            
        except Exception as e:
            # Fallback response if API fails
            return {
                "roadmap": [
                    {
                        "subject": subjects[0].get("name", "Unknown"),
                        "skills": [
                            {
                                "name": "Problem Solving",
                                "category": "Technical",
                                "target_level": 75,
                                "estimated_weeks": 8,
                                "why_important": "Essential for all technical work"
                            }
                        ]
                    }
                ],
                "total_skills": 1,
                "estimated_weeks": 8,
                "error": str(e)
            }
    
    @staticmethod
    def generate_subject_concepts(subject_name: str) -> List[str]:
        """Generate 4-5 key concepts for a subject."""
        prompt = f"""You are an educational expert. Generate exactly 5 key fundamental concepts for the subject: {subject_name}

These should be:
- Core concepts every student must understand
- Practical and applicable
- Progressive in difficulty
- Essential for mastery

Return ONLY a JSON array of concept names (strings), nothing else.
Example: ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"]"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert educator. Return only valid JSON arrays."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            concepts = json.loads(content)
            
            # Ensure it's a list and has 5 items
            if isinstance(concepts, list):
                return concepts[:5] if len(concepts) >= 5 else concepts
            
            return [
                f"Fundamental concept of {subject_name}",
                f"Core principles in {subject_name}",
                f"Advanced topics in {subject_name}",
                f"Practical applications of {subject_name}",
                f"Real-world {subject_name} problems"
            ]
            
        except Exception as e:
            # Fallback concepts
            return [
                f"Introduction to {subject_name}",
                f"Core principles of {subject_name}",
                f"Advanced {subject_name} concepts",
                f"Applications of {subject_name}",
                f"{subject_name} best practices"
            ]
    
    @staticmethod
    def generate_project_task(subject_name: str, concepts: List[str]) -> str:
        """Generate a comprehensive project task covering all concepts."""
        concepts_text = "\n".join([f"- {c}" for c in concepts])
        
        prompt = f"""You are a professor creating a comprehensive project assignment.

Subject: {subject_name}
Key Concepts Covered:
{concepts_text}

Create a detailed project task that:
1. Covers ALL the concepts listed above
2. Is practical and hands-on
3. Takes 2-4 weeks to complete
4. Produces a deliverable (code, report, analysis, etc.)
5. Is challenging but achievable for students

Write a clear, detailed project description (200-300 words) that explains:
- What students will build/create
- Which concepts will be applied
- Expected deliverables
- Learning outcomes

Return ONLY the project description text, no JSON."""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an experienced professor who creates engaging, practical project assignments."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback task
            return f"""Project: Comprehensive {subject_name} Application

Build a complete project that demonstrates your mastery of the key concepts in {subject_name}:
{concepts_text}

Your project should integrate all these concepts into a cohesive, working solution. You may choose to create a software application, research paper, case study analysis, or practical demonstration depending on the nature of the subject.

Deliverables:
- Complete implementation or documentation
- Technical report explaining your approach
- Demonstration of each concept's application

This project will showcase your understanding and ability to apply {subject_name} principles in real-world scenarios."""

    @staticmethod
    def generate_formatted_cv(cv_data: Dict, format_type: str) -> str:
        """Generate a formatted CV based on the selected format.
        Only includes fields that have actual data - no dummy/placeholder values.
        """
        
        # Helper function to check if a value has real data
        def has_value(val):
            if val is None:
                return False
            if isinstance(val, str):
                return bool(val.strip())
            if isinstance(val, list):
                return len(val) > 0
            if isinstance(val, dict):
                return len(val) > 0
            return bool(val)
        
        # Extract CV data - only use values that exist
        full_name = cv_data.get('full_name', '') or ''
        email = cv_data.get('email', '') or ''
        phone = cv_data.get('phone', '') or ''
        location = cv_data.get('location', '') or ''
        linkedin = cv_data.get('linkedin_url', '') or ''
        github = cv_data.get('github_url', '') or ''
        portfolio = cv_data.get('portfolio_url', '') or ''
        summary = cv_data.get('summary', '') or ''
        
        education = cv_data.get('education', []) or []
        experience = cv_data.get('experience', []) or []
        technical_skills = cv_data.get('technical_skills', '') or ''
        soft_skills = cv_data.get('soft_skills', '') or ''
        languages = cv_data.get('languages', '') or ''
        certifications = cv_data.get('certifications', []) or []
        projects = cv_data.get('projects', []) or []
        
        # Build CV info dynamically - only include fields with actual data
        cv_parts = []
        
        # Name is required
        if has_value(full_name):
            cv_parts.append(f"Name: {full_name}")
        
        # Contact info - only include what's available
        contact_parts = []
        if has_value(email):
            contact_parts.append(f"Email: {email}")
        if has_value(phone):
            contact_parts.append(f"Phone: {phone}")
        if has_value(location):
            contact_parts.append(f"Location: {location}")
        if has_value(linkedin):
            contact_parts.append(f"LinkedIn: {linkedin}")
        if has_value(github):
            contact_parts.append(f"GitHub: {github}")
        if has_value(portfolio):
            contact_parts.append(f"Portfolio: {portfolio}")
        
        if contact_parts:
            cv_parts.extend(contact_parts)
        
        # Professional Summary
        if has_value(summary):
            cv_parts.append(f"\nProfessional Summary:\n{summary}")
        
        # Education
        if has_value(education):
            cv_parts.append(f"\nEducation:\n{json.dumps(education, indent=2)}")
        
        # Work Experience
        if has_value(experience):
            cv_parts.append(f"\nWork Experience:\n{json.dumps(experience, indent=2)}")
        
        # Skills - only include categories that have values
        skills_parts = []
        if has_value(technical_skills):
            skills_parts.append(f"Technical Skills: {technical_skills}")
        if has_value(soft_skills):
            skills_parts.append(f"Soft Skills: {soft_skills}")
        if has_value(languages):
            skills_parts.append(f"Languages: {languages}")
        
        if skills_parts:
            cv_parts.append("\nSkills:")
            cv_parts.extend(skills_parts)
        
        # Certifications
        if has_value(certifications):
            cv_parts.append(f"\nCertifications:\n{json.dumps(certifications, indent=2)}")
        
        # Projects
        if has_value(projects):
            cv_parts.append(f"\nProjects:\n{json.dumps(projects, indent=2)}")
        
        cv_info = "\n".join(cv_parts)
        
        # Format-specific prompts
        format_prompts = {
            "american": """Format this CV in the traditional American resume style:
- Clean, professional layout
- Start with name and contact info (centered or left-aligned)
- Professional Summary section
- Work Experience (reverse chronological, with bullet points)
- Education (degree, institution, year)
- Skills section (categorized)
- Projects section (with descriptions)
- Certifications (if applicable)
- Keep it to 1-2 pages worth of content
- Use action verbs and quantifiable achievements
- ATS-friendly formatting (no tables, simple structure)""",
            
            "european": """Format this CV in the Europass CV style:
- Personal Information section at top (name, address, phone, email)
- Professional Profile/Summary
- Work Experience (reverse chronological, detailed descriptions)
- Education and Training (with grades/achievements)
- Personal Skills (language skills with proficiency levels)
- Technical/Digital Skills
- Projects and Publications
- Certifications and Additional Information
- More detailed and comprehensive than American style
- Include language proficiency levels (A1-C2 if mentioned)""",
            
            "ats": """Format this CV optimized for Applicant Tracking Systems (ATS) with clean, professional formatting:

FORMATTING STYLE (follow exactly):
- Name at top in large bold text (centered or left-aligned)
- Contact information below name in smaller text: email • phone • location • LinkedIn • GitHub
- Clear section headers in ALL CAPS: EDUCATION, SKILLS, WORK EXPERIENCE, PROJECTS, COURSES AND CERTIFICATIONS
- Use bullet points (•) for all list items
- Date ranges aligned to the right (MM/YYYY - MM/YYYY format)
- Bold text for: job titles, company names, degree names, project titles
- Clean single-column layout
- NO colors, NO graphics, NO tables - pure text formatting only
- Standard professional fonts

CONTENT STRUCTURE:
1. FULL NAME (large, bold)
   email • phone • location • linkedin.com/in/username • github.com/username

2. PROFESSIONAL SUMMARY
   Brief 2-3 sentence summary highlighting key qualifications

3. EDUCATION
   • **Degree Name** - Institution Name                                    MM/YYYY - MM/YYYY
     GPA: X.X/4.0 (if provided)

4. SKILLS
   • **Technical Skills:** List all technical skills with commas
   • **Soft Skills:** List all soft skills with commas
   • **Languages:** List languages with proficiency levels

5. WORK EXPERIENCE
   • **Job Title** - Company Name                                          MM/YYYY - MM/YYYY
     • Achievement/responsibility with action verb and metrics
     • Achievement/responsibility with action verb and metrics
     • Achievement/responsibility with action verb and metrics

6. PROJECTS
   • **Project Name** - Technologies Used                                  MM/YYYY
     • Brief description of project impact and functionality
     • Key technologies and methodologies used

7. COURSES AND CERTIFICATIONS
   • **Certification/Course Name** - Issuing Organization                  YYYY
   
CRITICAL REQUIREMENTS:
- Use industry keywords relevant to the role
- Start bullet points with strong action verbs (Developed, Implemented, Designed, Led, etc.)
- Quantify achievements with numbers/percentages where possible
- Keep formatting simple and ATS-parseable
- Use standard section names that ATS systems recognize
- Ensure all information is clearly structured and easy to scan""",
            
            "modern": """Format this CV in a modern, creative style:
- Contemporary design elements (while keeping it professional)
- Strategic use of whitespace
- Skills highlighted prominently
- Project portfolio showcase
- Modern section names (e.g., "What I Bring", "My Journey")
- Personality and passion evident
- Tech-focused with links to GitHub, portfolio
- Emphasis on projects and hands-on experience
- Brief but impactful descriptions
- Modern tech stack and tools prominently featured""",
            
            "academic": """Format this CV in academic CV style:
- Comprehensive and detailed (can be multiple pages)
- Education section first (with thesis/dissertation topics if applicable)
- Research Experience and Publications
- Teaching Experience
- Certifications and Professional Development
- Academic Projects and Research
- Technical Skills and Laboratory Competencies
- Presentations and Conferences
- Honors and Awards
- Professional Memberships
- Detailed descriptions of research and academic work
- Focus on scholarly achievements and contributions"""
        }
        
        prompt = f"""{format_prompts.get(format_type, format_prompts['american'])}

CV Data (ONLY use the information provided below - do NOT add any dummy, placeholder, or fictional data):
{cv_info}

IMPORTANT INSTRUCTIONS:
1. Generate a professionally formatted CV in plain text that can be easily converted to PDF.
2. Use clear headers, proper spacing, and professional language.
3. Focus on making the candidate's experience and skills stand out.
4. ONLY include sections that have actual data provided above.
5. DO NOT add any dummy data, placeholder text, or fictional information.
6. If a section (like GitHub, LinkedIn, Portfolio, Experience, etc.) is not provided in the data above, DO NOT include that section or label at all.
7. Skip any fields that are empty or missing - do not show the label for missing fields.
8. Return ONLY the formatted CV text, no explanations or metadata."""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": f"You are an expert CV writer specializing in {format_type} format CVs. Create professional, compelling CVs that highlight candidates' strengths."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback CV
            return f"""ERROR GENERATING CV

{str(e)}

Please try again or contact support."""
