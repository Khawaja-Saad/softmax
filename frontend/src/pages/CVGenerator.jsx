import { useState, useEffect } from 'react';
import { cvService } from '../services';
import Layout from '../components/Layout';
import jsPDF from 'jspdf';

// CSS Animation Styles
const animationStyles = `
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
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% { 
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
    }
  }
  
  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes ripple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-bounce-soft {
    animation: bounce-soft 2s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.5s ease-out forwards;
  }
  
  .format-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .format-card:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
  }
  
  .format-card.selected {
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  }
  
  .download-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .download-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }
  
  .download-btn:hover::before {
    left: 100%;
  }
  
  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
  }
  
  .preview-container {
    position: relative;
    overflow: hidden;
  }
  
  .preview-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #06b6d4, #10b981, #3b82f6);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }
  
  .cv-preview-box {
    position: relative;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .cv-preview-box::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  
  .info-card {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .info-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #3b82f6, #06b6d4);
    transform: scaleY(0);
    transition: transform 0.3s ease;
    border-radius: 2px;
  }
  
  .info-card:hover::before {
    transform: scaleY(1);
  }
  
  .info-card:hover {
    transform: translateX(5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .generating-loader {
    position: relative;
  }
  
  .generating-loader::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #3b82f6;
    animation: spin-slow 1s linear infinite;
  }
  
  .floating-icon {
    position: absolute;
    opacity: 0.1;
    font-size: 4rem;
    pointer-events: none;
  }
`;

