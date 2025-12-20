import { useState, useEffect } from 'react';
import { opportunityService } from '../services';
import Navigation from '../components/Navigation';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, internship, job, research

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      if (err.response?.status === 404 || !opportunities.length) {
        // No opportunities yet
      } else {
        setError('Failed to load opportunities');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMatchOpportunities = async () => {
    setMatching(true);
    setError('');
    try {
      const response = await opportunityService.matchOpportunities();
      setOpportunities(response.opportunities);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to match opportunities');
    } finally {
      setMatching(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'internship':
        return 'bg-blue-100 text-blue-700';
      case 'job':
        return 'bg-green-100 text-green-700';
      case 'research':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredOpportunities = opportunities.filter(
    opp => filter === 'all' || opp.type === filter
  );

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
            <h1 className="text-3xl font-bold mb-2">Career Opportunities</h1>
            <p className="text-gray-600">AI-matched opportunities based on your skills</p>
          </div>
          <button
            onClick={handleMatchOpportunities}
            disabled={matching}
            className="btn-primary disabled:opacity-50"
          >
            {matching ? 'Matching...' : '✨ Find Matches'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {matching && (
          <div className="card mb-6 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your profile and matching opportunities...</p>
          </div>
        )}

        {opportunities.length === 0 && !matching ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-2">No Opportunities Yet</h2>
            <p className="text-gray-600 mb-6">
              Let AI find matching career opportunities based on your skills!
            </p>
            <button onClick={handleMatchOpportunities} className="btn-primary">
              Find Matching Opportunities
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p className="text-blue-100 text-sm mb-1">Total Matches</p>
                <p className="text-3xl font-bold">{opportunities.length}</p>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <p className="text-green-100 text-sm mb-1">Internships</p>
                <p className="text-3xl font-bold">
                  {opportunities.filter(o => o.type === 'internship').length}
                </p>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <p className="text-purple-100 text-sm mb-1">Full-Time</p>
                <p className="text-3xl font-bold">
                  {opportunities.filter(o => o.type === 'job').length}
                </p>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <p className="text-orange-100 text-sm mb-1">Applied</p>
                <p className="text-3xl font-bold">
                  {opportunities.filter(o => o.applied).length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded font-medium ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({opportunities.length})
                </button>
                <button
                  onClick={() => setFilter('internship')}
                  className={`px-4 py-2 rounded font-medium ${
                    filter === 'internship'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Internships ({opportunities.filter(o => o.type === 'internship').length})
                </button>
                <button
                  onClick={() => setFilter('job')}
                  className={`px-4 py-2 rounded font-medium ${
                    filter === 'job'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Full-Time ({opportunities.filter(o => o.type === 'job').length})
                </button>
                <button
                  onClick={() => setFilter('research')}
                  className={`px-4 py-2 rounded font-medium ${
                    filter === 'research'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Research ({opportunities.filter(o => o.type === 'research').length})
                </button>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-6">
              {filteredOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="card hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{opportunity.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                          {opportunity.type}
                        </span>
                        {opportunity.applied && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            ✓ Applied
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 font-medium">{opportunity.company}</p>
                      <p className="text-sm text-gray-500">{opportunity.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getMatchColor(opportunity.match_score)}`}>
                        {opportunity.match_score}%
                      </div>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{opportunity.description}</p>

                  {/* Required Skills */}
                  {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.required_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <a
                      href={opportunity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1"
                    >
                      View Details →
                    </a>
                    {!opportunity.applied && (
                      <button className="btn-secondary flex-1">
                        Mark as Applied
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="card bg-primary-50 text-center py-8 mt-8">
              <h3 className="font-bold mb-2">Looking for more opportunities?</h3>
              <p className="text-gray-600 mb-4">
                Refresh to get the latest matches based on your current skills
              </p>
              <button
                onClick={handleMatchOpportunities}
                disabled={matching}
                className="btn-primary disabled:opacity-50"
              >
                {matching ? 'Matching...' : '🔄 Refresh Matches'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Opportunities;
