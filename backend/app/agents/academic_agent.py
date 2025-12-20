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
                model="llama-3.3-70b-versatile",
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
