import { useState, useEffect } from 'react';
import { academicService } from '../services';
import Layout from '../components/Layout';

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
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(6, 182, 212, 0.5);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes progressFill {
    from {
      width: 0%;
    }
  }
  
  @keyframes checkmark {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
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
  
  .animate-slideInRight {
    animation: slideInRight 0.5s ease-out forwards;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-progress {
    animation: progressFill 1s ease-out forwards;
  }
  
  .card-hover {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .card-hover:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  .concept-item {
    transition: all 0.3s ease;
  }
  
  .concept-item:hover {
    transform: translateX(8px);
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
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  .btn-animated:hover::before {
    left: 100%;
  }
  
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }
  
  .gradient-border {
    position: relative;
    background: white;
  }
  
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .gradient-border:hover::before {
    opacity: 1;
  }
`;

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [generatedTask, setGeneratedTask] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [documentation, setDocumentation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    fetchSubjects();
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await academicService.getSubjects();
      setSubjects(data);
    } catch (err) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      setError('Please enter a course name');
      return;
    }

    setAddingCourse(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/academic/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newCourseName,
          code: '',
          semester: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add course');
      }
      
      const newSubject = await response.json();
      
      // Generate concepts for the new subject
      await generateConcepts(newSubject.id);
      
      setNewCourseName('');
      setShowAddModal(false);
      await fetchSubjects();
    } catch (err) {
      setError(err.message || 'Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  };

  const generateConcepts = async (subjectId) => {
    try {
      await fetch(`http://localhost:8000/api/academic/subjects/${subjectId}/concepts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (err) {
      console.error('Failed to generate concepts:', err);
    }
  };

  const toggleConcept = async (subjectId, conceptId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/academic/subjects/${subjectId}/concepts/${conceptId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      // Update local state with new progress
      setSubjects(subjects.map(subject => {
        if (subject.id === subjectId) {
          const updatedConcepts = subject.concepts.map(concept => 
            concept.id === conceptId 
              ? { ...concept, learned: !concept.learned }
              : concept
          );
          // Calculate local progress: 10% per concept learned
          const learnedCount = updatedConcepts.filter(c => c.learned).length;
          const hasDoc = subject.status === 'completed';
          const newProgress = (learnedCount * 10) + (hasDoc ? 50 : 0);
          
          return {
            ...subject,
            concepts: updatedConcepts,
            progress: data.progress || newProgress
          };
        }
        return subject;
      }));
    } catch (err) {
      setError('Failed to update concept');
    }
  };

  const handleStartProject = async (subject) => {
    setSelectedSubject(subject);
    setShowProjectModal(true);
    setError('');
    
    // If task already exists in subject data, use it directly
    if (subject.generated_task) {
      setGeneratedTask(subject.generated_task);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/academic/subjects/${subject.id}/generate-task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to generate task');
      
      const data = await response.json();
      setGeneratedTask(data.task);
      
      // Update local state with the generated task
      setSubjects(subjects.map(s => 
        s.id === subject.id 
          ? { ...s, generated_task: data.task }
          : s
      ));
    } catch (err) {
      setError('Failed to generate project task');
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    
    if (!documentation) {
      setError('Documentation is required');
      return;
    }

    const formData = new FormData();
    formData.append('subject_id', selectedSubject.id);
    formData.append('task', generatedTask);
    formData.append('github_link', githubLink);
    formData.append('documentation', documentation);

    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/academic/subjects/submit-project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to submit project');
      
      alert('Project submitted successfully! 🎉 Your project has been added to the Projects section.');
      setShowProjectModal(false);
      setGithubLink('');
      setDocumentation(null);
      setGeneratedTask('');
      // Refresh subjects to update status and progress
      await fetchSubjects();
    } catch (err) {
      setError(err.message || 'Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  const areAllConceptsLearned = (subject) => {
    return subject.concepts && subject.concepts.length > 0 && 
           subject.concepts.every(concept => concept.learned);
  };

  const hasGeneratedTask = (subject) => {
    return subject.generated_task && subject.generated_task.length > 0;
  };

  const isSubjectCompleted = (subject) => {
    return subject.status === 'completed';
  };

  const getSubjectProgress = (subject) => {
    // If backend provides progress, use it
    if (subject.progress !== undefined && subject.progress !== null) {
      return subject.progress;
    }
    // Otherwise calculate locally: 10% per concept (50% max) + 50% for documentation
    const learnedCount = (subject.concepts || []).filter(c => c.learned).length;
    const conceptProgress = learnedCount * 10;
    const docProgress = subject.status === 'completed' ? 50 : 0;
    return conceptProgress + docProgress;
  };

  const handleDeleteCourse = async (subjectId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/academic/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete course');

      // Remove from local state
      setSubjects(subjects.filter(s => s.id !== subjectId));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">📚</span>
            </div>
          </div>
          <p className="mt-4 text-gray-500 animate-pulse">Loading your subjects...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="mb-10 animate-fadeInUp">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-8 shadow-2xl shadow-cyan-500/25">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>
            {/* Floating Icons */}
            <div className="absolute top-4 right-4 text-6xl opacity-20 animate-float">📖</div>
            <div className="absolute bottom-4 left-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>💡</div>
            <div className="absolute top-8 right-32 text-3xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🎯</div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                
                <div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                    My Subjects
                  </h1>
                  <p className="text-cyan-100 text-lg">Master concepts and build amazing projects for each subject</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white font-bold">{subjects.length}</span>
                      <span className="text-cyan-100 text-sm">Courses</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white font-bold">{subjects.filter(s => s.status === 'completed').length}</span>
                      <span className="text-cyan-100 text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white font-bold">{subjects.filter(s => s.status !== 'completed').length}</span>
                      <span className="text-cyan-100 text-sm">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-animated group flex items-center gap-3 px-7 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-lg">Add Course</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="animate-scaleIn bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="animate-fadeInUp bg-gradient-to-br from-white to-cyan-50/50 rounded-3xl shadow-xl border border-cyan-100 text-center py-20 px-8">
            <div className="text-8xl mb-6 animate-float">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Subjects Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start your learning journey by adding your first course. We'll generate key concepts and projects for you!</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="btn-animated inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-xl">✨</span>
              Add Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="card-hover gradient-border group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Top Gradient Bar */}
                <div className={`h-2 ${
                  isSubjectCompleted(subject)
                    ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500'
                }`}></div>
                
                <div className="p-6 relative">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCourse(subject.id)}
                    className="absolute top-4 right-4 p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    title="Delete course"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  {/* Subject Header */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                        isSubjectCompleted(subject)
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30'
                          : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-500/30'
                      }`}>
                        {isSubjectCompleted(subject) ? '🎓' : '📖'}
                      </div>
                      <div className="flex-1 pr-8">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors duration-300 line-clamp-2">{subject.name}</h3>
                        {subject.code && (
                          <p className="text-sm text-gray-400 mt-1">{subject.code}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        isSubjectCompleted(subject)
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm shadow-emerald-200'
                          : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 shadow-sm shadow-cyan-200'
                      }`}>
                        <span className="text-lg">{isSubjectCompleted(subject) ? '✅' : '🔄'}</span>
                        {isSubjectCompleted(subject) ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="mt-5 p-4 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-600">Overall Progress</span>
                        <span className={`text-lg font-bold ${
                          isSubjectCompleted(subject) ? 'text-emerald-600' : 'text-cyan-600'
                        }`}>
                          {getSubjectProgress(subject)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full animate-progress relative overflow-hidden ${
                            isSubjectCompleted(subject)
                              ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500'
                              : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${getSubjectProgress(subject)}%` }}
                        >
                          <div className="absolute inset-0 animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          Concepts: {(subject.concepts || []).filter(c => c.learned).length * 10}%
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          Docs: {isSubjectCompleted(subject) ? '50%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Concepts */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-sm shadow-sm">💡</span>
                      Key Concepts
                    </h4>
                    {subject.concepts && subject.concepts.length > 0 ? (
                      <div className="space-y-2">
                        {subject.concepts.slice(0, 5).map((concept, cIndex) => (
                          <label
                            key={concept.id}
                            className={`concept-item flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border border-transparent ${
                              hasGeneratedTask(subject) || isSubjectCompleted(subject)
                                ? 'cursor-not-allowed opacity-80 bg-gray-50'
                                : 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 cursor-pointer group/item hover:border-cyan-200'
                            }`}
                            style={{ animationDelay: `${cIndex * 0.05}s` }}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={concept.learned || false}
                                onChange={() => !hasGeneratedTask(subject) && !isSubjectCompleted(subject) && toggleConcept(subject.id, concept.id)}
                                disabled={hasGeneratedTask(subject) || isSubjectCompleted(subject)}
                                className={`w-5 h-5 text-cyan-500 border-2 rounded-md transition-all duration-300 ${
                                  hasGeneratedTask(subject) || isSubjectCompleted(subject)
                                    ? 'border-gray-200 cursor-not-allowed bg-gray-100'
                                    : 'border-gray-300 focus:ring-cyan-400 cursor-pointer checked:bg-gradient-to-r checked:from-cyan-500 checked:to-blue-500'
                                }`}
                              />
                              {concept.learned && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                              )}
                            </div>
                            <span className={`text-sm flex-1 transition-all duration-300 ${
                              concept.learned 
                                ? 'text-gray-400 line-through' 
                                : hasGeneratedTask(subject) || isSubjectCompleted(subject)
                                  ? 'text-gray-500'
                                  : 'text-gray-700 group-hover/item:text-cyan-700 font-medium'
                            }`}>
                              {concept.name}
                            </span>
                            {concept.learned && (
                              <span className="text-emerald-500 text-lg">✓</span>
                            )}
                            {(hasGeneratedTask(subject) || isSubjectCompleted(subject)) && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">🔒 Locked</span>
                            )}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="text-4xl mb-3 animate-float">🔮</div>
                        <p className="text-sm text-gray-500 mb-3">No concepts generated yet</p>
                        <button
                          onClick={() => generateConcepts(subject.id).then(() => fetchSubjects())}
                          className="text-sm text-cyan-600 hover:text-cyan-700 font-bold hover:underline transition-all duration-300"
                        >
                          ✨ Generate Concepts
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {isSubjectCompleted(subject) ? (
                    <div className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-center shadow-lg shadow-emerald-500/30 animate-pulse-glow">
                      <span className="flex items-center justify-center gap-3 text-lg">
                        <span className="text-2xl">🎓</span>
                        Course Completed!
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartProject(subject)}
                      disabled={!areAllConceptsLearned(subject) && !hasGeneratedTask(subject)}
                      className={`btn-animated w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                        areAllConceptsLearned(subject) || hasGeneratedTask(subject)
                          ? hasGeneratedTask(subject)
                            ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02]'
                            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {hasGeneratedTask(subject) ? (
                        <span className="flex items-center justify-center gap-3 text-lg">
                          <span className="text-2xl">📄</span>
                          Submit Documentation
                        </span>
                      ) : areAllConceptsLearned(subject) ? (
                        <span className="flex items-center justify-center gap-3 text-lg">
                          <span className="text-2xl">🚀</span>
                          Start Project
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl">🔒</span>
                          Complete All Concepts First
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scaleIn overflow-hidden">
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                      ✨
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Add New Course</h2>
                      <p className="text-white/80 text-sm">Start your learning journey</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewCourseName('');
                      setError('');
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:rotate-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs">📚</span>
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g., Data Structures, Machine Learning"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2 ml-1">
                    💡 We'll generate 5 key concepts and project tasks for this course
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewCourseName('');
                      setError('');
                    }}
                    className="flex-1 py-4 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    disabled={addingCourse}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCourse}
                    className="btn-animated flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={addingCourse}
                  >
                    {addingCourse ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>🚀</span> Add Course
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Modal */}
        {showProjectModal && selectedSubject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl my-8 flex flex-col max-h-[90vh] animate-scaleIn overflow-hidden">
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm animate-float">
                      🚀
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Project Submission</h2>
                      <p className="text-white/80">{selectedSubject.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProjectModal(false);
                      setGithubLink('');
                      setDocumentation(null);
                      setGeneratedTask('');
                      setError('');
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:rotate-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Generated Task */}
                <div className="mb-8 p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-cyan-200/50 shadow-lg shadow-cyan-500/10 animate-slideInRight">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">🎯</span>
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Your Project Task</span>
                  </h3>
                  {generatedTask ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-cyan-100">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{generatedTask}</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white/50 rounded-xl">
                      <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl animate-pulse">🎯</span>
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">Generating your personalized project task...</p>
                      <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
                    </div>
                  )}
                </div>

                {/* Submission Form */}
                {generatedTask && (
                  <form onSubmit={handleSubmitProject} className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    {/* GitHub Link */}
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </span>
                        GitHub Repository
                        <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/username/repository"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-gray-700 focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-400 mt-2 ml-1 flex items-center gap-1">
                        <span>💡</span> Not applicable for non-coding subjects
                      </p>
                    </div>

                    {/* Documentation Upload */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📄</span>
                        Documentation
                        <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                        documentation 
                          ? 'border-emerald-400 bg-emerald-50' 
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                      }`}>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={(e) => setDocumentation(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="doc-upload"
                          required
                        />
                        <div className="flex flex-col items-center gap-4">
                          {documentation ? (
                            <>
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30">
                                ✅
                              </div>
                              <div>
                                <p className="text-emerald-700 font-bold text-lg">{documentation.name}</p>
                                <p className="text-emerald-600 text-sm mt-1">Click to change file</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                📤
                              </div>
                              <div>
                                <p className="text-gray-700 font-semibold">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  PDF or DOCX (Max 10MB)
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectModal(false);
                          setGithubLink('');
                          setDocumentation(null);
                          setGeneratedTask('');
                          setError('');
                        }}
                        className="flex-1 py-4 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-animated flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={submitting || !documentation}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3 text-lg">
                            <span className="text-2xl">🎉</span>
                            Submit Project
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Subjects;
