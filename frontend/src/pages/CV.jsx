import { useState, useEffect } from 'react';
import { cvService } from '../services';
import { useStore } from '../store';
import Navigation from '../components/Navigation';

function CV() {
  const { user } = useStore();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const data = await cvService.getCurrentCV();
      setCV(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('');
      } else {
        setError('Failed to load CV');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCV = async () => {
    setGenerating(true);
    setError('');
    try {
      const newCV = await cvService.generateCV();
      setCV(newCV);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate CV');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cv && !error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold mb-2">No CV Yet</h2>
            <p className="text-gray-600 mb-6">
              Generate your professional CV from your completed projects and skills!
            </p>
            <button
              onClick={handleGenerateCV}
              disabled={generating}
              className="btn-primary disabled:opacity-50"
            >
              {generating ? 'Generating...' : '✨ Generate CV'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My CV</h1>
            <p className="text-gray-600">Your professional resume powered by AI</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateCV}
              disabled={generating}
              className="btn-secondary disabled:opacity-50"
            >
              {generating ? 'Updating...' : '🔄 Regenerate'}
            </button>
            <button className="btn-primary">
              📥 Download PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {generating && (
          <div className="card mb-6 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your CV from projects and skills...</p>
          </div>
        )}

        {cv && (
          <div className="card">
            {/* Header */}
            <div className="border-b pb-6 mb-6">
              <h2 className="text-3xl font-bold mb-2">{user?.name || 'Your Name'}</h2>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              {cv.education && (
                <p className="text-gray-600">
                  {cv.education.degree} • Year {cv.education.year}
                </p>
              )}
              {user?.career_goal && (
                <p className="text-primary-600 font-medium mt-2">
                  Career Goal: {user.career_goal}
                </p>
              )}
            </div>

            {/* Summary */}
            {cv.summary && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                  Professional Summary
                </h3>
                <p className="text-gray-700">{cv.summary}</p>
              </div>
            )}

            {/* Skills */}
            {cv.skills && cv.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                  Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cv.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{skill.level}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cv.projects && cv.projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                  Projects
                </h3>
                <div className="space-y-4">
                  {cv.projects.map((project, idx) => (
                    <div key={idx} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold">{project.title}</h4>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            GitHub →
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{project.description}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.education && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                  Education
                </h3>
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <h4 className="font-bold">{cv.education.degree}</h4>
                  <p className="text-gray-600">
                    Year {cv.education.year} • Semester {cv.education.semester}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 mt-6 text-center text-sm text-gray-500">
              Last updated: {new Date(cv.updated_at).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 mt-6">
          <h3 className="font-bold mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-gray-700">
            Complete more projects and update your skills to enhance your CV automatically!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CV;
