import { useState, createContext, useContext } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// Create context for sidebar state
export const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - adjusts based on sidebar state */}
        <main className={`mt-16 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export default Layout;
