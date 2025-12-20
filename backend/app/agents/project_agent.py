from openai import OpenAI
from config import settings
from typing import Dict
import json

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)


class ProjectAgent:
    """AI Agent for generating project ideas and requirements."""
    
    @staticmethod
    def generate_project(subject_name: str, subject_description: str = None, difficulty: str = "Intermediate") -> Dict:
        """Generate a resume-worthy project for a subject."""
        
        prompt = f"""You are a project design AI. Create a practical, resume-worthy project.

Subject: {subject_name}
Description: {subject_description or 'General course'}
Difficulty: {difficulty}

Generate a project that:
1. Demonstrates mastery of key concepts
2. Can be showcased on a resume
3. Has clear deliverables
4. Takes realistic time (20-40 hours)

Return JSON with this structure:
{{
  "title": "Project Title",
  "description": "2-3 sentence overview",
  "problem_statement": "What problem does this solve?",
  "required_skills": ["skill1", "skill2", "skill3"],
  "deliverables": ["deliverable1", "deliverable2"],
  "evaluation_criteria": ["criteria1", "criteria2"],
  "estimated_hours": 30,
  "technologies": ["tech1", "tech2"],
  "learning_outcomes": ["outcome1", "outcome2"]
}}"""

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert project designer who creates practical, resume-worthy projects for students."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback project if API fails
            return {
                "title": f"{subject_name} - Practical Implementation",
                "description": f"Build a comprehensive project demonstrating key concepts from {subject_name}",
                "problem_statement": f"Apply theoretical knowledge from {subject_name} to solve a real-world problem",
                "required_skills": ["Programming", "Problem Solving", "Documentation"],
                "deliverables": ["Source Code", "Documentation", "Test Results"],
                "evaluation_criteria": ["Functionality", "Code Quality", "Documentation"],
                "estimated_hours": 30,
                "technologies": ["To be determined"],
                "learning_outcomes": ["Practical application of course concepts"],
                "error": str(e)
            }