function CVGenerator() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('american');
  const [generatedCV, setGeneratedCV] = useState('');
  const [error, setError] = useState('');

  const formats = [
    { value: 'american', label: '🇺🇸 American Format', description: 'Traditional US resume style' },
    { value: 'european', label: '🇪🇺 European Format (Europass)', description: 'Europass CV standard' },
    { value: 'ats', label: '🤖 ATS Optimized', description: 'Applicant Tracking System friendly' },
    { value: 'modern', label: '✨ Modern Creative', description: 'Contemporary design-focused format' },
    { value: 'academic', label: '🎓 Academic CV', description: 'For research and academia positions' },
  ];

  useEffect(() => {
    fetchCVData();
  }, []);

  // Auto-generate CV when format changes
  useEffect(() => {
    if (cvData && selectedFormat) {
      handleGenerateCV();
    }
  }, [selectedFormat, cvData]);

  const fetchCVData = async () => {
    try {
      const data = await cvService.getCurrentCV();
      setCvData(data);
      setError('');
    } catch (err) {
      setError('Please complete your profile first before generating CV');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCV = async () => {
    if (!cvData) {
      setError('Please complete your profile first');
      return;
    }

    setGenerating(true);
    setError('');
    
    try {
      const response = await cvService.generateFormattedCV({
        cvData,
        format: selectedFormat
      });
      setGeneratedCV(response.formatted_cv);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate CV. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedCV) {
      setError('Please generate a CV first');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Split text into lines
    const lines = generatedCV.split('\n');
    let yPosition = margin;
    
    doc.setFont('helvetica');
    
    lines.forEach((line, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Detect headers (all caps or starts with specific patterns)
      if (line.match(/^[A-Z\s]{3,}$/) || line.match(/^(PROFESSIONAL SUMMARY|EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS)/)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(line, margin, yPosition);
        yPosition += 8;
      } 
      // Detect subheaders (bold items)
      else if (line.match(/^[A-Z][a-zA-Z\s&,]+(\||at|•)/) || line.trim().startsWith('•')) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const wrappedText = doc.splitTextToSize(line, maxLineWidth);
        doc.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 6;
      }
      // Regular text
      else if (line.trim()) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const wrappedText = doc.splitTextToSize(line, maxLineWidth);
        doc.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 5;
      }
      // Empty line (spacing)
      else {
        yPosition += 4;
      }
    });
    
    // Download the PDF
    const fileName = `CV_${selectedFormat}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <Layout>
        <style>{animationStyles}</style>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
          <div className="text-center animate-fade-in-up">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-bounce-soft">📄</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading CV Generator...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Animated Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 animate-gradient">
          {/* Floating Background Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="floating-icon animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>📄</span>
            <span className="floating-icon animate-float" style={{ top: '60%', left: '15%', animationDelay: '1s' }}>✨</span>
            <span className="floating-icon animate-float" style={{ top: '20%', right: '10%', animationDelay: '0.5s' }}>📝</span>
            <span className="floating-icon animate-float" style={{ top: '70%', right: '20%', animationDelay: '1.5s' }}>🎯</span>
            <span className="floating-icon animate-float" style={{ top: '40%', left: '50%', animationDelay: '2s' }}>💼</span>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-emerald-500/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce-soft">
                    <span className="text-3xl">📄</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">
                      CV Generator
                    </h1>
                    <p className="text-blue-200">Generate professional CVs in multiple formats using AI</p>
                  </div>
                </div>
              </div>
              
              {generatedCV && (
                <button
                  onClick={handleDownloadPDF}
                  className="download-btn flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-8 rounded-xl animate-fade-in-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <svg className="w-6 h-6 animate-bounce-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 px-5 py-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 flex items-center gap-3 animate-fade-in-up shadow-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Format Selection */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 sticky top-8">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Select Format
                  </span>
                </h2>

                <div className="space-y-3">
                  {formats.map((format, index) => (
                    <label
                      key={format.value}
                      className={`format-card block p-4 border-2 rounded-xl cursor-pointer animate-fade-in-up ${
                        selectedFormat === format.value
                          ? 'selected border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
                      }`}
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative mt-0.5">
                          <input
                            type="radio"
                            name="format"
                            value={format.value}
                            checked={selectedFormat === format.value}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                          />
                          {selectedFormat === format.value && (
                            <div className="absolute inset-0 -m-1 border-2 border-blue-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            {format.label}
                            {selectedFormat === format.value && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full animate-scale-in">Active</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {!cvData && (
                  <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl animate-bounce-soft">💡</span>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Profile Required</p>
                        <p className="text-xs text-amber-600 mt-1">Complete your profile first to generate CV</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quick Tips */}
                
              </div>
            </div>

            {/* Right Panel - Generated CV Preview */}
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="preview-container bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-5 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer"></div>
                  <h2 className="relative text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    CV Preview
                    {generating && (
                      <span className="ml-3 text-sm font-normal bg-white/20 px-3 py-1 rounded-full animate-pulse">
                        Generating...
                      </span>
                    )}
                  </h2>
                </div>

                <div className="p-8">
                  {generating ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                      <div className="generating-loader relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
                          <span className="text-3xl animate-bounce-soft">✨</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-semibold text-lg mb-2">Generating your professional CV...</p>
                      <p className="text-gray-500 text-sm">Our AI is crafting the perfect document for you</p>
                      <div className="mt-6 flex gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : generatedCV ? (
                    <div className="animate-fade-in-up">
                      <div className="cv-preview-box rounded-xl p-6 max-h-[600px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                          {generatedCV}
                        </pre>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          CV generated successfully
                        </span>
                        <span>Format: {formats.find(f => f.value === selectedFormat)?.label}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-fade-in-up">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white animate-bounce-soft">
                          <span>✨</span>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">No CV Generated Yet</p>
                      <p className="text-sm text-gray-500 text-center max-w-xs">
                        Select a format from the left panel to automatically generate your professional CV
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Format Information Cards */}
              {!generatedCV && !generating && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="info-card bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 mb-1">AI-Powered</h3>
                        <p className="text-sm text-blue-700">
                          Uses advanced AI to format your information professionally according to industry standards
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="info-card bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                        <span className="text-2xl">📥</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-green-900 mb-1">Download Ready</h3>
                        <p className="text-sm text-green-700">
                          Export your CV as PDF with proper formatting, ready to send to employers
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="info-card bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-900 mb-1">Multiple Formats</h3>
                        <p className="text-sm text-purple-700">
                          Choose from 5 professional formats tailored for different industries and regions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="info-card bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-900 mb-1">Instant Generation</h3>
                        <p className="text-sm text-orange-700">
                          Get your professional CV in seconds, not hours of manual formatting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CVGenerator;
