import { useEffect, useState } from "react";
import axios from "axios";

function LearningResources() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/learning-resources/${user.id}`
      );

      setResources(response.data.data);

    } catch (error) {

      console.log(error);

      alert("Unable to load learning resources.");

    } finally {

      setLoading(false);

    }

  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
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
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Learning Resources...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-7xl mx-auto">

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-10">

          <h1 className="text-4xl font-bold">
            📚 AI Learning Resources
          </h1>

          <p className="mt-3 text-lg text-blue-100">
            Personalized learning resources recommended according to your missing skills.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h2 className="text-4xl font-bold text-blue-700">
              {resources.length}
            </h2>
            <p className="mt-2 font-semibold text-gray-600">
              Skills to Learn
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h2 className="text-4xl font-bold text-green-600">
              {resources.reduce((total, item) => total + item.resources.length, 0)}
            </h2>
            <p className="mt-2 font-semibold text-gray-600">
              Total Courses
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">
            <h2 className="text-4xl font-bold text-purple-600">
              100%
            </h2>
            <p className="mt-2 font-semibold text-gray-600">
              Personalized
            </p>
          </div>

        </div>

        {resources.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-3xl mb-4">🎉</h2>
            <h3 className="text-2xl font-bold text-green-700">
              No Learning Resources Needed
            </h3>
            <p className="text-gray-600 mt-3">
              Your resume already matches all required skills.
            </p>
          </div>
        )}

        <div className="space-y-8">

          {resources.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-3xl font-bold text-blue-700">
                  {item.skill}
                </h2>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {item.resources.length} Resources
                </span>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {item.resources.map((resource, idx) => (

                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500 transition-all duration-300"
                  >

                    <h3 className="text-xl font-bold text-gray-800">
                      {getPlatformIcon(resource.platform)} {resource.platform}
                    </h3>

                    <p className="text-gray-600 mt-3">
                      {resource.course}
                    </p>

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      Open Course →
                    </a>

                    <p className="text-sm text-gray-500 mt-4">
                      Recommended based on your Skill Gap Analysis
                    </p>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default LearningResources;