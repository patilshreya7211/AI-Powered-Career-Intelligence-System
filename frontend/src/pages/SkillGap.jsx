import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SkillGap() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSkillGap = async () => {
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
        "Skill Gap User ID:",
        userId
      );

      const response = await API.get(
        `/skill-gap/${userId}`
      );

      console.log(
        "Skill Gap Response:",
        response.data
      );

      setResult(
        response.data?.data || null
      );

    } catch (error) {
      console.error(
        "Skill Gap Error:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Skill Gap Analysis Failed.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-8">

          <h1 className="text-4xl font-bold">
            📚 AI Skill Gap Analysis
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Compare your resume against industry skills
            and discover what you should learn next.
          </p>

        </div>

        {/* ACTION CARD */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <button
            onClick={analyzeSkillGap}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Skill Gap"}
          </button>

          {error && (
            <div className="mt-6 bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

        </div>

        {/* RESULT */}

        {result && (
          <div className="mt-10">

            {/* GAP SCORE */}

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
                    {result.skill_gap ?? 0}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">

                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          result.skill_gap || 0
                        )
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* SKILLS */}

            <div className="grid md:grid-cols-2 gap-8">

              <div className="bg-green-50 rounded-xl p-6">

                <h3 className="text-xl font-bold text-green-700 mb-4">
                  Matching Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {(result.matching_skills || []).map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="bg-red-50 rounded-xl p-6">

                <h3 className="text-xl font-bold text-red-700 mb-4">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-3">

                  {(result.missing_skills || []).map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* LEARNING RECOMMENDATIONS */}

            <div className="bg-yellow-50 rounded-xl p-6 mt-8">

              <h3 className="text-xl font-bold text-yellow-700 mb-4">
                Learning Recommendations
              </h3>

              <div className="space-y-4">

                {(result.learning_recommendations || []).map(
                  (item, index) => (

                    <div
                      key={index}
                      className="bg-white border-l-4 border-yellow-500 rounded-lg p-4"
                    >
                      💡 {item}
                    </div>

                  )
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default SkillGap;