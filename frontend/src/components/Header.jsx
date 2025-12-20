import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left - Empty for spacing */}
        <div className="w-48"></div>

        {/* Center - Company Logo */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EduPilot</h1>
              <p className="text-xs text-indigo-200 -mt-1">AI Career</p>
            </div>
          </div>
        </div>

        {/* Right - User Info & Logout */}
        <div className="w-48 flex items-center justify-end space-x-4">
          {user && (
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-indigo-200">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition duration-200 backdrop-blur-sm border border-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
