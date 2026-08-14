import { useState } from "react";
import axios from "axios";

function SkillGap() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSkillGap = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `http://127.0.0.1:8000/skill-gap/${user.id}`
      );

      setResult(response.data.data);
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.detail || "Skill Gap Analysis Failed");
      } else {
        alert("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-10">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-8">

            <h1 className="text-4xl font-bold">

                📚 AI Skill Gap Analysis

            </h1>

            <p className="mt-3 text-blue-100 text-lg">

                Compare your resume against industry skills and discover what you should learn next.

            </p>

        </div>

        <button
          onClick={analyzeSkillGap}
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 hover:scale-105 transition-all duration-300 text-white px-8 py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>

        {result && (
          <div className="mt-10">

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">

                <h2 className="text-center text-3xl font-bold text-blue-700">

                    Skill Gap

                </h2>

                <div className="mt-6">

                    <div className="flex justify-between mb-2">

                        <span className="font-semibold">

                            Improvement Required

                        </span>

                        <span className="font-bold text-blue-700">

                            {result.skill_gap}%

                        </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">

                        <div

                            className="bg-gradient-to-r from-red-500 to-orange-500 h-5 rounded-full transition-all duration-1000"

                            style={{

                                width: `${result.skill_gap}%`

                            }}

                        ></div>

                    </div>

                </div>

            </div>

            <div className="grid md:grid-cols-2 gap-8">

              <div className="bg-green-50 rounded-lg p-5">

                <h3 className="text-xl font-bold text-green-700 mb-4">
                  Matching Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {result.matching_skills.map((skill, index) => (
                    <span

                        key={index}

                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full shadow hover:bg-green-600 hover:text-white hover:scale-105 transition"

                    >

                        {skill}

                    </span>
                  ))}

                </div>

              </div>

              <div className="bg-red-50 rounded-lg p-5">

                <h3 className="text-xl font-bold text-red-700 mb-4">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {result.missing_skills.map((skill, index) => (
                    <span

                        key={index}

                        className="bg-red-100 text-red-700 px-4 py-2 rounded-full shadow hover:bg-red-600 hover:text-white hover:scale-105 transition"

                    >

                        {skill}

                    </span>
                  ))}

                </div>

              </div>

            </div>

            <div className="bg-yellow-50 rounded-lg p-5 mt-8">

              <h3 className="text-xl font-bold text-yellow-700 mb-4">
                Learning Recommendations
              </h3>

              <div className="space-y-4">

                  {result.learning_recommendations.map((item, index) => (

                      <div

                          key={index}

                          className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 hover:bg-yellow-100 transition"

                      >

                          💡 {item}

                      </div>

                  ))}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default SkillGap;