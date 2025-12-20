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
        {/* Left - Company Logo */}
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EduPilot</h1>
            <p className="text-xs text-indigo-200">AI Career</p>
          </div>
        </div>

        {/* Right - User Info & Logout */}
        <div className="flex items-center space-x-4">
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
