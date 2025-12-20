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
    subjects: [{ name: '', code: '', credits: '' }]
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
      subjects: [...formData.subjects, { name: '', code: '', credits: '' }]
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
            code: subject.code,
            credits: subject.credits ? parseInt(subject.credits) : null
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to EduPilot!</h2>
            <p className="text-gray-600">Let's set up your academic journey</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-8">
            <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`flex-1 h-2 rounded ml-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Academic Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Degree Program</label>
                  <input
                    type="text"
                    name="degree_program"
                    value={formData.degree_program}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Computer Science, Mechanical Engineering"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Year</label>
                    <select
                      name="current_year"
                      value={formData.current_year}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Year 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Semester</label>
                    <select
                      name="current_semester"
                      value={formData.current_semester}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Career Goal</label>
                  <input
                    type="text"
                    name="career_goal"
                    value={formData.career_goal}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Software Engineer, Data Scientist"
                    required
                  />
                </div>

                <button type="button" onClick={handleNext} className="btn-primary w-full">
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Your Current Subjects</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add the subjects you're currently enrolled in. This helps us create a personalized skill roadmap.
                </p>

                {formData.subjects.map((subject, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Subject {index + 1}</span>
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Course Code"
                          value={subject.code}
                          onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Credits"
                          value={subject.credits}
                          onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSubject}
                  className="btn-secondary w-full mb-6"
                >
                  + Add Another Subject
                </button>

                <div className="flex gap-4">
                  <button type="button" onClick={handleBack} className="btn-secondary flex-1">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
