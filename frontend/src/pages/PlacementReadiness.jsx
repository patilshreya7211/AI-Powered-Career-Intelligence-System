import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PlacementReadiness() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [placement, setPlacement] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlacement();
  }, []);

  const fetchPlacement = async () => {
    try {
      // Change the user id if your project stores it differently
      const userId = localStorage.getItem("user_id") || 1;

      const response = await API.get(`/placement/${userId}`);

      console.log(response.data);

      setPlacement(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load placement readiness.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Placement Readiness...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">
        <h1 className="text-red-600 text-2xl font-bold">{error}</h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-4xl font-bold">Placement Readiness</h1>
          <p className="text-blue-100 mt-2">AI Powered Placement Analysis</p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placement Score */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <h2 className="text-gray-500 font-semibold">Placement Score</h2>

            <h1 className="text-6xl font-bold text-blue-700 mt-5">
              {placement.placement_score}
            </h1>

            <p className="text-gray-500 mt-3">out of 100</p>
          </div>

          {/* Level */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <h2 className="text-gray-500 font-semibold">Readiness Level</h2>

            <h1 className="text-4xl font-bold text-green-600 mt-6">
              {placement.level}
            </h1>

            <p className="text-gray-500 mt-3">Current Status</p>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <h2 className="text-gray-500 font-semibold">Resume Score</h2>

            <h1 className="text-5xl font-bold text-purple-700 mt-5">
              {placement.resume_score}
            </h1>
          </div>

          {/* ATS */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <h2 className="text-gray-500 font-semibold">ATS Score</h2>

            <h1 className="text-5xl font-bold text-orange-600 mt-5">
              {placement.ats_score}
            </h1>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-8">
            Placement Score Breakdown
          </h2>

          {/* Resume Score */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Resume Score</span>
              <span>{placement.resume_score}/100</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-700"
                style={{ width: `${placement.resume_score}%` }}
              ></div>
            </div>
          </div>

          {/* ATS Score */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">ATS Score</span>
              <span>{placement.ats_score}/100</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-700"
                style={{ width: `${placement.ats_score}%` }}
              ></div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Skills Score</span>
              <span>{placement.skills_score}/20</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-yellow-500 h-4 rounded-full transition-all duration-700"
                style={{
                  width: `${(placement.skills_score / 20) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Projects Score</span>
              <span>{placement.projects_score}/15</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-700"
                style={{
                  width: `${(placement.projects_score / 15) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Certifications Score</span>
              <span>{placement.certifications_score}/15</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full transition-all duration-700"
                style={{
                  width: `${(placement.certifications_score / 15) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="mt-10 bg-gradient-to-r from-indigo-700 to-blue-700 text-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-4">AI Placement Advice</h2>

          {placement.level === "Excellent" && (
            <p className="text-lg">
              🎉 You are placement-ready. Focus on interview preparation,
              aptitude tests, and company-specific coding rounds.
            </p>
          )}

          {placement.level === "Good" && (
            <p className="text-lg">
              👍 Your profile is strong. Improve projects and certifications
              to become highly competitive.
            </p>
          )}

          {placement.level === "Average" && (
            <p className="text-lg">
              📚 Strengthen your technical skills, add more projects, and
              improve your resume before placements.
            </p>
          )}

          {placement.level === "Needs Improvement" && (
            <p className="text-lg">
              🚀 Start with programming fundamentals, build projects, and
              improve your resume to increase placement chances.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlacementReadiness;