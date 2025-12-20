import { Navigate } from 'react-router-dom';
import { useStore } from '../store';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isAuthenticated, token, setAuth } = useStore();
  const storedToken = localStorage.getItem('token');

  // Restore auth state from localStorage on mount
  useEffect(() => {
    if (storedToken && !isAuthenticated) {
      // Token exists but store not initialized - restore auth state
      setAuth({ }, storedToken);
    }
  }, [storedToken, isAuthenticated, setAuth]);

  if (!isAuthenticated && !storedToken && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
