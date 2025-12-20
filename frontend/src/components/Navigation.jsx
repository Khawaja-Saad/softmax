import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();

  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/projects', label: '🚀 Projects', icon: '🚀' },
    { path: '/skills', label: '⚡ Skills', icon: '⚡' },
    { path: '/cv', label: '📄 CV', icon: '📄' },
    { path: '/opportunities', label: '💼 Opportunities', icon: '💼' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <span className="text-2xl font-bold text-primary-600">EduPilot</span>
            <span className="ml-2 text-sm text-gray-500">AI Career Co-Pilot</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm">
              <div className="font-medium">{user?.full_name}</div>
              <div className="text-xs text-gray-500">{user?.degree_program}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-2 space-x-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 bg-gray-100'
              }`}
            >
              {item.icon} {item.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
