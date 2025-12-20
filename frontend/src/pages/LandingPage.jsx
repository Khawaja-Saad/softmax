function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-6">
          Welcome to EduPilot
        </h1>
        <p className="text-xl text-center mb-12">
          Your AI-Powered Academic & Career Journey Co-Pilot
        </p>
        <div className="flex justify-center gap-4">
          <a href="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Get Started
          </a>
          <a href="/login" className="btn-secondary bg-primary-600 border-2 border-white hover:bg-primary-800">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
