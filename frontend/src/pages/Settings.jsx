import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

// CSS animations
const styles = `
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
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
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
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  
  .animate-bounce-soft {
    animation: bounce-soft 2s ease-in-out infinite;
  }
  
  .settings-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .settings-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
  
  .input-field {
    transition: all 0.3s ease;
  }
  
  .input-field:focus {
    transform: scale(1.01);
  }
  
  .btn-animated {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .btn-animated::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }
  
  .btn-animated:hover::before {
    left: 100%;
  }
  
  .btn-animated:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .icon-container {
    transition: all 0.3s ease;
  }
  
  .settings-card:hover .icon-container {
    transform: scale(1.1) rotate(5deg);
  }
  
  .checklist-item {
    transition: all 0.3s ease;
  }
  
  .checklist-item:hover {
    transform: translateX(5px);
  }
`;

function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    full_name: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [reportMessage, setReportMessage] = useState({ type: '', text: '' });
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserData({
        email: response.data.email,
        full_name: response.data.full_name || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      showProfileMessage('error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const showProfileMessage = (type, text) => {
    setProfileMessage({ type, text });
    setTimeout(() => setProfileMessage({ type: '', text: '' }), 5000);
  };

  const showPasswordMessage = (type, text) => {
    setPasswordMessage({ type, text });
    setTimeout(() => setPasswordMessage({ type: '', text: '' }), 5000);
  };

  const showReportMessage = (type, text) => {
    setReportMessage({ type, text });
    setTimeout(() => setReportMessage({ type: '', text: '' }), 5000);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = async () => {
    try {
      setSaving(true);
      await axios.put('http://localhost:8000/api/auth/update-profile', {
        full_name: userData.full_name
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh user data to confirm the update
      await fetchUserData();
      showProfileMessage('success', 'Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showProfileMessage('error', error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showPasswordMessage('error', 'New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 6) {
      showPasswordMessage('error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      await axios.post('http://localhost:8000/api/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showPasswordMessage('success', 'Password changed successfully! You can continue using the app.');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showPasswordMessage('error', error.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const downloadActivityReport = async () => {
    try {
      setDownloadingReport(true);
      const response = await axios.get('http://localhost:8000/api/auth/activity-report', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showReportMessage('success', 'Activity report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      showReportMessage('error', 'Failed to download activity report');
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <style>{styles}</style>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-bounce-soft">⚙️</span>
              </div>
            </div>
            <p className="mt-6 text-gray-600 text-lg animate-pulse">Loading your settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{styles}</style>
      <div className="w-full px-6 py-8">
        {/* Beautiful Header */}
        <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 mb-8 overflow-hidden animate-fadeInUp shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 right-1/4 text-6xl opacity-10 animate-float">⚙️</div>
          <div className="absolute top-1/4 right-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🔧</div>
          <div className="absolute bottom-1/4 right-1/2 text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🛠️</div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4">
             
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                  Settings
                </h1>
                <p className="text-slate-300 text-lg">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="settings-card bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                <p className="text-gray-500 text-sm">Update your profile details</p>
              </div>
            </div>

            {/* Profile Message */}
            {profileMessage.text && (
              <div className={`mb-4 px-4 py-3 rounded-xl border animate-scaleIn flex items-center gap-3 ${
                profileMessage.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700'
              }`}>
                <span className="text-xl">{profileMessage.type === 'success' ? '✅' : '❌'}</span>
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📝</span> Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={userData.full_name}
                  onChange={handlePersonalInfoChange}
                  className="input-field w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📧</span> Email Address
                  <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Read-only</span>
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <button
                onClick={savePersonalInfo}
                disabled={saving}
                className="btn-animated w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>💾</span> Save Personal Information
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="settings-card bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                <p className="text-gray-500 text-sm">Secure your account</p>
              </div>
            </div>

            {/* Password Message */}
            {passwordMessage.text && (
              <div className={`mb-4 px-4 py-3 rounded-xl border animate-scaleIn flex items-center gap-3 ${
                passwordMessage.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700'
              }`}>
                <span className="text-xl">{passwordMessage.type === 'success' ? '✅' : '❌'}</span>
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔑</span> Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="input-field w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Enter current password"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔒</span> New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="input-field w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>✅</span> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="input-field w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Tip:</span> Password changes take effect immediately. No need to log out!
                </p>
              </div>

              <button
                onClick={changePassword}
                disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                className="btn-animated w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Updating Password...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🔐</span> Change Password
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Activity Report Section - Full Width */}
          <div className="lg:col-span-2 settings-card bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-container w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Activity Report</h2>
                <p className="text-gray-500 text-sm">Download your complete activity summary</p>
              </div>
            </div>

            {/* Report Message */}
            {reportMessage.text && (
              <div className={`mb-4 px-4 py-3 rounded-xl border animate-scaleIn flex items-center gap-3 ${
                reportMessage.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700'
              }`}>
                <span className="text-xl">{reportMessage.type === 'success' ? '✅' : '❌'}</span>
                {reportMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Info */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-6">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-3 text-lg">
                  <span className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md">📥</span>
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: '📚', text: 'All subjects and enrolled courses' },
                    { icon: '🚀', text: 'Projects submitted and in progress' },
                    { icon: '⚡', text: 'Skills and certifications tracked' },
                    { icon: '📈', text: 'Complete activity timeline & stats' }
                  ].map((item, idx) => (
                    <li key={idx} className="checklist-item flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-emerald-100">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-emerald-800 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download Section */}
              <div className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl mb-6 animate-bounce-soft">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Download</h3>
                <p className="text-gray-500 text-sm text-center mb-6">Get a comprehensive PDF report of all your activities</p>
                
                <button
                  onClick={downloadActivityReport}
                  disabled={downloadingReport}
                  className="btn-animated w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingReport ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Generating Report...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>📄</span> Download Activity Report (PDF)
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </Layout>
  );
}

export default Settings;
