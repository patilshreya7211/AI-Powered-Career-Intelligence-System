import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function DashboardAnalytics() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD DASHBOARD ANALYTICS
  // ============================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // ========================================================
      // GET LOGGED-IN USER
      // ========================================================

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError(
          "User session not found. Please login again."
        );
        return;
      }

      const user = JSON.parse(storedUser);

      console.log(
        "Dashboard Analytics User:",
        user
      );

      // ========================================================
      // USER ID
      // ========================================================

      const userId =
        user?.id ||
        user?.user_id ||
        user?.userId;

      console.log(
        "Dashboard Analytics User ID:",
        userId
      );

      // ========================================================
      // CALL BACKEND
      // ========================================================
      //
      // Your current backend dashboard router uses:
      // GET /dashboard/
      //
      // Therefore we keep the same endpoint and simply
      // replace localhost with the centralized API instance.
      //
      // ========================================================

      const response = await API.get(
        "/dashboard/"
      );

      console.log(
        "Dashboard Analytics Response:",
        response.data
      );

      setDashboard(
        response.data?.data ||
        response.data ||
        null
      );

    } catch (error) {
      console.error(
        "Dashboard Analytics Error:",
        error
      );

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Backend response:",
          error.response.data
        );

        setError(
          error.response.data?.detail ||
          "Dashboard Loading Failed."
        );

      } else if (error.request) {

        setError(
          "Unable to connect to the backend server."
        );

      } else {

        setError(
          "Dashboard Loading Failed."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-5"></div>

          <h1 className="text-3xl font-bold text-blue-700">
            Loading Dashboard...
          </h1>

          <p className="text-gray-500 mt-2">
            Fetching your career analytics
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100 px-6">

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Dashboard Error
          </h1>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="flex justify-center gap-3">

            <button
              onClick={loadDashboard}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!dashboard) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-gray-700">
            No dashboard data available.
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // SAFE DATA VALUES
  // ============================================================

  const atsScore =
    dashboard.ats_score ?? 0;

  const resumeScore =
    dashboard.resume_score ?? 0;

  const matchingSkills =
    dashboard.matching_skills ?? 0;

  const missingSkills =
    dashboard.missing_skills ?? 0;

  const recommendedJobs =
    dashboard.recommended_jobs ?? 0;

  const recommendedCourses =
    dashboard.recommended_courses ?? 0;

  const profileCompletion =
    dashboard.profile_completion ?? 0;

  const recommendedCareers =
    Array.isArray(
      dashboard.recommended_careers
    )
      ? dashboard.recommended_careers
      : [];

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-xl p-8 mb-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>

              <h1 className="text-4xl font-bold">
                📊 Career Dashboard
              </h1>

              <p className="text-blue-100 mt-3 text-lg">
                Monitor your AI Career Intelligence progress
                in one place.
              </p>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ATS */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              ATS Score
            </h2>

            <p className="text-5xl font-bold text-green-600 mt-2">
              {atsScore}
            </p>

          </div>

          {/* Resume */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              Resume Score
            </h2>

            <p className="text-5xl font-bold text-blue-700 mt-2">
              {resumeScore}
            </p>

          </div>

          {/* Matching Skills */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              Matching Skills
            </h2>

            <p className="text-5xl font-bold text-green-500 mt-2">
              {matchingSkills}
            </p>

          </div>

          {/* Missing Skills */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              Missing Skills
            </h2>

            <p className="text-5xl font-bold text-red-500 mt-2">
              {missingSkills}
            </p>

          </div>

          {/* Recommended Jobs */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              Recommended Jobs
            </h2>

            <p className="text-5xl font-bold text-indigo-600 mt-2">
              {recommendedJobs}
            </p>

          </div>

          {/* Learning Resources */}

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition">

            <h2 className="text-gray-500">
              Learning Resources
            </h2>

            <p className="text-5xl font-bold text-purple-600 mt-2">
              {recommendedCourses}
            </p>

          </div>

        </div>

        {/* ======================================================
            PROFILE COMPLETION
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-bold">
              Profile Completion
            </h2>

            <span className="text-xl font-bold text-blue-700">
              {profileCompletion}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-6 mt-5 overflow-hidden">

            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 h-6 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    profileCompletion
                  )
                )}%`,
              }}
            />

          </div>

        </div>

        {/* ======================================================
            RECOMMENDED CAREERS
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎯 Recommended Careers
          </h2>

          {recommendedCareers.length === 0 ? (

            <p className="text-gray-500">
              No recommended careers available.
            </p>

          ) : (

            <div className="grid md:grid-cols-3 gap-5">

              {recommendedCareers.map(
                (career, index) => (

                  <div
                    key={index}
                    className="bg-blue-100 rounded-xl p-5 text-center font-semibold hover:bg-blue-700 hover:text-white transition duration-300"
                  >
                    {career}
                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* ======================================================
            STATUS
        ====================================================== */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          {/* Resume Uploaded */}

          <div className="bg-green-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

            <h2 className="font-bold text-xl">
              Resume Uploaded
            </h2>

            <div className="text-5xl mt-5">
              {dashboard.resume_uploaded
                ? "✅"
                : "❌"}
            </div>

          </div>

          {/* ATS Completed */}

          <div className="bg-yellow-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

            <h2 className="font-bold text-xl">
              ATS Completed
            </h2>

            <div className="text-5xl mt-5">
              {dashboard.ats_completed
                ? "✅"
                : "❌"}
            </div>

          </div>

          {/* Skill Gap */}

          <div className="bg-purple-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition">

            <h2 className="font-bold text-xl">
              Skill Gap Completed
            </h2>

            <div className="text-5xl mt-5">
              {dashboard.skill_gap_completed
                ? "✅"
                : "❌"}
            </div>

          </div>

        </div>

        {/* ======================================================
            QUICK ACTIONS
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🚀 Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* ATS */}

            <button
              onClick={() => navigate("/ats")}
              className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 hover:scale-105 transition"
            >
              📄
              <br />
              ATS Analysis
            </button>

            {/* Skill Gap */}

            <button
              onClick={() => navigate("/skill-gap")}
              className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 hover:scale-105 transition"
            >
              📚
              <br />
              Skill Gap
            </button>

            {/* Jobs */}

            <button
              onClick={() =>
                navigate("/job-recommendation")
              }
              className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 hover:scale-105 transition"
            >
              💼
              <br />
              Jobs
            </button>

            {/* Courses */}

            <button
              onClick={() =>
                navigate("/learning-resources")
              }
              className="bg-orange-500 text-white rounded-xl p-6 hover:bg-orange-600 hover:scale-105 transition"
            >
              🎓
              <br />
              Courses
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardAnalytics;