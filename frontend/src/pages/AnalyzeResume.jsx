import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

import {
  Award,
  Target,
  Star,
  Mail,
  Phone,
  GraduationCap,
  FolderKanban,
  BadgeCheck,
  AlertTriangle,
  BriefcaseBusiness,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  FileText,
} from "lucide-react";

function AnalyzeResume() {
  const navigate = useNavigate();
  const { resumeId } = useParams();

  // ==========================================================
  // STATES
  // ==========================================================

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH RESUME ANALYSIS
  // ==========================================================

  const fetchAnalysis = async () => {
    if (!resumeId) {
      setError("Resume ID not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "===================================="
      );

      console.log(
        "ANALYZING RESUME"
      );

      console.log(
        "Resume ID:",
        resumeId
      );

      console.log(
        "API URL:",
        `/resume/analyze/${resumeId}`
      );

      console.log(
        "===================================="
      );

      const response = await API.get(
        `/resume/analyze/${resumeId}`
      );

      console.log(
        "========== ANALYSIS RESPONSE =========="
      );

      console.log(
        response.data
      );

      console.log(
        "======================================="
      );

      setAnalysis(response.data);

    } catch (err) {
      console.error(
        "========== ANALYSIS ERROR =========="
      );

      console.error(err);

      console.error(
        "Response:",
        err.response?.data
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "===================================="
      );

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to analyze resume.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD ANALYSIS
  // ==========================================================

  useEffect(() => {
    fetchAnalysis();
  }, [resumeId]);

  // ==========================================================
  // SCORE COLOR
  // ==========================================================

  const getResumeScoreColor = (score) => {
    const numericScore =
      Number(score) || 0;

    if (numericScore >= 80) {
      return "text-green-600";
    }

    if (numericScore >= 60) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  // ==========================================================
  // SCORE BACKGROUND
  // ==========================================================

  const getScoreBackground = (score) => {
    const numericScore =
      Number(score) || 0;

    if (numericScore >= 80) {
      return "bg-green-100";
    }

    if (numericScore >= 60) {
      return "bg-yellow-100";
    }

    return "bg-red-100";
  };

  // ==========================================================
  // SCORE MESSAGE
  // ==========================================================

  const getScoreMessage = (score) => {
    const numericScore =
      Number(score) || 0;

    if (numericScore >= 80) {
      return "Excellent Resume";
    }

    if (numericScore >= 60) {
      return "Good Resume";
    }

    return "Needs Improvement";
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">

          <div className="flex justify-center mb-6">

            <div className="bg-blue-100 p-5 rounded-full">

              <RefreshCw
                className="w-12 h-12 text-blue-700 animate-spin"
              />

            </div>

          </div>

          <h1 className="text-3xl font-bold text-blue-700">
            Analyzing Resume...
          </h1>

          <p className="text-gray-500 mt-3">
            Please wait while our AI analyzes your resume.
          </p>

          <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">

            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // ERROR SCREEN
  // ==========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full">

          <div className="flex justify-center mb-5">

            <div className="bg-red-100 p-5 rounded-full">

              <AlertTriangle
                className="w-12 h-12 text-red-600"
              />

            </div>

          </div>

          <h1 className="text-3xl font-bold text-red-600">
            Analysis Failed
          </h1>

          <p className="text-gray-600 mt-4">
            {error}
          </p>

          <div className="flex justify-center gap-3 mt-7">

            <button
              onClick={fetchAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/my-resumes")
              }
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back
              </span>
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================================
  // NO ANALYSIS
  // ==========================================================

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="text-center">

          <FileText
            className="w-16 h-16 text-gray-400 mx-auto"
          />

          <h2 className="text-2xl font-bold text-gray-700 mt-4">
            No analysis available
          </h2>

          <button
            onClick={() =>
              navigate("/my-resumes")
            }
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to My Resumes
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // SAFE DATA
  // ==========================================================

  const skills =
    Array.isArray(analysis.skills)
      ? analysis.skills
      : [];

  const education =
    Array.isArray(analysis.education)
      ? analysis.education
      : [];

  const projects =
    Array.isArray(analysis.projects)
      ? analysis.projects
      : [];

  const certifications =
    Array.isArray(analysis.certifications)
      ? analysis.certifications
      : [];

  const missingSkills =
    Array.isArray(analysis.missing_skills)
      ? analysis.missing_skills
      : [];

  const careerRecommendations =
    Array.isArray(
      analysis.career_recommendation
    )
      ? analysis.career_recommendation
      : [];

  const resumeTips =
    Array.isArray(analysis.resume_tips)
      ? analysis.resume_tips
      : [];

  const contact =
    analysis.contact &&
    typeof analysis.contact === "object"
      ? analysis.contact
      : {};

  const resumeScore =
    Number(analysis.resume_score) || 0;

  const atsScore =
    Number(analysis.ats_score) || 0;

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <h1 className="text-3xl font-bold">
              AI Resume Analysis
            </h1>

            <p className="text-blue-100 mt-1">
              Detailed AI-powered analysis of your resume
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/my-resumes")
            }
            className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            <span className="flex items-center gap-2">

              <ArrowLeft className="w-5 h-5" />

              Back to My Resumes

            </span>
          </button>

        </div>

      </div>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">


        {/* ====================================================
            RESUME INFORMATION
        ==================================================== */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-xl p-8 mb-8">

          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <FileText className="w-10 h-10" />

                <h2 className="text-4xl font-bold">
                  {analysis.title ||
                    "Resume"}
                </h2>

              </div>

              <p className="mt-3 text-blue-100">
                Resume ID:{" "}
                <span className="font-semibold">
                  {analysis.resume_id}
                </span>
              </p>

            </div>

            <div className="flex items-center">

              <span className="bg-white/20 px-5 py-3 rounded-xl">
                AI Analysis Complete ✓
              </span>

            </div>

          </div>

        </div>


        {/* ====================================================
            SCORE CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


          {/* ==================================================
              RESUME SCORE
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-gray-500 font-semibold">
                  Resume Score
                </h2>

                <h1
                  className={`text-5xl font-bold mt-3 ${getResumeScoreColor(
                    resumeScore
                  )}`}
                >
                  {resumeScore}
                </h1>

              </div>

              <div className="bg-blue-100 p-3 rounded-xl">

                <Award className="w-9 h-9 text-blue-600" />

              </div>

            </div>

            <p className="text-gray-500 mt-3">
              Overall Resume Quality
            </p>

            <div className="mt-4">

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    resumeScore >= 80
                      ? "bg-green-500"
                      : resumeScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      resumeScore,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            <span
              className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${getScoreBackground(
                resumeScore
              )} ${getResumeScoreColor(
                resumeScore
              )}`}
            >
              {getScoreMessage(
                resumeScore
              )}
            </span>

          </div>


          {/* ==================================================
              ATS SCORE
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-gray-500 font-semibold">
                  ATS Score
                </h2>

                <h1
                  className={`text-5xl font-bold mt-3 ${
                    atsScore >= 80
                      ? "text-green-600"
                      : atsScore >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {atsScore}
                </h1>

              </div>

              <div className="bg-green-100 p-3 rounded-xl">

                <Target className="w-9 h-9 text-green-600" />

              </div>

            </div>

            <p className="text-gray-500 mt-3">
              ATS Compatibility
            </p>

            <div className="mt-4">

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">

                <div
                  className={`h-3 rounded-full ${
                    atsScore >= 80
                      ? "bg-green-500"
                      : atsScore >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      atsScore,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              SKILLS
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-gray-500 font-semibold">
                  Skills Found
                </h2>

                <h1 className="text-5xl font-bold text-yellow-600 mt-3">
                  {skills.length}
                </h1>

              </div>

              <div className="bg-yellow-100 p-3 rounded-xl">

                <Star className="w-9 h-9 text-yellow-500" />

              </div>

            </div>

            <p className="text-gray-500 mt-3">
              Skills Detected
            </p>

          </div>


          {/* ==================================================
              CONTACT
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div className="min-w-0">

                <h2 className="text-gray-500 font-semibold">
                  Contact
                </h2>

                <p className="font-semibold mt-3 break-all">
                  {contact.email ||
                    "Email not detected"}
                </p>

                <p className="text-gray-500 mt-2">
                  {contact.phone ||
                    "Phone not detected"}
                </p>

              </div>

              <div className="bg-purple-100 p-3 rounded-xl ml-3">

                <Mail className="w-9 h-9 text-purple-600" />

              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            CONTACT DETAILS
        ==================================================== */}

        {(contact.email ||
          contact.phone ||
          contact.name) && (

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

            <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">

              <Mail className="w-7 h-7" />

              Contact Information

            </h2>

            <div className="grid md:grid-cols-3 gap-5">

              {contact.name && (

                <div className="bg-purple-50 rounded-xl p-5">

                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    {contact.name}
                  </p>

                </div>

              )}

              {contact.email && (

                <div className="bg-purple-50 rounded-xl p-5">

                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    {contact.email}
                  </p>

                </div>

              )}

              {contact.phone && (

                <div className="bg-purple-50 rounded-xl p-5">

                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    {contact.phone}
                  </p>

                </div>

              )}

            </div>

          </div>

        )}


        {/* ====================================================
            SKILLS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">

            <Star className="w-7 h-7" />

            Skills

          </h2>

          {skills.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-gray-500">
              No skills were detected in your resume.
            </div>

          ) : (

            <div className="flex flex-wrap gap-3">

              {skills.map(
                (skill, index) => (

                  <span
                    key={`${skill}-${index}`}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold shadow-sm"
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          )}

        </div>


        {/* ====================================================
            EDUCATION
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">

            <GraduationCap className="w-7 h-7" />

            Education

          </h2>

          {education.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-gray-500">
              No education information was detected.
            </div>

          ) : (

            <ul className="space-y-3">

              {education.map(
                (edu, index) => (

                  <li
                    key={index}
                    className="bg-purple-50 rounded-xl p-4"
                  >
                    <span className="font-medium">
                      {edu}
                    </span>
                  </li>

                )
              )}

            </ul>

          )}

        </div>


        {/* ====================================================
            PROJECTS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">

            <FolderKanban className="w-7 h-7" />

            Projects

          </h2>

          {projects.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-gray-500">
              No projects were detected.
            </div>

          ) : (

            <ul className="space-y-3">

              {projects.map(
                (project, index) => (

                  <li
                    key={index}
                    className="bg-blue-50 rounded-xl p-4"
                  >
                    <span className="font-medium">
                      {project}
                    </span>
                  </li>

                )
              )}

            </ul>

          )}

        </div>


        {/* ====================================================
            CERTIFICATIONS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">

            <BadgeCheck className="w-7 h-7" />

            Certifications

          </h2>

          {certifications.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-6 text-gray-500">
              No certifications were detected.
            </div>

          ) : (

            <ul className="space-y-3">

              {certifications.map(
                (certification, index) => (

                  <li
                    key={index}
                    className="bg-orange-50 rounded-xl p-4"
                  >
                    <span className="font-medium">
                      {certification}
                    </span>
                  </li>

                )
              )}

            </ul>

          )}

        </div>


        {/* ====================================================
            MISSING SKILLS + CAREER
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">


          {/* ==================================================
              MISSING SKILLS
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">

              <AlertTriangle className="w-7 h-7" />

              Missing Skills

            </h2>

            {missingSkills.length === 0 ? (

              <div className="bg-green-50 text-green-700 rounded-xl p-5 font-semibold">
                🎉 No major missing skills were detected.
              </div>

            ) : (

              <div className="flex flex-wrap gap-3">

                {missingSkills.map(
                  (skill, index) => (

                    <span
                      key={`${skill}-${index}`}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              CAREER RECOMMENDATION
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">

              <BriefcaseBusiness className="w-7 h-7" />

              Career Recommendation

            </h2>

            {careerRecommendations.length ===
            0 ? (

              <div className="bg-gray-50 rounded-xl p-5 text-gray-500">
                No career recommendations available.
              </div>

            ) : (

              <ul className="space-y-3">

                {careerRecommendations.map(
                  (career, index) => (

                    <li
                      key={index}
                      className="bg-blue-50 rounded-xl p-4 font-semibold text-blue-800"
                    >
                      {career}
                    </li>

                  )
                )}

              </ul>

            )}

          </div>

        </div>


        {/* ====================================================
            RESUME IMPROVEMENT TIPS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">

            <Lightbulb className="w-7 h-7" />

            Resume Improvement Tips

          </h2>

          {resumeTips.length === 0 ? (

            <div className="bg-gray-50 rounded-xl p-5 text-gray-500">
              No additional tips available.
            </div>

          ) : (

            <div className="space-y-4">

              {resumeTips.map(
                (tip, index) => (

                  <div
                    key={index}
                    className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4"
                  >

                    <div className="flex gap-3">

                      <span className="text-green-600 font-bold">
                        ✓
                      </span>

                      <span className="font-medium text-gray-700">
                        {tip}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* ====================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>

              <h3 className="text-xl font-bold text-gray-800">
                Analysis Complete 🎉
              </h3>

              <p className="text-gray-500 mt-1">
                Review your results and improve your resume.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={fetchAnalysis}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
              >
                <span className="flex items-center gap-2">

                  <RefreshCw className="w-5 h-5" />

                  Re-analyze

                </span>
              </button>

              <button
                onClick={() =>
                  navigate("/my-resumes")
                }
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg font-semibold"
              >
                Back to Resumes
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyzeResume;