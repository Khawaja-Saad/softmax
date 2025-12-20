import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { academicService, projectService, authService } from '../services';
import { useStore } from '../store';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('in_progress');
  const [animateCards, setAnimateCards] = useState(false);
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
    // Trigger animations after mount
    setTimeout(() => setAnimateCards(true), 100);
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
      const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
      
      // Count subjects by status
      const completedSubjects = subjects.filter(s => s.status === 'completed').length;
      const inProgressSubjects = subjects.filter(s => s.status === 'in_progress').length;
      
      // Calculate total concepts learned
      const totalConceptsLearned = subjects.reduce((sum, s) => {
        const concepts = s.concepts || [];
        return sum + concepts.filter(c => c.learned).length;
      }, 0);
      
      const avgSkill = skills.length > 0
        ? skills.reduce((sum, s) => sum + (s.current_level || 0), 0) / skills.length
        : 0;

      setStats({
        subjects,
        skills,
        projects,
        completedProjects,
        inProgressProjects,
        completedSubjects,
        inProgressSubjects,
        totalConceptsLearned,
        totalProjects: projects.length,
        averageSkillLevel: avgSkill
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data - Only Completed and In Progress (from database)
  const projectStatusData = [
    { name: 'Completed', value: stats.completedSubjects || 0, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressSubjects || 0, color: '#06b6d4' }
  ].filter(item => item.value > 0);

  const skillsChartData = stats.skills.slice(0, 6).map(skill => ({
    name: skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name,
    current: skill.current_level || 0,
    target: skill.target_level || 5,
    fullMark: 5
  }));

  // Subject concepts analysis data - Top 4 with highest percentage
  const subjectAnalysisData = stats.subjects
    .map(subject => {
      const concepts = subject.concepts || [];
      const learnedCount = concepts.filter(c => c.learned).length;
      const totalConcepts = concepts.length || 1;
      return {
        name: subject.name.length > 10 ? subject.name.substring(0, 10) + '...' : subject.name,
        fullName: subject.name,
        learned: learnedCount,
        remaining: totalConcepts - learnedCount,
        progress: Math.round((learnedCount / totalConcepts) * 100)
      };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  // Weekly activity mock data (based on project dates)
  const weeklyActivityData = [
    { day: 'Mon', projects: 2, skills: 3, subjects: 1 },
    { day: 'Tue', projects: 3, skills: 2, subjects: 2 },
    { day: 'Wed', projects: 1, skills: 4, subjects: 1 },
    { day: 'Thu', projects: 4, skills: 3, subjects: 3 },
    { day: 'Fri', projects: 2, skills: 5, subjects: 2 },
    { day: 'Sat', projects: 5, skills: 4, subjects: 4 },
    { day: 'Sun', projects: 3, skills: 2, subjects: 1 }
  ];

  // Calculate completion rate
  const completionRate = stats.totalProjects > 0 
    ? Math.round((stats.completedProjects / stats.totalProjects) * 100) 
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-500 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-2">
        {/* Welcome Header with Animation */}
        <div className={`mb-8 transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-2xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">
                    Welcome back, {user?.full_name || 'Student'}!
                  </h1>
                  <p className="text-white/80 text-lg">
                    {user?.degree_program && `${user.degree_program} • Year ${user.current_year}`}
                  </p>
                </div>
              </div>
              {user?.career_goal && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-xl">🎯</span>
                  <span className="font-medium">Career Goal: {user.career_goal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI Cards with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Subjects', 
              value: stats.subjects.length, 
              icon: '📚', 
              gradient: 'from-blue-500 to-blue-600',
              delay: '0ms',
              subtext: 'Active courses'
            },
            { 
              label: 'In Progress', 
              value: stats.inProgressSubjects || 0, 
              icon: '🔄', 
              gradient: 'from-cyan-500 to-teal-500',
              delay: '100ms',
              subtext: 'Currently learning'
            },
            { 
              label: 'Projects Done', 
              value: stats.completedProjects, 
              icon: '✅', 
              gradient: 'from-emerald-500 to-green-500',
              delay: '200ms',
              subtext: `${completionRate}% completion rate`
            },
            { 
              label: 'Concepts Learned', 
              value: stats.totalConceptsLearned || 0, 
              icon: '🧠', 
              gradient: 'from-violet-500 to-purple-500',
              delay: '300ms',
              subtext: 'Knowledge gained'
            }
          ].map((card, index) => (
            <div
              key={card.label}
              className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer group ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: card.delay }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{card.label}</p>
                    <p className="text-4xl font-bold">
                      {card.value}
                      {card.extra && <span className="text-2xl text-white/70">{card.extra}</span>}
                    </p>
                  </div>
                  <div className="text-4xl opacity-80 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                    {card.icon}
                  </div>
                </div>
                <p className="text-white/70 text-xs">{card.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Distribution - Enhanced */}
          <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📊
                </span>
                Subject Progress
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live
              </div>
            </div>
            {stats.subjects.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    filter="url(#shadow)"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      padding: '12px 16px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">�</span>
                </div>
                <p className="text-gray-500 mb-4">No subjects yet</p>
                <button onClick={() => navigate('/subjects')} className="btn-primary">
                  Add Your First Subject
                </button>
              </div>
            )}
          </div>

          {/* Skills Radar Chart - New */}
          <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  ⚡
                </span>
                Skills Radar
              </h2>
            </div>
            {stats.skills.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={skillsChartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target Level"
                    dataKey="target"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
                <p className="text-gray-500 mb-4">No skills tracked yet</p>
                <button onClick={() => navigate('/subjects')} className="btn-primary">
                  Start Learning
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity Area Chart */}
          <div className={`lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📈
                </span>
                Weekly Activity
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyActivityData}>
                <defs>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSubjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="projects" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorProjects)" name="Projects" />
                <Area type="monotone" dataKey="skills" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSkills)" name="Skills" />
                <Area type="monotone" dataKey="subjects" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSubjects)" name="Subjects" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Progress */}
          <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
            animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '700ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📚
                </span>
                Learning
              </h2>
            </div>
            {subjectAnalysisData.length > 0 ? (
              <div className="space-y-4">
                {subjectAnalysisData.map((subject, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]" title={subject.name}>
                        {subject.name}
                      </span>
                      <span className="text-sm font-bold text-cyan-600">{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out group-hover:shadow-lg"
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">📚</span>
                <p className="text-gray-500 text-sm mt-2">Add subjects to track</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Projects Section - Shows In Progress Subjects */}
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
          animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg text-2xl">
                🚀
              </span>
              Current Learning
            </h2>
            <button
              onClick={() => navigate('/subjects')}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {[
              { key: 'in_progress', label: 'In Progress', count: stats.inProgressSubjects || 0, color: 'cyan' },
              { key: 'completed', label: 'Completed', count: stats.completedSubjects || 0, color: 'emerald' },
              { key: 'all', label: 'All', count: stats.subjects.length, color: 'gray' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filterStatus === filter.key
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Subjects List */}
          {(() => {
            const filteredSubjects = filterStatus === 'all' 
              ? stats.subjects 
              : stats.subjects.filter(s => s.status === filterStatus);
            
            return filteredSubjects.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-5xl">📚</span>
                </div>
                <p className="text-gray-600 mb-2 font-medium">No {filterStatus !== 'all' ? filterStatus.replace('_', ' ') : ''} subjects found</p>
                <p className="text-gray-400 text-sm mb-6">Start your learning journey today!</p>
                <button onClick={() => navigate('/subjects')} className="btn-primary">
                  Add New Subject
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${filteredSubjects.length > 6 ? 'max-h-[600px] overflow-y-auto pr-2' : ''}`}>
                {filteredSubjects.map((subject, index) => {
                  const concepts = subject.concepts || [];
                  const learnedCount = concepts.filter(c => c.learned).length;
                  const totalConcepts = concepts.length || 1;
                  const progress = Math.round((learnedCount / totalConcepts) * 100);
                  
                  return (
                    <div
                      key={subject.id}
                      className="group relative overflow-hidden border-2 border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 cursor-pointer bg-white hover:-translate-y-1"
                      onClick={() => navigate('/subjects')}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 pr-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                              {subject.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{subject.description || `${concepts.length} concepts to learn`}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                            subject.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-cyan-100 text-cyan-700'
                          }`}>
                            {subject.status === 'completed' ? '✅' : '🔄'}
                            {subject.status === 'completed' ? 'Done' : 'Active'}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500 font-medium">{learnedCount}/{totalConcepts} concepts</span>
                            <span className="font-bold text-cyan-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {subject.created_at && (
                          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(subject.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
