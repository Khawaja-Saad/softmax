import { useState, useEffect } from 'react';
import { authService } from '../services';
import Layout from '../components/Layout';

function Opportunities() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Inject animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-shimmer { 
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
      .animate-bounce { animation: bounce 2s ease-in-out infinite; }
      .job-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .job-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      }
      .stat-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .stat-card:hover {
        transform: translateY(-5px) scale(1.05);
      }
      .filter-btn {
        transition: all 0.3s ease;
      }
      .filter-btn:hover {
        transform: translateY(-2px);
      }
      .apply-btn {
        position: relative;
        overflow: hidden;
      }
      .apply-btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      .apply-btn:hover::after {
        width: 300px;
        height: 300px;
      }
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getCurrentUser();
      setUserProfile(profile);
      // Load all jobs initially, or personalized if career_goal exists
      if (profile?.career_goal) {
        setSearchQuery(profile.career_goal);
        fetchJobs(profile.career_goal);
      } else {
        // Load all jobs when no career goal is set
        fetchJobs();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Load all jobs on error
      fetchJobs();
    }
  };

  const fetchJobs = async (query = '', location = '', remote = null) => {
    setSearching(true);
    setError('');
    try {
      // Build query params - only add if they have values
      const params = new URLSearchParams();
      if (query && query.trim()) {
        params.append('search', query.trim());
      }
      if (location && location.trim()) {
        params.append('location', location.trim());
      }
      if (remote !== null) {
        params.append('remote', remote);
      }
      params.append('sort_by', 'relevance');

      // Use backend proxy to avoid CORS issues
      const response = await fetch(
        `http://localhost:8000/api/opportunities/jobs?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data.results || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job opportunities. Please try again.');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery, locationFilter, remoteOnly ? true : null);
  };

  const handleRemoteToggle = () => {
    const newRemoteOnly = !remoteOnly;
    setRemoteOnly(newRemoteOnly);
    fetchJobs(searchQuery, locationFilter, newRemoteOnly ? true : null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setRemoteOnly(false);
    setFilter('all');
    fetchJobs();
  };

  const getEmploymentTypeColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-700';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('full')) return 'bg-emerald-100 text-emerald-700';
    if (lowerType.includes('part')) return 'bg-blue-100 text-blue-700';
    if (lowerType.includes('contract')) return 'bg-purple-100 text-purple-700';
    if (lowerType.includes('intern')) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'remote' && job.remote) return true;
    if (filter === 'fulltime' && job.employment_type?.toLowerCase().includes('full')) return true;
    if (filter === 'parttime' && job.employment_type?.toLowerCase().includes('part')) return true;
    return false;
  });

  const remoteCount = jobs.filter(j => j.remote).length;
  const fullTimeCount = jobs.filter(j => j.employment_type?.toLowerCase().includes('full')).length;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-bounce">💼</span>
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg animate-pulse">Finding opportunities for you...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        {/* Beautiful Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 mb-8 overflow-hidden animate-fadeInUp shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 right-1/4 text-6xl opacity-20 animate-float">🚀</div>
          <div className="absolute top-1/4 right-1/3 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>💼</div>
          <div className="absolute bottom-1/4 right-1/2 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>⭐</div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-3 drop-shadow-lg">
                  Career Opportunities 🎯
                </h1>
                <p className="text-indigo-100 text-lg">
                  {userProfile?.career_goal 
                    ? `Personalized jobs matching your goal: "${userProfile.career_goal}"`
                    : 'Discover amazing job opportunities tailored for you'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="mt-6 space-y-4">
              {/* Main Search Row */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs by title, skill, or keyword... (leave empty for all jobs)"
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all duration-300"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                </div>
                <div className="md:w-64 relative">
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Location (e.g., London)"
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all duration-300"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Remote Toggle */}
                <button
                  type="button"
                  onClick={handleRemoteToggle}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    remoteOnly 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
                  }`}
                >
                  <span>🏠</span>
                  <span>Remote Only</span>
                  {remoteOnly && <span>✓</span>}
                </button>

                {/* Clear Filters */}
                {(searchQuery || locationFilter || remoteOnly) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium bg-red-500/80 text-white hover:bg-red-500 transition-all duration-300"
                  >
                    <span>✕</span>
                    <span>Clear Filters</span>
                  </button>
                )}

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={searching}
                  className="apply-btn ml-auto px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <span>Search Jobs</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 animate-fadeIn flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Jobs</p>
                <p className="text-4xl font-bold">{jobs.length}</p>
              </div>
              <div className="text-5xl opacity-80 animate-bounce">💼</div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Remote Jobs</p>
                <p className="text-4xl font-bold">{remoteCount}</p>
              </div>
              <div className="text-5xl opacity-80 animate-bounce" style={{ animationDelay: '0.3s' }}>🏠</div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Full-Time</p>
                <p className="text-4xl font-bold">{fullTimeCount}</p>
              </div>
              <div className="text-5xl opacity-80 animate-bounce" style={{ animationDelay: '0.6s' }}>⏰</div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm mb-1">Companies</p>
                <p className="text-4xl font-bold">{new Set(jobs.map(j => j.company_name)).size}</p>
              </div>
              <div className="text-5xl opacity-80 animate-bounce" style={{ animationDelay: '0.9s' }}>🏢</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Jobs', icon: '📋', count: jobs.length },
              { key: 'remote', label: 'Remote', icon: '🏠', count: remoteCount },
              { key: 'fulltime', label: 'Full-Time', icon: '⏰', count: fullTimeCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`filter-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.key ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl animate-scaleIn">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No Jobs Found</h2>
            <p className="text-gray-600 text-lg mb-6">Try a different search term or clear filters</p>
            <button
              onClick={handleClearFilters}
              className="apply-btn px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Show All Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id || index}
                className="job-card group bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp border border-gray-100"
                style={{ animationDelay: `${0.1 * (index % 10)}s` }}
              >
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors duration-300">
                        {job.role || 'Software Developer'}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-lg">🏢</span>
                        <span className="font-medium">{job.company_name || 'Company'}</span>
                      </div>
                    </div>
                    {job.remote && (
                      <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                        🏠 Remote
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{job.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>🕐</span>
                      <span>{formatDate(job.date_posted)}</span>
                    </div>
                    {job.employment_type && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentTypeColor(job.employment_type)}`}>
                        {job.employment_type}
                      </span>
                    )}
                  </div>

                  {job.text && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.text.replace(/<[^>]*>/g, '').substring(0, 200)}...
                    </p>
                  )}

                  {job.keywords && job.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.keywords.slice(0, 5).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium hover:scale-105 transition-transform duration-200"
                          >
                            {keyword}
                          </span>
                        ))}
                        {job.keywords.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            +{job.keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn w-full block text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Apply Now</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="mt-12 text-center animate-fadeInUp">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-100">
              <div className="text-5xl mb-4 animate-bounce">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Want more opportunities?</h3>
              <p className="text-gray-600 mb-6">Try searching with different keywords or clear filters to see all jobs</p>
              <button
                onClick={handleClearFilters}
                disabled={searching}
                className="apply-btn px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {searching ? 'Loading...' : '🔄 Show All Jobs'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Opportunities;
