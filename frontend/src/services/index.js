import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },
};

export const academicService = {
  getSubjects: async () => {
    const response = await api.get('/academic/subjects');
    return response.data;
  },

  addSubject: async (subjectData) => {
    const response = await api.post('/academic/subjects', subjectData);
    return response.data;
  },

  getSkillRoadmap: async () => {
    const response = await api.get('/academic/roadmap');
    return response.data;
  },
  
  getSkills: async () => {
    const response = await api.get('/academic/skills');
    return response.data;
  },
};

export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  generateProject: async (subjectId) => {
    const response = await api.post('/projects/generate', { subject_id: subjectId });
    return response.data;
  },
  
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
};

export const cvService = {
  getCurrentCV: async () => {
    const response = await api.get('/cv/current');
    return response.data;
  },

  generateCV: async () => {
    const response = await api.post('/cv/generate');
    return response.data;
  },

  generateFormattedCV: async (data) => {
    const response = await api.post('/cv/generate-formatted', data);
    return response.data;
  },

  saveCV: async (cvData) => {
    const response = await api.post('/cv/save', cvData);
    return response.data;
  },

  downloadCV: async () => {
    const response = await api.get('/cv/download', { responseType: 'blob' });
    return response.data;
  },
};

export const opportunityService = {
  getOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  matchOpportunities: async () => {
    const response = await api.post('/opportunities/match');
    return response.data;
  },
};
