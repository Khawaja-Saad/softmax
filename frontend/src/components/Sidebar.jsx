import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import EduBot from './EduBot';
import { useSidebar } from './Layout';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Use the context state for collapsed
  const isCollapsed = isSidebarCollapsed;
  const setIsCollapsed = setIsSidebarCollapsed;

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/subjects',
      label: 'Subjects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      path: '/projects',
      label: 'Portfolio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/cv',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      path: '/cv-generator',
      label: 'CV Generator',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/opportunities',
      label: 'Opportunities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-xl border-r border-gray-200 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-cyan-500 text-white rounded-full p-1.5 shadow-lg hover:bg-cyan-600 transition"
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-cyan-500'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isActive(item.path) && !isCollapsed && (
                    <span className="ml-auto">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* EduBot Button */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          {!isCollapsed ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="text-left">
                  <p className="font-bold">EduBot</p>
                  <p className="text-xs text-white/80">Ask me anything!</p>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              title="EduBot"
            >
              <span className="text-xl">🤖</span>
            </button>
          )}
        </div>
      </aside>

      {/* EduBot Chat Window */}
      <EduBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Collapsed Tooltip */}
      {isCollapsed && (
        <style>{`
          .group:hover .tooltip {
            display: block;
          }
        `}</style>
      )}
    </>
  );
}

export default Sidebar;
