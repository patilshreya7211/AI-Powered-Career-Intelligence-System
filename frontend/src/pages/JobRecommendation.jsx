import { useState } from "react";
import axios from "axios";

function JobRecommendation() {

  const [jobs, setJobs] = useState([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {

    try {

      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `http://127.0.0.1:8000/job-recommendation/${user.id}`
      );

      setDomain(response.data.data.career_domain);
      setJobs(response.data.data.recommended_jobs);

    }

    catch (error) {

      console.log(error);

      alert("Unable to fetch job recommendations.");

    }

    finally {

      setLoading(false);

    }

  };

  const matchColor = (match) => {

    if (match >= 90) return "bg-green-500";

    if (match >= 75) return "bg-yellow-500";

    return "bg-red-500";

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-10">

          <h1 className="text-4xl font-bold">

            💼 AI Job Recommendation

          </h1>

          <p className="text-blue-100 mt-3 text-lg">

            Discover jobs perfectly matched to your resume.

          </p>

        </div>

        <button

          onClick={getRecommendations}

          className="bg-blue-700 hover:bg-blue-800 hover:scale-105 transition-all duration-300 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"

        >

          {loading ? "Finding Jobs..." : "Recommend Jobs"}

        </button>

        {jobs.length > 0 && (

          <>

            {/* Domain */}

            <div className="mt-10 bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-2xl font-bold text-blue-700">

                Career Domain

              </h2>

              <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">

                {domain}

              </span>

            </div>

            {/* Cards */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

              {jobs.map((job, index) => (

                <div

                  key={index}

                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"

                >

                  <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white">

                    <div className="flex justify-between items-center">

                      <h2 className="text-2xl font-bold">

                        {job.company}

                      </h2>

                      <span

                        className={`${matchColor(job.match)} px-3 py-1 rounded-full font-bold text-white`}

                      >

                        {job.match}% Match

                      </span>

                    </div>

                  </div>

                  <div className="p-6">

                    <h3 className="text-xl font-bold text-gray-800">

                      {job.title}

                    </h3>

                    <div className="mt-5 space-y-3 text-gray-600">

                      <p>📍 {job.location}</p>

                      <p>💰 {job.salary}</p>

                      <p>💼 {job.type}</p>

                    </div>

                    <div className="mt-6">

                      <h4 className="font-bold mb-3">

                        Required Skills

                      </h4>

                      <div className="flex flex-wrap gap-2">

                        {job.skills.map((skill, idx) => (

                          <span

                            key={idx}

                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 hover:text-white transition"

                          >

                            {skill}

                          </span>

                        ))}

                      </div>

                    </div>

                    <a

                      href={job.apply_link}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="block text-center mt-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"

                    >

                      Apply Now →

                    </a>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>

  );

}

export default JobRecommendation;