import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { academicService, projectService, authService } from '../services';
import { useStore } from '../store';
import Navigation from '../components/Navigation';

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    subjects: [],
    skills: [],
    projects: [],
    completedProjects: 0,
    totalProjects: 0,
    averageSkillLevel: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [userData, subjects, skills, projects] = await Promise.all([
        authService.getCurrentUser(),
        academicService.getSubjects(),
        academicService.getSkills(),
        projectService.getProjects()
      ]);

      setUser(userData);

      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const avgSkill = skills.length > 0
        ? skills.reduce((sum, s) => sum + (s.current_level || 0), 0) / skills.length
        : 0;

      setStats({
        subjects,
        skills,
        projects,
        completedProjects,
        totalProjects: projects.length,
        averageSkillLevel: avgSkill
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      await academicService.getSkillRoadmap();
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.degree_program && `${user.degree_program} • Year ${user.current_year}`}
          </p>
          {user?.career_goal && (
            <p className="text-sm text-primary-600 mt-1">🎯 Goal: {user.career_goal}</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Subjects</p>
                <p className="text-3xl font-bold">{stats.subjects.length}</p>
              </div>
              <div className="text-4xl opacity-50">📚</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Skills</p>
                <p className="text-3xl font-bold">{stats.skills.length}</p>
              </div>
              <div className="text-4xl opacity-50">⚡</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Projects</p>
                <p className="text-3xl font-bold">{stats.completedProjects}/{stats.totalProjects}</p>
              </div>
              <div className="text-4xl opacity-50">🚀</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg Skill Level</p>
                <p className="text-3xl font-bold">{stats.averageSkillLevel.toFixed(1)}/5</p>
              </div>
              <div className="text-4xl opacity-50">📊</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Current Projects</h2>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              {stats.projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No projects yet. Start your journey!</p>
                  <button onClick={() => navigate('/projects')} className="btn-primary">
                    Generate Your First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => navigate(`/projects`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      {project.progress_percentage !== null && (
                        <div className="mt-3">
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Progress */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Skill Progress</h2>
                <button
                  onClick={() => navigate('/skills')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              {stats.skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Generate your personalized skill roadmap!</p>
                  <button onClick={handleGenerateRoadmap} className="btn-primary">
                    Generate Roadmap with AI
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.skills.slice(0, 5).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-600">
                          {skill.current_level || 0} / {skill.target_level} Level
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full"
                          style={{
                            width: `${((skill.current_level || 0) / skill.target_level) * 100}%`
                          }}
                        ></div>
                      </div>
                      {skill.category && (
                        <p className="text-xs text-gray-500 mt-1">{skill.category}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/projects')}
                  className="w-full btn-primary text-left flex items-center justify-between"
                >
                  <span>🚀 Generate Project</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/skills')}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>⚡ View Skills</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/cv')}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>📄 Generate CV</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="w-full btn-secondary text-left flex items-center justify-between"
                >
                  <span>💼 Find Opportunities</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Current Subjects */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Current Subjects</h2>
              {stats.subjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No subjects added yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.subjects.map((subject) => (
                    <div key={subject.id} className="border-l-4 border-primary-500 pl-3 py-2">
                      <p className="font-medium">{subject.name}</p>
                      {subject.code && (
                        <p className="text-xs text-gray-500">{subject.code}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
              <h3 className="font-bold mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-gray-700">
                Complete projects regularly to boost your skills and build an impressive portfolio!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
