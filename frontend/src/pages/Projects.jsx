import { useState, useEffect } from 'react';
import { projectService, academicService } from '../services';
import Navigation from '../components/Navigation';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, subjectsData] = await Promise.all([
        projectService.getProjects(),
        academicService.getSubjects()
      ]);
      setProjects(projectsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProject = async (subjectId) => {
    setGenerating(true);
    setError('');
    try {
      const newProject = await projectService.generateProject(subjectId);
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate project');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (projectId, status) => {
    try {
      const updated = await projectService.updateProject(projectId, { status });
      setProjects(projects.map(p => p.id === projectId ? updated : p));
      if (selectedProject?.id === projectId) {
        setSelectedProject(updated);
      }
      
      // Show CV auto-update message when project is completed
      if (status === 'completed') {
        setSuccessMessage('🎉 Project completed! Your CV has been automatically updated.');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      setError('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-gray-600">Build resume-worthy projects with AI guidance</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Generate Project Section */}
        {subjects.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">🚀 Generate New Project</h2>
            <p className="text-gray-600 mb-4">
              Select a subject to generate a tailored project idea using AI
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleGenerateProject(subject.id)}
                  disabled={generating}
                  className="border-2 border-primary-200 hover:border-primary-500 rounded-lg p-4 text-left transition disabled:opacity-50"
                >
                  <div className="font-semibold">{subject.name}</div>
                  {subject.code && (
                    <div className="text-sm text-gray-500">{subject.code}</div>
                  )}
                </button>
              ))}
            </div>
            {generating && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Generating your project...</p>
              </div>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-2 card text-center py-12">
              <p className="text-gray-500 mb-4">No projects yet. Generate your first project!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <select
                    value={project.status}
                    onChange={(e) => handleUpdateStatus(project.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                {/* Progress Bar */}
                {project.progress_percentage !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Project Details */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.difficulty_level && (
                  <div className="mb-4">
                    <span className="text-sm font-medium">Difficulty: </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
                      project.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {project.difficulty_level}
                    </span>
                  </div>
                )}

                {project.estimated_hours && (
                  <p className="text-sm text-gray-600">⏱️ Estimated: {project.estimated_hours} hours</p>
                )}

                {/* Deliverables */}
                {project.deliverables && project.deliverables.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Deliverables:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.deliverables.slice(0, 3).map((deliverable, idx) => (
                        <li key={idx}>• {deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setSelectedProject(project)}
                  className="mt-4 w-full btn-secondary text-sm"
                >
                  View Full Details →
                </button>
              </div>
            ))
          )}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{selectedProject.description}</p>

                {selectedProject.tech_stack && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech_stack.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.deliverables && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Deliverables</h3>
                    <ul className="space-y-2">
                      {selectedProject.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-600 mr-2">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.learning_outcomes && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Learning Outcomes</h3>
                    <ul className="space-y-2">
                      {selectedProject.learning_outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.evaluation_criteria && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Evaluation Criteria</h3>
                    <ul className="space-y-2">
                      {selectedProject.evaluation_criteria.map((criteria, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary-600 mr-2">★</span>
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
