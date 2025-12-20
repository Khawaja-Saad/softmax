import { useState, useEffect } from 'react';
import { projectService, academicService } from '../services';
import Layout from '../components/Layout';

// Inject CSS animations
const injectStyles = () => {
  if (document.getElementById('projects-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'projects-animations';
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
    
    .project-card {
      height: 280px;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .project-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    .project-card-body {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #94a3b8 #e2e8f0;
    }
    .project-card-body::-webkit-scrollbar {
      width: 4px;
    }
    .project-card-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    .project-card-body::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
    }
    .project-card-body::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
    .delete-btn {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .project-card:hover .delete-btn {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
};

// Evaluation Score Component
const EvaluationBadge = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500">Evaluation</p>
        <p className={`text-xs font-medium ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
      </div>
    </div>
  );
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    injectStyles();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, subjectsData] = await Promise.all([
        projectService.getProjects(),
        academicService.getSubjects()
      ]);
      // Sort projects by most recent first
      const sortedProjects = projectsData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.updated_at || 0);
        const dateB = new Date(b.created_at || b.updated_at || 0);
        return dateB - dateA; // Most recent first
      });
      setProjects(sortedProjects);
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

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setSuccessMessage('Project deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete project');
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
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading Projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8" style={{ fontSize: '12px' }}>
        {/* Header */}
        <div className="mb-6 animate-fadeInUp">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg p-5 text-white">
            <h1 className="text-xl font-bold mb-1">Portfolio</h1>
            <p className="text-blue-100 text-sm">Your journey of learning through hands-on projects</p>
            <p className="text-blue-100 text-sm">{projects.length} {projects.length === 1 ? 'project' : 'projects'} showcasing your skills</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm animate-fadeIn">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm animate-fadeIn">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Projects Grid - 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No Projects Yet</h3>
              <p className="text-gray-500 text-sm">Submit your first project from the Subjects page to see it here!</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card group bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Card Header */}
                <div className="bg-blue-500 px-3 py-2 text-white flex-shrink-0 relative">
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="delete-btn absolute top-1.5 right-1.5 p-1 text-white/70 hover:text-red-300 hover:bg-red-500/30 rounded transition-colors"
                    title="Delete Project"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  <h3 className="font-semibold text-sm truncate pr-6">{project.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-blue-100">
                    {project.subject_name && <span>📚 {project.subject_name}</span>}
                    {project.created_at && (
                      <span>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                  </div>
                </div>

                {/* Card Body - Scrollable */}
                <div className="project-card-body p-3">
                  {/* Description */}
                  <div className="mb-2">
                    <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                      💡 What I Learned
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {project.learning_summary || project.description || "Through this project, I gained practical experience and developed valuable skills."}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">🛠️ Tech</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">+{project.tech_stack.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-3 pt-0 mt-auto flex-shrink-0">
                  {project.github_url && project.is_coding_project !== false ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  ) : (
                    <div className="w-full bg-green-500 text-white py-1.5 px-3 rounded flex items-center justify-center gap-1.5 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-gray-100">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white p-8 rounded-t-3xl z-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
                <div className="absolute top-1/2 right-1/4 text-6xl opacity-20 animate-float">🏆</div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-extrabold mb-3 drop-shadow-lg">{selectedProject.title}</h2>
                    {selectedProject.subject_name && (
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                        <span className="text-lg">📚</span>
                        <span className="font-semibold">{selectedProject.subject_name}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="ml-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:rotate-90 border border-white/20"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                {/* Description */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Project Overview</span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed bg-gradient-to-br from-gray-50 to-blue-50/30 p-5 rounded-2xl border border-gray-100">{selectedProject.description}</p>
                </div>

                {/* Evaluation Score */}
                {selectedProject.evaluation_score && (
                  <div className="animate-fadeInUp bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-2xl p-6 border border-blue-200 shadow-lg shadow-blue-500/10" style={{ animationDelay: '0.15s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Project Evaluation</span>
                    </h3>
                    <EvaluationBadge score={selectedProject.evaluation_score} />
                  </div>
                )}

                {/* Learning Summary */}
                {selectedProject.learning_summary && (
                  <div className="animate-fadeInUp bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-green-200 shadow-lg shadow-green-500/10" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">What I Learned</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedProject.learning_summary}</p>
                  </div>
                )}

                {/* Tech Stack */}
                {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🛠️</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Technologies Used</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="tech-badge px-5 py-2.5 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 text-blue-700 rounded-xl font-semibold shadow-sm hover:shadow-md hover:from-blue-200 hover:to-cyan-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Deliverables</span>
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Outcomes */}
                {selectedProject.learning_outcomes && selectedProject.learning_outcomes.length > 0 && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Learning Outcomes</span>
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.learning_outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow duration-300">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <span className="text-white text-xs">•</span>
                          </div>
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Evaluation Criteria */}
                {selectedProject.evaluation_criteria && selectedProject.evaluation_criteria.length > 0 && (
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Evaluation Criteria</span>
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.evaluation_criteria.map((criteria, idx) => (
                        <li key={idx} className="flex items-start bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-md transition-shadow duration-300">
                          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <span className="text-white text-xs">★</span>
                          </div>
                          <span className="text-gray-700">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* GitHub Link */}
                {selectedProject.github_url && selectedProject.is_coding_project !== false && (
                  <div className="animate-fadeInUp bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 relative overflow-hidden" style={{ animationDelay: '0.45s' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative flex items-center gap-5">
                      <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl flex-shrink-0">
                        <svg className="w-full h-full text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm opacity-80 mb-2">Complete source code is available on</p>
                        <a
                          href={selectedProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-bold hover:text-cyan-300 flex items-center gap-3 group transition-colors duration-300"
                        >
                          <span>GitHub Repository</span>
                          <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn-animated w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-700 hover:via-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="text-lg">Close</span>
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Projects;
