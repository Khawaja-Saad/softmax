import { useState, useEffect } from 'react';
import { academicService } from '../services';
import Layout from '../components/Layout';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [groupedSkills, setGroupedSkills] = useState({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await academicService.getSkills();
      setSkills(data);
      groupSkillsByCategory(data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const groupSkillsByCategory = (skillsList) => {
    const grouped = skillsList.reduce((acc, skill) => {
      const category = skill.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
    setGroupedSkills(grouped);
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setError('');
    try {
      await academicService.getSkillRoadmap();
      await fetchSkills();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate skill roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Skills Roadmap</h1>
            <p className="text-gray-600">Track your skill development journey</p>
          </div>
          {skills.length === 0 && (
            <button
              onClick={handleGenerateRoadmap}
              disabled={generating}
              className="btn-primary disabled:opacity-50"
            >
              {generating ? 'Generating...' : '✨ Generate Roadmap with AI'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {generating && (
          <div className="card mb-8 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your subjects and creating a personalized skill roadmap...</p>
          </div>
        )}

        {skills.length === 0 && !generating ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">No Skills Yet</h2>
            <p className="text-gray-600 mb-6">
              Generate your AI-powered skill roadmap based on your subjects!
            </p>
            <button onClick={handleGenerateRoadmap} className="btn-primary">
              Generate Roadmap with AI
            </button>
          </div>
        ) : (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p className="text-blue-100 text-sm mb-1">Total Skills</p>
                <p className="text-3xl font-bold">{skills.length}</p>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <p className="text-green-100 text-sm mb-1">Categories</p>
                <p className="text-3xl font-bold">{Object.keys(groupedSkills).length}</p>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <p className="text-purple-100 text-sm mb-1">Average Progress</p>
                <p className="text-3xl font-bold">
                  {skills.length > 0
                    ? Math.round(
                        (skills.reduce((sum, s) => sum + ((s.current_level || 0) / s.target_level) * 100, 0) /
                          skills.length)
                      )
                    : 0}%
                </p>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <p className="text-orange-100 text-sm mb-1">Mastered</p>
                <p className="text-3xl font-bold">
                  {skills.filter(s => (s.current_level || 0) >= s.target_level).length}
                </p>
              </div>
            </div>

            {/* Skills by Category */}
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="card mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="w-1 h-6 bg-primary-600 rounded mr-3"></span>
                  {category}
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {categorySkills.length} skills
                  </span>
                </h2>

                <div className="space-y-4">
                  {categorySkills.map((skill) => {
                    const progress = ((skill.current_level || 0) / skill.target_level) * 100;
                    return (
                      <div key={skill.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{skill.name}</h3>
                            {skill.description && (
                              <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm font-medium">
                              Level {skill.current_level || 0} / {skill.target_level}
                            </div>
                            <div className="text-xs text-gray-500">
                              {progress.toFixed(0)}% Complete
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Skill Details */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {skill.priority && (
                            <div className="flex items-center">
                              <span className="font-medium mr-1">Priority:</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                skill.priority === 'high' ? 'bg-red-100 text-red-700' :
                                skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {skill.priority}
                              </span>
                            </div>
                          )}
                          {skill.estimated_hours && (
                            <div>
                              <span className="font-medium">Time:</span> {skill.estimated_hours}h
                            </div>
                          )}
                        </div>

                        {/* Resources */}
                        {skill.resources && skill.resources.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-500 mb-2">Learning Resources:</p>
                            <div className="flex flex-wrap gap-2">
                              {skill.resources.map((resource, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Regenerate Button */}
            <div className="card bg-primary-50 text-center py-8">
              <h3 className="font-bold mb-2">Need to update your roadmap?</h3>
              <p className="text-gray-600 mb-4">
                Regenerate your skill roadmap based on your current subjects
              </p>
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="btn-primary disabled:opacity-50"
              >
                {generating ? 'Generating...' : '🔄 Regenerate Roadmap'}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Skills;
