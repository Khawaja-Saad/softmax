function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span className="text-2xl">🎓</span>
            </div>
            <span className="text-2xl font-bold">EduPilot</span>
          </div>
          <a href="/login" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 font-medium">
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm">AI-Powered Career Development Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
            Never Graduate with a
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Blank CV Again
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Transform your academic journey into career readiness with AI-powered skill mapping, 
            project generation, and automatic CV updates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up animation-delay-400">
            <a href="/register" className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a href="/login" className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300">
              Watch Demo →
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20 animate-fade-in animation-delay-600">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</div>
              <div className="text-sm text-gray-400">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-gray-400">Free</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: "🎯",
              title: "Smart Skill Mapping",
              description: "AI converts your courses into real-world, resume-worthy skills automatically"
            },
            {
              icon: "🚀",
              title: "AI Project Generator",
              description: "Get personalized projects that showcase your abilities and build your portfolio"
            },
            {
              icon: "📄",
              title: "Auto-CV Updates",
              description: "Your CV automatically updates as you complete projects and gain skills"
            },
            {
              icon: "💼",
              title: "Opportunity Matching",
              description: "Get matched with internships and jobs based on your growing skill set"
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Monitor your learning journey and skill development in real-time"
            },
            {
              icon: "🎓",
              title: "Career Guidance",
              description: "Receive AI-powered recommendations for your academic and career path"
            }
          ].map((feature, index) => (
            <div key={index} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-32 text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="space-y-12">
            {[
              { step: "1", title: "Add Your Courses", desc: "Enter your enrolled subjects and career goals" },
              { step: "2", title: "AI Generates Roadmap", desc: "Get personalized skill roadmap and project ideas" },
              { step: "3", title: "Build Projects", desc: "Work on AI-suggested projects that matter" },
              { step: "4", title: "Graduate Job-Ready", desc: "Walk away with a complete CV and portfolio" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto mt-32 text-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of students building their careers with EduPilot</p>
          <a href="/register" className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300">
            <span>Start Your Journey Today</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-400">
          <p>© 2025 EduPilot. Empowering students with AI-driven career development.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;