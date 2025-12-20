import { useState, useEffect } from 'react';
import { cvService } from '../services';
import { useStore } from '../store';
import Layout from '../components/Layout';

// CSS Animation Styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% { 
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
    }
  }
  
  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse-border {
    0%, 100% { border-color: rgba(59, 130, 246, 0.3); }
    50% { border-color: rgba(59, 130, 246, 0.8); }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-bounce-soft {
    animation: bounce-soft 2s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .animate-slide-in-left {
    animation: slide-in-left 0.5s ease-out forwards;
  }
  
  .profile-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .profile-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #06b6d4, #10b981);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  .profile-card:hover::before {
    transform: scaleX(1);
  }
  
  .profile-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .input-enhanced {
    transition: all 0.3s ease;
    border: 2px solid #e5e7eb;
  }
  
  .input-enhanced:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  .input-enhanced:hover:not(:focus) {
    border-color: #93c5fd;
  }
  
  .array-item {
    transition: all 0.3s ease;
    position: relative;
  }
  
  .array-item:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }
  
  .array-item::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #3b82f6, #06b6d4);
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .array-item:hover::after {
    opacity: 1;
  }
  
  .add-btn {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .add-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .add-btn:hover::before {
    opacity: 1;
  }
  
  .add-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: scale(1.02);
  }
  
  .save-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .save-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }
  
  .save-btn:hover::before {
    left: 100%;
  }
  
  .save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
  }
  
  .remove-btn {
    transition: all 0.2s ease;
  }
  
  .remove-btn:hover {
    transform: scale(1.1);
    color: #ef4444;
  }
  
  .icon-badge {
    transition: all 0.3s ease;
  }
  
  .profile-card:hover .icon-badge {
    transform: scale(1.1) rotate(5deg);
  }
  
  .floating-icon {
    position: absolute;
    opacity: 0.1;
    font-size: 4rem;
    pointer-events: none;
  }
  
  .progress-indicator {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 50;
  }
