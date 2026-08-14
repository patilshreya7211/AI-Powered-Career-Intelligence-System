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
      // Change the user id later after implementing authentication
      const response = await API.get("/roadmap/1");
      setRoadmap(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load career roadmap.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Career Roadmap...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">
        <h1 className="text-2xl text-red-600 font-bold mb-6">
          {error}
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
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

      <div className="max-w-6xl mx-auto p-8">

        {/* Career Title */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <h2 className="text-gray-500 font-semibold">
            Recommended Career
          </h2>

          <h1 className="text-5xl font-bold text-blue-700 mt-4">
            {roadmap.title}
          </h1>

        </div>

        {/* Roadmap */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {roadmap.steps.map((step, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition duration-300"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
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