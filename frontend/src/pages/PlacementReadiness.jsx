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
      setLoading(true);
      setError("");

      // ==========================================
      // GET LOGGED-IN USER
      // ==========================================

      const storedUser = localStorage.getItem("user");

      console.log("Stored User:", storedUser);

      if (!storedUser) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      console.log("Logged-in User:", user);

      // ==========================================
      // GET USER ID
      // ==========================================

      const userId =
        user.id ||
        user.user_id ||
        user.userId;

      console.log("User ID:", userId);

      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      // ==========================================
      // CALL BACKEND
      // ==========================================

      const response = await API.get(
        `/placement/${userId}`
      );

      console.log(
        "Placement API Response:",
        response.data
      );

      setPlacement(response.data);

    } catch (err) {
      console.error(
        "Placement API Error:",
        err
      );

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Backend:",
          err.response.data
        );

        const detail =
          err.response.data?.detail;

        if (detail) {
          setError(detail);
        } else {
          setError(
            "Unable to load placement readiness."
          );
        }

      } else if (err.request) {

        setError(
          "Backend server is not responding."
        );

      } else {

        setError(
          "Something went wrong."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="text-center">

          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-700 mx-auto mb-5"></div>

          <h1 className="text-3xl font-bold text-blue-700">
            Loading Placement Readiness...
          </h1>

          <p className="text-gray-500 mt-2">
            Analyzing your resume and profile
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 px-6">

        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">

          <h1 className="text-2xl text-red-600 font-bold mb-4">
            Placement Readiness Error
          </h1>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="flex gap-3 justify-center">

            <button
              onClick={fetchPlacement}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700"
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!placement) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">
          No placement data available.
        </h1>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 flex justify-between items-center shadow-lg">

        <div>

          <h1 className="text-4xl font-bold">
            Placement Readiness
          </h1>

          <p className="text-blue-100 mt-2">
            AI Powered Placement Analysis
          </p>

        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          Back
        </button>

      </div>

      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="max-w-7xl mx-auto p-8">

        {/* ======================================
            SCORE CARDS
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Placement Score */}

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition">

            <h2 className="text-gray-500 font-semibold">
              Placement Score
            </h2>

            <h1 className="text-6xl font-bold text-blue-700 mt-5">
              {placement.placement_score ?? 0}
            </h1>

            <p className="text-gray-500 mt-3">
              out of 100
            </p>

          </div>

          {/* Level */}

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition">

            <h2 className="text-gray-500 font-semibold">
              Readiness Level
            </h2>

            <h1 className="text-4xl font-bold text-green-600 mt-6">
              {placement.level ?? "Not Available"}
            </h1>

            <p className="text-gray-500 mt-3">
              Current Status
            </p>

          </div>

          {/* Resume */}

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition">

            <h2 className="text-gray-500 font-semibold">
              Resume Score
            </h2>

            <h1 className="text-5xl font-bold text-purple-700 mt-5">
              {placement.resume_score ?? 0}
            </h1>

            <p className="text-gray-500 mt-3">
              out of 100
            </p>

          </div>

          {/* ATS */}

          <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition">

            <h2 className="text-gray-500 font-semibold">
              ATS Score
            </h2>

            <h1 className="text-5xl font-bold text-orange-600 mt-5">
              {placement.ats_score ?? 0}
            </h1>

            <p className="text-gray-500 mt-3">
              out of 100
            </p>

          </div>

        </div>

        {/* ======================================
            SCORE BREAKDOWN
        ====================================== */}

        <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-3xl font-bold text-blue-700 mb-8">
            Placement Score Breakdown
          </h2>

          {/* Resume */}

          <ScoreBar
            title="Resume Score"
            score={placement.resume_score ?? 0}
            max={100}
            color="bg-blue-600"
          />

          {/* ATS */}

          <ScoreBar
            title="ATS Score"
            score={placement.ats_score ?? 0}
            max={100}
            color="bg-green-600"
          />

          {/* Skills */}

          <ScoreBar
            title="Skills Score"
            score={placement.skills_score ?? 0}
            max={20}
            color="bg-yellow-500"
          />

          {/* Projects */}

          <ScoreBar
            title="Projects Score"
            score={placement.projects_score ?? 0}
            max={15}
            color="bg-purple-600"
          />

          {/* Certifications */}

          <ScoreBar
            title="Certifications Score"
            score={placement.certifications_score ?? 0}
            max={15}
            color="bg-red-500"
          />

        </div>

        {/* ======================================
            AI ADVICE
        ====================================== */}

        <div className="mt-10 bg-gradient-to-r from-indigo-700 to-blue-700 text-white rounded-3xl shadow-xl p-8">

          <h2 className="text-3xl font-bold mb-4">
            AI Placement Advice
          </h2>

          {placement.level === "Excellent" && (
            <p className="text-lg">
              🎉 You are placement-ready. Focus on
              interview preparation, aptitude tests,
              and company-specific coding rounds.
            </p>
          )}

          {placement.level === "Good" && (
            <p className="text-lg">
              👍 Your profile is strong. Improve
              projects and certifications to become
              highly competitive.
            </p>
          )}

          {placement.level === "Average" && (
            <p className="text-lg">
              📚 Strengthen your technical skills,
              add more projects, and improve your
              resume before placements.
            </p>
          )}

          {placement.level === "Needs Improvement" && (
            <p className="text-lg">
              🚀 Start with programming fundamentals,
              build projects, and improve your resume
              to increase placement chances.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}


// ==========================================
// SCORE BAR COMPONENT
// ==========================================

function ScoreBar({
  title,
  score,
  max,
  color,
}) {
  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        (score / max) * 100
      )
    );

  return (
    <div className="mb-7">

      <div className="flex justify-between mb-2">

        <span className="font-semibold">
          {title}
        </span>

        <span>
          {score}/{max}
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">

        <div
          className={`${color} h-4 rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

export default PlacementReadiness;