import { useEffect, useState } from "react";
import axios from "axios";

function DashboardAnalytics() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/dashboard/"
      );

      setDashboard(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Dashboard Loading Failed");
    }
  };

  if (!dashboard)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Dashboard...
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-xl p-8 mb-8">

        <h1 className="text-4xl font-bold">

          📊 Career Dashboard

        </h1>

        <p className="text-blue-100 mt-3 text-lg">

          Monitor your AI Career Intelligence progress in one place.

        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            ATS Score
          </h2>

          <p className="text-5xl font-bold text-green-600 mt-2">

            {dashboard.ats_score}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            Resume Score
          </h2>

          <p className="text-5xl font-bold text-blue-700 mt-2">

            {dashboard.resume_score}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            Matching Skills
          </h2>

          <p className="text-5xl font-bold text-green-500 mt-2">

            {dashboard.matching_skills}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            Missing Skills
          </h2>

          <p className="text-5xl font-bold text-red-500 mt-2">

            {dashboard.missing_skills}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            Recommended Jobs
          </h2>

          <p className="text-5xl font-bold text-indigo-600 mt-2">

            {dashboard.recommended_jobs}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

          <h2 className="text-gray-500">
            Learning Resources
          </h2>

          <p className="text-5xl font-bold text-purple-600 mt-2">

            {dashboard.recommended_courses}

          </p>

        </div>

      </div>

      {/* Profile Completion */}

      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold">

            Profile Completion

          </h2>

          <span className="text-xl font-bold text-blue-700">

            {dashboard.profile_completion}%

          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-6 mt-5 overflow-hidden">

          <div

            className="bg-gradient-to-r from-blue-600 to-indigo-700 h-6 rounded-full transition-all duration-1000"

            style={{

              width: `${dashboard.profile_completion}%`

            }}

          ></div>

        </div>

      </div>

      {/* Recommended Careers */}

      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold text-blue-700 mb-6">

          🎯 Recommended Careers

        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {dashboard.recommended_careers.map((career, index) => (

            <div

              key={index}

              className="bg-blue-100 rounded-xl p-5 text-center font-semibold hover:bg-blue-700 hover:text-white transition duration-300"

            >

              {career}

            </div>

          ))}

        </div>

      </div>

      {/* Status */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-green-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

          <h2 className="font-bold text-xl">

            Resume Uploaded

          </h2>

          <div className="text-5xl mt-5">

            {dashboard.resume_uploaded ? "✅" : "❌"}

          </div>

        </div>

        <div className="bg-yellow-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

          <h2 className="font-bold text-xl">

            ATS Completed

          </h2>

          <div className="text-5xl mt-5">

            {dashboard.ats_completed ? "✅" : "❌"}

          </div>

        </div>

        <div className="bg-purple-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

          <h2 className="font-bold text-xl">

            Skill Gap Completed

          </h2>

          <div className="text-5xl mt-5">

            {dashboard.skill_gap_completed ? "✅" : "❌"}

          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🚀 Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
                onClick={() => window.location.href="/ats"}
                className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 hover:scale-105 transition"
            >
                📄
                <br />
                ATS Analysis
            </button>
            <button
                onClick={() => window.location.href="/skill-gap"}
                className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 hover:scale-105 transition"
            >
                📚
                <br />
                Skill Gap
            </button>
            <button
                onClick={() => window.location.href="/job-recommendation"}
                className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 hover:scale-105 transition"
            >
                💼
                <br />
                Jobs
            </button>
            <button
                onClick={() => window.location.href="/learning-resources"}
                className="bg-orange-500 text-white rounded-xl p-6 hover:bg-orange-600 hover:scale-105 transition"
            >
                🎓
                <br />
                Courses
            </button>
        </div>
      </div>

    </div>
  );
}

export default DashboardAnalytics;