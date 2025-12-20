# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
Creates a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "full_name": "John Doe",
  "degree_program": "Computer Science",
  "current_year": 2,
  "current_semester": 3,
  "career_goal": "Software Engineer"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "student@university.edu",
  "full_name": "John Doe",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Login
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "student@university.edu",
    "full_name": "John Doe"
  }
}
```

### Get Current User
Returns the authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "student@university.edu",
  "full_name": "John Doe",
  "degree_program": "Computer Science",
  "current_year": 2,
  "current_semester": 3,
  "career_goal": "Software Engineer",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Academic Endpoints

### Get All Subjects
Returns all subjects for the authenticated user.

**Endpoint:** `GET /api/academic/subjects`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Data Structures & Algorithms",
    "code": "CS201",
    "semester": 3,
    "year": 2,
    "credits": 4,
    "description": "Advanced data structures and algorithm design"
  }
]
```

### Add Subject
Adds a new subject for the user.

**Endpoint:** `POST /api/academic/subjects`

**Request Body:**
```json
{
  "name": "Database Systems",
  "code": "CS301",
  "semester": 4,
  "year": 2,
  "credits": 4,
  "description": "Relational databases and SQL"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "Database Systems",
  "code": "CS301",
  "created_at": "2024-01-15T11:00:00Z"
}
```

### Get Skill Roadmap
Generates an AI-powered skill roadmap based on enrolled subjects.

**Endpoint:** `GET /api/academic/roadmap`

**Response:** `200 OK`
```json
{
  "roadmap": [
    {
      "subject": "Data Structures & Algorithms",
      "skills": [
        {
          "name": "Algorithm Design",
          "category": "Technical",
          "target_level": 80,
          "estimated_weeks": 8
        }
      ]
    }
  ]
}
```

---

## Project Endpoints

### Get All Projects
Returns all projects for the authenticated user.

**Endpoint:** `GET /api/projects`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Task Management System",
    "description": "A full-stack CRUD application",
    "status": "in_progress",
    "completion_percentage": 65,
    "start_date": "2024-01-10T00:00:00Z",
    "difficulty_level": "Intermediate"
  }
]
```

### Create Project
Manually creates a new project.

**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "title": "E-commerce Website",
  "description": "Build a complete e-commerce platform",
  "required_skills": ["React", "Node.js", "PostgreSQL"],
  "difficulty_level": "Advanced",
  "estimated_hours": 80
}
```

**Response:** `201 Created`

### Generate Project (AI)
AI generates a project based on a subject.

**Endpoint:** `POST /api/projects/generate`

**Request Body:**
```json
{
  "subject_id": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "Binary Search Tree Implementation",
  "description": "Implement a self-balancing BST with visualization",
  "problem_statement": "Create a data structure that...",
  "required_skills": ["Python", "Algorithms", "Data Structures"],
  "deliverables": ["Source code", "Unit tests", "Documentation"],
  "evaluation_criteria": ["Correctness", "Efficiency", "Code quality"]
}
```

### Update Project
Updates project status and details.

**Endpoint:** `PUT /api/projects/{id}`

**Request Body:**
```json
{
  "status": "completed",
  "completion_percentage": 100,
  "github_url": "https://github.com/user/project",
  "actual_hours": 75
}
```

**Response:** `200 OK`

---

## CV Endpoints

### Get Current CV
Returns the user's current CV.

**Endpoint:** `GET /api/cv/current`

**Response:** `200 OK`
```json
{
  "id": 1,
  "version_number": 3,
  "content": {
    "personal_info": {...},
    "education": [...],
    "skills": [...],
    "projects": [...],
    "experience": [...]
  },
  "generated_at": "2024-01-15T12:00:00Z"
}
```

### Generate CV
AI generates/updates the CV based on current progress.

**Endpoint:** `POST /api/cv/generate`

**Response:** `201 Created`
```json
{
  "id": 2,
  "version_number": 4,
  "pdf_path": "/cv_pdfs/user_1_v4.pdf",
  "generated_at": "2024-01-15T13:00:00Z"
}
```

### Download CV
Downloads the CV as a PDF.

**Endpoint:** `GET /api/cv/download`

**Query Parameters:**
- `version` (optional): CV version to download

**Response:** `200 OK`
- Content-Type: application/pdf
- Returns PDF file

---

## Opportunity Endpoints

### Get Opportunities
Returns matched opportunities for the user.

**Endpoint:** `GET /api/opportunities`

**Query Parameters:**
- `type`: `internship`, `job`, `project` (optional)
- `min_match_score`: Minimum match score (0-100)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Backend Developer Intern",
    "company": "Tech Corp",
    "description": "Summer internship for backend development",
    "required_skills": ["Python", "FastAPI", "PostgreSQL"],
    "opportunity_type": "internship",
    "location": "Remote",
    "url": "https://example.com/job/123",
    "match_score": 85,
    "is_applied": false
  }
]
```

### Match Opportunities
AI matches new opportunities based on user profile.

**Endpoint:** `POST /api/opportunities/match`

**Response:** `200 OK`
```json
{
  "new_matches": 5,
  "top_matches": [...]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- AI generation endpoints: 10 requests/minute

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Headers:**
- `X-Total-Count`: Total number of items
- `X-Page`: Current page
- `X-Per-Page`: Items per page

---

## WebSocket Endpoints (Future)

Real-time progress updates will be available via WebSocket:

```
ws://localhost:8000/ws/{user_id}
```

---

For interactive API documentation, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
