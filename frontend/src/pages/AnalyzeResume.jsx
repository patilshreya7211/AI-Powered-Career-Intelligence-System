import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

import {
  Award,
  Target,
  Star,
  Mail
} from "lucide-react";

function AnalyzeResume() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  console.log("Resume ID:", resumeId);

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await API.get(`/resume/analyze/${resumeId}`);
      console.log("API Response:", response.data);

      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-700">
          Analyzing Resume...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {error}
        </h1>

        <button
          onClick={() => navigate("/my-resumes")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-700 text-white p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          AI Resume Analysis
        </h1>

        <button
          onClick={() => navigate("/my-resumes")}
          className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-10">

        {/* Resume Details */}
        {/* Resume Details */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-xl p-8 mb-8">

        <h1 className="text-4xl font-bold">
          {analysis.title}
        </h1>

         <p className="mt-2 text-blue-100">
          Resume ID : {analysis.resume_id}
         </p>

      </div>

        {/* Resume Score */}
     {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Resume Score */}

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

          <Award className="text-blue-600 w-10 h-10 mb-4" />

          <h2 className="text-gray-500 font-semibold">
            Resume Score
          </h2>

          <h1 className="text-5xl font-bold text-blue-700 mt-3">
            {analysis.resume_score}
          </h1>

          <p className="text-gray-500 mt-2">
             Overall Quality
          </p>

        </div>

        {/* ATS Score */}

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

          <Target className="text-green-600 w-10 h-10 mb-4" />

           <h2 className="text-gray-500 font-semibold">
             ATS Score
           </h2>

          <h1 className="text-5xl font-bold text-green-700 mt-3">
            {analysis.ats_score}
          </h1>

          <p className="text-gray-500 mt-2">
            ATS Friendly
          </p>

        </div>

        {/* Skills */}

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

          <Star className="text-yellow-500 w-10 h-10 mb-4" />

          <h2 className="text-gray-500 font-semibold">
            Skills Found
          </h2>

          <h1 className="text-5xl font-bold text-yellow-600 mt-3">
            {analysis.skills.length}
          </h1>

          <p className="text-gray-500 mt-2">
            Skills Detected
          </p>

        </div>

        {/* Contact */}

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

           <Mail className="text-purple-600 w-10 h-10 mb-4" />

          <h2 className="text-gray-500 font-semibold">
            Contact
          </h2>

          <p className="font-semibold mt-3 break-all">
            {analysis.contact.email}
          </p>

          <p className="text-gray-500">
            {analysis.contact.phone}
          </p>

        </div>

</div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-green-700 mb-5">
            Skills
          </h2>

          {analysis.skills.length === 0 ? (
            <p>No skills found.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {analysis.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Education */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-purple-700 mb-5">
            Education
          </h2>

          {analysis.education.length === 0 ? (
            <p>No education found.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2">
              {analysis.education.map((edu, index) => (
                <li key={index} className="text-lg">
                  {edu}
                </li>
              ))}
            </ul>
          )}

        </div>
        {/* Projects */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            Projects
          </h2>

          {analysis.projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2">
              {analysis.projects.map((project, index) => (
                <li key={index} className="text-lg">
                  {project}
                </li>
              ))}
            </ul>
          )}

        </div>
        {/* Certifications */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-orange-700 mb-5">
            Certifications
          </h2>

          {analysis.certifications.length === 0 ? (
            <p>No certifications found.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2">
              {analysis.certifications.map((certification, index) => (
                <li key={index} className="text-lg">
                  {certification}
                </li>
              ))}
            </ul>
          )}

        </div>
        {/* Future Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Missing Skills */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

             <h2 className="text-2xl font-bold text-red-600 mb-5">
               Missing Skills
             </h2>

             <div className="flex flex-wrap gap-3">

               {analysis.missing_skills.map((skill, index) => (

                 <span
                   key={index}
                   className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold"
                 >
                   {skill}
                  </span>

                ))}

              </div>

            </div>

            {/* Career Recommendation */}

            <div className="bg-white rounded-2xl shadow-lg p-6">

             <h2 className="text-2xl font-bold text-blue-700 mb-5">
               Career Recommendation
             </h2>

             <ul className="space-y-3">

               {analysis.career_recommendation.map((career, index) => (

                 <li
                   key={index}
                  className="bg-blue-50 rounded-lg p-3 font-semibold"
                 >
                  {career}
                 </li>

               ))}

             </ul>

            </div>
          {/* Resume Tips */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">

          <h2 className="text-2xl font-bold text-green-700 mb-5">
            Resume Improvement Tips
          </h2>

          <ul className="space-y-3">

            {analysis.resume_tips.map((tip, index) => (

              <li
                key={index}
                className="bg-green-50 rounded-lg p-3 font-semibold"
              >
                ✅ {tip}
              </li>

            ))}

          </ul>

        </div> 
        </div>
        

      </div>
    </div>
  );
}

export default AnalyzeResume;