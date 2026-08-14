import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">
            AI Career Intelligence System
          </h1>

          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-5">

        <h1 className="text-5xl font-bold text-blue-700">
          Welcome to AI Career Intelligence System
        </h1>

        <p className="text-gray-700 text-xl mt-6 max-w-3xl mx-auto">
          Discover the perfect career path using Artificial Intelligence.
          Analyze your skills, receive personalized career recommendations,
          identify skill gaps, and prepare for your dream job with confidence.
        </p>

        <div className="mt-10 space-x-4">

          <Link
            to="/register"
            className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-800"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700"
          >
            Login
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
          Our Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              AI Career Recommendation
            </h3>

            <p className="mt-4 text-gray-600">
              Receive personalized career suggestions based on your
              interests, skills, education, and experience.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              Resume Analysis
            </h3>

            <p className="mt-4 text-gray-600">
              Upload your resume and receive AI-powered feedback
              to improve your chances of getting hired.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              Skill Gap Analysis
            </h3>

            <p className="mt-4 text-gray-600">
              Compare your current skills with industry
              requirements and identify areas for improvement.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              Career Roadmap
            </h3>

            <p className="mt-4 text-gray-600">
              Get a step-by-step learning roadmap to achieve your
              career goals.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              Job Recommendations
            </h3>

            <p className="mt-4 text-gray-600">
              Receive suitable job recommendations according
              to your profile and career interests.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-700">
              Progress Tracking
            </h3>

            <p className="mt-4 text-gray-600">
              Track your learning progress and continuously
              improve your skills.
            </p>
          </div>

        </div>

      </section>

      {/* About */}
      <section className="bg-blue-50 py-16 px-6">

        <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Why Choose Our Platform?
        </h2>

        <p className="text-center text-gray-700 text-lg max-w-4xl mx-auto">
          Our AI-powered platform helps students, graduates, and job seekers
          make informed career decisions by providing intelligent career
          guidance, resume evaluation, skill recommendations, and personalized
          learning paths using modern Artificial Intelligence technologies.
        </p>

      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6 mt-10">
        <h3 className="text-xl font-semibold">
          AI Career Intelligence System
        </h3>

        <p className="mt-2">
          Empowering Careers with Artificial Intelligence
        </p>

        <p className="mt-2 text-sm">
          Developed by Shreya Patil
        </p>
      </footer>

    </div>
  );
}

export default Home;