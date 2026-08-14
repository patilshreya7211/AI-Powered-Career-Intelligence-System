import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const cards = [
    {
      title: "My Profile",
      icon: "👤",
      description: "View and update your profile information.",
      route: "/profile",
    },

    {
      title: "Resume Builder",
      icon: "📝",
      description:
        "Create a professional resume by entering all your information in one place.",
      route: "/resume-builder",
    },

    {
      title: "Resume Upload",
      icon: "📄",
      description: "Upload your latest resume.",
      route: "/resume",
    },

    {
      title: "My Resumes",
      icon: "📁",
      description: "View, download and manage resumes.",
      route: "/my-resumes",
    },

    {
      title: "AI Career Recommendation",
      icon: "🤖",
      description: "Get AI-powered career recommendations.",
      route: "/career-recommendation",
    },

    {
      title: "Career Roadmap",
      icon: "🛣️",
      description: "View your personalized career roadmap.",
      route: "/career-roadmap",
    },

    {
      title: "Placement Readiness",
      icon: "📊",
      description: "Check your placement readiness score.",
      route: "/placement-readiness",
    },

    {
      title: "ATS Resume Analysis",
      icon: "📑",
      description:
        "Compare your resume with a Job Description using AI and get an ATS score.",
      route: "/ats",
    },

    {
      title: "Skill Gap Analysis",
      icon: "📚",
      description:
        "Find your missing skills and learning recommendations.",
      route: "/skill-gap",
    },

    {
      title: "Job Recommendation",
      icon: "💼",
      description:
        "Discover jobs that match your resume.",
      route: "/job-recommendation",
    },

    {
      title: "Learning Resources",
      icon: "🎓",
      description:
        "Get AI recommended courses, tutorials and documentation.",
      route: "/learning-resources",
    },

    {
      title: "Dashboard Analytics",
      icon: "📈",
      description:
        "View AI analytics, scores, recommendations and progress.",
      route: "/dashboard-analytics",
    },
    {
       title: "AI Career Assistance",
       icon: "🤖",
       description:
         "Get personalized AI guidance for careers, skills, jobs, projects and learning paths.",
       route: "/ai-career-assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              AI Career Intelligence System
            </h1>

            <p className="mt-2 text-blue-100">
              Your Personal AI Career Assistant
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Welcome Card */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-3xl font-bold text-blue-700">
            Welcome, {user?.full_name} 👋
          </h2>

          <p className="text-gray-600 mt-3 text-lg">
            Manage your resumes and explore AI-powered career guidance.
          </p>

        </div>

        {/* Quick Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">

            <h3 className="text-4xl">
              📝
            </h3>

            <p className="mt-3 font-semibold">
              Resume Builder
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">

            <h3 className="text-4xl">
              📄
            </h3>

            <p className="mt-3 font-semibold">
              Resume
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">

            <h3 className="text-4xl">
              🤖
            </h3>

            <p className="mt-3 font-semibold">
              AI Career
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">

            <h3 className="text-4xl">
              📈
            </h3>

            <p className="mt-3 font-semibold">
              Placement
            </p>

          </div>

        </div>

        {/* Dashboard Modules */}

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {cards.map((card, index) => (

            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-2xl shadow-md p-7 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >

              <div className="text-5xl mb-5">
                {card.icon}
              </div>

              <h3 className="text-2xl font-bold text-blue-700">
                {card.title}
              </h3>

              <p className="text-gray-600 mt-4 min-h-[48px]">
                {card.description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.route);
                }}
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
              >
                Open →
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;