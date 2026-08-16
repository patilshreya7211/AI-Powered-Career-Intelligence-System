import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CareerRoadmap() {
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      // ==========================================
      // GET LOGGED-IN USER
      // ==========================================

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      console.log("Career Roadmap User:", user);
      console.log("Career Roadmap User ID:", user.id);

      // ==========================================
      // CHECK USER ID
      // ==========================================

      if (!user.id) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      // ==========================================
      // CALL BACKEND
      // ==========================================

      const response = await API.get(
        `/roadmap/${user.id}`
      );

      console.log(
        "Career Roadmap Response:",
        response.data
      );

      setRoadmap(response.data);

    } catch (err) {
      console.error(
        "Career Roadmap Error:",
        err
      );

      if (err.response) {
        console.error(
          "Backend status:",
          err.response.status
        );

        console.error(
          "Backend response:",
          err.response.data
        );

        if (err.response.status === 404) {
          setError(
            "Profile not found. Please complete your profile first."
          );
        } else if (err.response.status >= 500) {
          setError(
            "Backend server error. Please try again later."
          );
        } else {
          setError(
            err.response.data?.detail ||
            "Unable to load career roadmap."
          );
        }
      } else if (err.request) {
        setError(
          "Unable to connect to the backend server."
        );
      } else {
        setError(
          "Unable to load career roadmap."
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
          <h1 className="text-3xl font-bold text-blue-700">
            Loading Career Roadmap...
          </h1>

          <p className="text-gray-500 mt-3">
            Generating your personalized career path
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

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg text-center">

          <h1 className="text-2xl text-red-600 font-bold mb-4">
            Career Roadmap Error
          </h1>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
            >
              Retry
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // NO ROADMAP
  // ==========================================

  if (!roadmap) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-2xl font-bold text-gray-700">
          No career roadmap available.
        </h1>
      </div>
    );
  }

  // ==========================================
  // ROADMAP UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 flex justify-between items-center shadow-lg">

        <div>
          <h1 className="text-4xl font-bold">
            AI Career Roadmap
          </h1>

          <p className="text-blue-100 mt-2">
            Personalized Learning Path
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          Back
        </button>

      </div>

      {/* CONTENT */}

      <div className="max-w-6xl mx-auto p-8">

        {/* CAREER TITLE */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <h2 className="text-gray-500 font-semibold">
            Recommended Career
          </h2>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mt-4">
            {roadmap.title}
          </h1>

        </div>

        {/* ROADMAP STEPS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {Array.isArray(roadmap.steps) &&
            roadmap.steps.map((step, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition duration-300"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      {step}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Complete this step before moving to the next level.
                    </p>

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default CareerRoadmap;