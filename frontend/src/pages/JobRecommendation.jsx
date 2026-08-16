import { useState } from "react";
import API from "../services/api";

function JobRecommendation() {
  const [jobs, setJobs] = useState([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
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
        "Job Recommendation User ID:",
        userId
      );

      const response = await API.get(
        `/job-recommendation/${userId}`
      );

      console.log(
        "Job Recommendation Response:",
        response.data
      );

      const data =
        response.data?.data || {};

      setDomain(
        data.career_domain || ""
      );

      setJobs(
        Array.isArray(
          data.recommended_jobs
        )
          ? data.recommended_jobs
          : []
      );

    } catch (error) {
      console.error(
        "Job Recommendation Error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to fetch job recommendations."
      );

    } finally {
      setLoading(false);
    }
  };

  const matchColor = (match) => {
    if (match >= 90) {
      return "bg-green-500";
    }

    if (match >= 75) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-10">

          <h1 className="text-4xl font-bold">
            💼 AI Job Recommendation
          </h1>

          <p className="text-blue-100 mt-3 text-lg">
            Discover jobs matched to your resume and skills.
          </p>

        </div>

        {/* BUTTON */}

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <button
            onClick={getRecommendations}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading
              ? "Finding Jobs..."
              : "Recommend Jobs"}
          </button>

          {error && (
            <div className="mt-5 bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

        </div>

        {domain && (
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold text-blue-700">
              Career Domain
            </h2>

            <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">
              {domain}
            </span>

          </div>
        )}

        {/* JOB CARDS */}

        {jobs.length > 0 && (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

            {jobs.map((job, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >

                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white">

                  <div className="flex justify-between items-center gap-3">

                    <h2 className="text-2xl font-bold">
                      {job.company}
                    </h2>

                    <span
                      className={`${matchColor(
                        job.match || 0
                      )} px-3 py-1 rounded-full font-bold text-white whitespace-nowrap`}
                    >
                      {job.match || 0}% Match
                    </span>

                  </div>

                </div>

                <div className="p-6">

                  <h3 className="text-xl font-bold text-gray-800">
                    {job.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-gray-600">

                    <p>
                      📍 {job.location || "Not specified"}
                    </p>

                    <p>
                      💰 {job.salary || "Not specified"}
                    </p>

                    <p>
                      💼 {job.type || "Full-Time"}
                    </p>

                  </div>

                  <div className="mt-6">

                    <h4 className="font-bold mb-3">
                      Required Skills
                    </h4>

                    <div className="flex flex-wrap gap-2">

                      {(job.skills || []).map(
                        (skill, idx) => (

                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                  {job.apply_link && (
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                    >
                      Apply Now →
                    </a>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

        {!loading &&
          !error &&
          jobs.length === 0 &&
          domain && (
            <div className="bg-white rounded-2xl shadow-lg p-10 mt-10 text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                No job recommendations found.
              </h2>
              <p className="text-gray-500 mt-2">
                Try updating your skills and resume.
              </p>
            </div>
          )}

      </div>

    </div>
  );
}

export default JobRecommendation;