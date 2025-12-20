import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import ProtectedRoute from './components/ProtectedRoute'

// Pages (to be created)
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Subjects from './pages/Subjects'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import CV from './pages/CV'
import CVGenerator from './pages/CVGenerator'
import Opportunities from './pages/Opportunities'
import Settings from './pages/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/cv" element={<ProtectedRoute><CV /></ProtectedRoute>} />
          <Route path="/cv-generator" element={<ProtectedRoute><CVGenerator /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
