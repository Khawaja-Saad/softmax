import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, academicService } from '../services';

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    degree_program: '',
    current_year: '',
    current_semester: '',
    career_goal: '',
    subjects: [{ name: '' }]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '' }]
    });
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.degree_program || !formData.current_year || !formData.career_goal) {
        setError('Please fill in all fields');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update user profile
      await authService.updateProfile({
        degree_program: formData.degree_program,
        current_year: parseInt(formData.current_year),
        current_semester: parseInt(formData.current_semester),
        career_goal: formData.career_goal
      });

      // Add subjects
      for (const subject of formData.subjects) {
        if (subject.name) {
          await academicService.addSubject({
            name: subject.name,
            code: null,
            credits: null
          });
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-delayed"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-slow"></div>
      
      {/* Main Card Container */}
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="relative max-w-6xl w-full flex items-center justify-center gap-12 lg:gap-16">
          {/* Left Side - Welcome Message */}
          <div className="hidden lg:flex flex-col justify-center max-w-lg">
            <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              Complete Your <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"></span> Profile
            </h1>
            <p className="text-lg text-gray-600">
              Just a few more steps to personalize your academic journey and unlock all features.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Track academic progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Get personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Connect with opportunities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Onboarding Form */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <div className="bg-white bg-opacity-80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 md:p-10 border border-white border-opacity-50 w-full lg:w-[600px]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>  
              <p className="text-gray-600">Tell us about your academic journey</p>
            </div>

            {/* Enhanced Progress Indicator */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-semibold transition-colors duration-300 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                📚 Academic Info
              </span>
              <span className={`text-sm font-semibold transition-colors duration-300 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                📖 Current Subjects
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-lg ${step >= 1 ? 'w-full' : 'w-0'}`}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
                </div>
              </div>
              <div className="relative flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500 ease-out delay-150 shadow-lg ${step >= 2 ? 'w-full' : 'w-0'}`}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

{/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-shake-error">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="animate-fade-in-up space-y-5">
                
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Degree Program
                  </label>
                  <input
                    type="text"
                    name="degree_program"
                    value={formData.degree_program}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 group-hover:border-blue-300"
                    placeholder="e.g., Computer Science, Mechanical Engineering"
                    required
                  />
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Current Year
                    </label>
                    <select
                      name="current_year"
                      value={formData.current_year}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 outline-none text-gray-700 group-hover:border-cyan-300"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Year 5</option>
                      <option value="6">Year 6</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Current Semester
                    </label>
                    <select
                      name="current_semester"
                      value={formData.current_semester}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 outline-none text-gray-700 group-hover:border-teal-300"
                      required
                    >
                      <option value="">Select Semester</option>
                      {formData.current_year && (() => {
                        const year = parseInt(formData.current_year);
                        const startSem = (year - 1) * 2 + 1;
                        const endSem = year * 2;
                        return [startSem, endSem].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                <div className="mb-8 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Career Goal
                  </label>
                  <input
                    type="text"
                    name="career_goal"
                    value={formData.career_goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 group-hover:border-blue-300"
                    placeholder="e.g., Software Engineer, Data Scientist"
                    required
                  />
                </div>

                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-teal-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    Continue
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in-up space-y-5">
                  <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg">
                  <p className="text-sm text-cyan-800 flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Add the subjects you're currently enrolled in. This helps us create a personalized skill roadmap.
                  </p>
                </div>

                  <div className="space-y-4">
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-700 flex items-center">
                          <span className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-lg flex items-center justify-center text-sm mr-2">
                            {index + 1}
                          </span>
                          Subject {index + 1}
                        </span>
                        {formData.subjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSubject(index)}
                            className="text-red-600 text-sm font-semibold hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Subject Name (e.g., Data Structures)"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSubject}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-2 border-gray-300 flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Subject
                </button>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="button" 
                    onClick={handleBack} 
                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-2 border-gray-300 flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold py-3.5 px-6 rounded-xl hover:from-cyan-700 hover:to-teal-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Setting up your profile...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Complete Setup
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-120deg); }
          66% { transform: translate(20px, -20px) rotate(-240deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake-error {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-shake-error {
          animation: shake-error 0.6s;
        }
      `}</style>
    </div>
  );
}

export default Onboarding;