`;

function CV() {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    phone: '',
    email: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    location: '',
    
    // Professional Summary
    summary: '',
    
    // Education
    education: [
      {
        degree: '',
        institution: '',
        year: '',
        gpa: '',
      }
    ],
    
    // Work Experience
    experience: [
      {
        title: '',
        company: '',
        duration: '',
        description: '',
      }
    ],
    
    // Skills (comma-separated)
    technical_skills: '',
    soft_skills: '',
    languages: '',
    
    // Certifications
    certifications: [
      {
        name: '',
        issuer: '',
        year: '',
      }
    ],
    
    // Projects (will be auto-filled from completed projects, but can be edited)
    projects: [
      {
        title: '',
        description: '',
        technologies: '',
        url: '',
      }
    ],
  });

  useEffect(() => {
    fetchCVData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCVData = async () => {
    try {
      const data = await cvService.getCurrentCV();
      if (data) {
        // Populate form with existing CV data
        setFormData({
          full_name: data.full_name || user?.full_name || '',
          phone: data.phone || '',
          email: data.email || user?.email || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          portfolio_url: data.portfolio_url || '',
          location: data.location || '',
          summary: data.summary || '',
          education: Array.isArray(data.education) ? data.education : [{ degree: '', institution: '', year: '', gpa: '' }],
          experience: Array.isArray(data.experience) ? data.experience : [{ title: '', company: '', duration: '', description: '' }],
          technical_skills: data.technical_skills || '',
          soft_skills: data.soft_skills || '',
          languages: data.languages || '',
          certifications: Array.isArray(data.certifications) ? data.certifications : [{ name: '', issuer: '', year: '' }],
          projects: Array.isArray(data.projects) ? data.projects : [{ title: '', description: '', technologies: '', url: '' }],
        });
      }
    } catch (err) {
      // No CV yet, use empty form with user data
      console.log('No existing CV found, using empty form');
      if (user) {
        setFormData(prev => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email || '',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (section) => {
    const templates = {
      education: { degree: '', institution: '', year: '', gpa: '' },
      experience: { title: '', company: '', duration: '', description: '' },
      certifications: { name: '', issuer: '', year: '' },
      projects: { title: '', description: '', technologies: '', url: '' },
    };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await cvService.saveCV(formData);
      setMessage({ type: 'success', text: '✅ Profile saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Failed to save profile. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <style>{animationStyles}</style>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
          <div className="text-center animate-fade-in-up">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-bounce-soft">👤</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Animated Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 animate-gradient">
          {/* Floating Background Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="floating-icon animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>👤</span>
            <span className="floating-icon animate-float" style={{ top: '60%', left: '15%', animationDelay: '1s' }}>📝</span>
            <span className="floating-icon animate-float" style={{ top: '20%', right: '10%', animationDelay: '0.5s' }}>🎓</span>
            <span className="floating-icon animate-float" style={{ top: '70%', right: '20%', animationDelay: '1.5s' }}>💼</span>
            <span className="floating-icon animate-float" style={{ top: '40%', left: '50%', animationDelay: '2s' }}>⭐</span>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-emerald-500/20"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 py-10">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-4 mb-3">
                
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Profile
                  </h1>
                  <p className="text-blue-200">Complete your profile information to create a professional CV</p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Success/Error Messages */}
          {message.text && (
            <div className={`mb-6 px-5 py-4 rounded-xl flex items-center gap-3 animate-fade-in-up shadow-lg ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
              </div>
              <span className="font-medium">{message.text}</span>
            </div>
          )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Personal Information Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Personal Information</h2>
                <p className="text-sm text-gray-500">Your basic contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">📛</span>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">📧</span>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center text-xs">📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center text-xs">📍</span>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">💼</span>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center text-xs text-white">🐙</span>
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              
            </div>
          </div>

          {/* Professional Summary Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/30">
                📝
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Professional Summary</h2>
                <p className="text-sm text-gray-500">Tell us about yourself</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center text-xs">✍️</span>
                About Me
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows="5"
                className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write a brief professional summary about yourself, your skills, and career goals..."
              />
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <span>💡</span> Tip: Keep it concise and highlight your key achievements
              </p>
            </div>
          </div>

          {/* Education Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30">
                🎓
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Education</h2>
                <p className="text-sm text-gray-500">Your academic background</p>
              </div>
            </div>

            {formData.education.map((edu, index) => (
              <div key={index} className="array-item mb-6 p-5 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    🎓 Education #{index + 1}
                  </span>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', index)}
                      className="remove-btn flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="University name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year / Duration</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="2020 - 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="3.8 / 4.0"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('education')}
              className="add-btn w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Education
            </button>
          </div>

          {/* Work Experience Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-500/30">
                💼
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Work Experience</h2>
                <p className="text-sm text-gray-500">Your professional journey</p>
              </div>
            </div>

            {formData.experience.map((exp, index) => (
              <div key={index} className="array-item mb-6 p-5 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    💼 Experience #{index + 1}
                  </span>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('experience', index)}
                      className="remove-btn flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Software Engineering Intern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., June 2023 - August 2023"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                      rows="3"
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('experience')}
              className="add-btn w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Experience
            </button>
          </div>

          {/* Skills Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-yellow-500/30">
                ⚡
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Skills</h2>
                <p className="text-sm text-gray-500">Your expertise and abilities</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-xs">💻</span>
                  Technical Skills
                </label>
                <input
                  type="text"
                  name="technical_skills"
                  value={formData.technical_skills}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Python, JavaScript, React, Node.js, SQL, MongoDB (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center text-xs">🤝</span>
                  Soft Skills
                </label>
                <input
                  type="text"
                  name="soft_skills"
                  value={formData.soft_skills}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Leadership, Communication, Problem Solving, Team Collaboration (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center text-xs">🌍</span>
                  Languages
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., English (Native), Spanish (Fluent), French (Intermediate)"
                />
              </div>
            </div>
          </div>

          {/* Certifications Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-yellow-500/30">
                🏆
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Certifications</h2>
                <p className="text-sm text-gray-500">Your achievements and credentials</p>
              </div>
            </div>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="array-item mb-6 p-5 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 rounded-xl border border-yellow-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                    🏆 Certification #{index + 1}
                  </span>
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('certifications', index)}
                      className="remove-btn flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., AWS Certified Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={cert.year}
                      onChange={(e) => handleArrayChange('certifications', index, 'year', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="2024"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('certifications')}
              className="add-btn w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Certification
            </button>
          </div>

          {/* Projects Card */}
          <div className="profile-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="icon-badge w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30">
                🚀
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Projects</h2>
                <p className="text-sm text-gray-500">Showcase your best work</p>
              </div>
            </div>

            {formData.projects.map((project, index) => (
              <div key={index} className="array-item mb-6 p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                    🚀 Project #{index + 1}
                  </span>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('projects', index)}
                      className="remove-btn flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                        className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., E-commerce Platform"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project URL (Optional)</label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => handleArrayChange('projects', index, 'url', e.target.value)}
                        className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="GitHub/Demo link"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                      rows="2"
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Brief description of the project..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                      className="input-enhanced w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('projects')}
              className="add-btn w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Project
            </button>
          </div>

          {/* Save Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <button
              type="submit"
              disabled={saving}
              className="save-btn w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-bold py-5 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-lg flex items-center justify-center gap-3"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Saving Profile...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </span>
              )}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Your profile is automatically saved to your account
            </p>
          </div>
           
        </form>
        </div>
      </div>
    </Layout>
  );
}

export default CV;
