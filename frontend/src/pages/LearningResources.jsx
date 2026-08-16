import { useEffect, useState } from "react";
import API from "../services/api";

function LearningResources() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setError(
          "User session not found. Please login again."
        );
        return;
      }

      const user = JSON.parse(
        storedUser
      );

      const userId =
        user.id ||
        user.user_id ||
        user.userId;

      if (!userId) {
        setError(
          "User ID not found. Please login again."
        );
        return;
      }

      console.log(
        "Learning Resources User ID:",
        userId
      );

      const response = await API.get(
        `/learning-resources/${userId}`
      );

      console.log(
        "Learning Resources Response:",
        response.data
      );

      setResources(
        Array.isArray(response.data?.data)
          ? response.data.data
          : []
      );

    } catch (error) {
      console.error(
        "Learning Resources Error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load learning resources."
      );

    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const name =
      String(platform || "").toLowerCase();

    switch (name) {
      case "coursera":
        return "🎓";

      case "infosys springboard":
        return "💻";

      case "tensorflow":
        return "🤖";

      case "w3schools":
        return "🌐";

      case "docker":
        return "🐳";

      default:
        return "📘";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-5"></div>

          <h1 className="text-2xl font-bold text-blue-700">
            Loading Learning Resources...
          </h1>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-10">

          <h1 className="text-4xl font-bold">
            📚 AI Learning Resources
          </h1>

          <p className="mt-3 text-lg text-blue-100">
            Personalized learning resources based on your missing skills.
          </p>

        </div>

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-5 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* STAT CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">

            <h2 className="text-4xl font-bold text-blue-700">
              {resources.length}
            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Skills to Learn
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">

            <h2 className="text-4xl font-bold text-green-600">

              {resources.reduce(
                (total, item) =>
                  total +
                  (Array.isArray(item.resources)
                    ? item.resources.length
                    : 0),
                0
              )}

            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Total Courses
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">

            <h2 className="text-4xl font-bold text-purple-600">
              100%
            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Personalized
            </p>

          </div>

        </div>

        {/* NO RESOURCES */}

        {!error &&
          resources.length === 0 && (

            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

              <div className="text-5xl mb-4">
                🎉
              </div>

              <h3 className="text-2xl font-bold text-green-700">
                No Learning Resources Needed
              </h3>

              <p className="text-gray-600 mt-3">
                Your resume already matches the configured required skills.
              </p>

            </div>

          )}

        {/* RESOURCES */}

        <div className="space-y-8">

          {resources.map(
            (item, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8"
              >

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-3xl font-bold text-blue-700">
                    {item.skill}
                  </h2>

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                    {Array.isArray(item.resources)
                      ? item.resources.length
                      : 0}{" "}
                    Resources
                  </span>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {(item.resources || []).map(
                    (resource, idx) => (

                      <div
                        key={idx}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition"
                      >

                        <h3 className="text-xl font-bold text-gray-800">
                          {getPlatformIcon(
                            resource.platform
                          )}{" "}
                          {resource.platform}
                        </h3>

                        <p className="text-gray-600 mt-3">
                          {resource.course}
                        </p>

                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                          >
                            Open Course →
                          </a>
                        )}

                        <p className="text-sm text-gray-500 mt-4">
                          Recommended based on your Skill Gap Analysis.
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default LearningResources;