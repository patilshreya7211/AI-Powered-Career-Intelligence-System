import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ResumeBuilder() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateResume = async () => {
    if (!content.trim()) {
      alert("Please enter your resume information.");
      return;
    }

    if (!user || !user.id) {
      alert("User information not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Send resume information to backend
      const response = await API.post(
        "/resume-builder/create",
        {
          user_id: user.id,
          resume_text: content,
        }
      );

      console.log("Backend Response:", response.data);

      // Save the content temporarily
      localStorage.setItem("resumeBuilderContent", content);

      // Save backend response temporarily
      localStorage.setItem(
        "resumeBuilderResponse",
        JSON.stringify(response.data)
      );

      alert("Resume information submitted successfully!");

      // Go to preview page
      navigate("/resume-preview");

    } catch (error) {
      console.error("Resume Builder Error:", error);

      if (error.response) {
        alert(
          error.response.data.detail ||
          error.response.data.message ||
          "Unable to create resume."
        );
      } else if (error.request) {
        alert(
          "Unable to connect to the backend. Please make sure FastAPI is running."
        );
      } else {
        alert("Unable to create resume.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-3xl shadow-xl p-8 md:p-10 mb-8">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 rounded-2xl p-4 text-4xl">
              📄
            </div>

            <div>

              <h1 className="text-3xl md:text-4xl font-bold">
                AI Resume Builder
              </h1>

              <p className="mt-2 text-blue-100 text-lg">
                Create a professional resume from your information
              </p>

            </div>

          </div>

        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">

          {/* Information Section */}
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Enter Your Information
            </h2>

            <p className="text-gray-500 mt-2">
              Paste all your information below. You can include your
              education, skills, projects, experience, certifications,
              achievements and other details.
            </p>

          </div>

          {/* Example */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">

            <h3 className="font-bold text-blue-700 mb-3">
              💡 Example Format
            </h3>

            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`Name: Shreya Patil

Email: shreya@example.com
Phone: +91 XXXXX XXXXX
LinkedIn: linkedin.com/in/yourprofile
GitHub: github.com/yourprofile

Career Objective:
Aspiring AI/ML Engineer interested in developing
intelligent software solutions.

Education:
B.Tech in Artificial Intelligence and Machine Learning
XYZ College, Maharashtra

Skills:
Python, Machine Learning, Deep Learning,
React.js, FastAPI, PostgreSQL

Projects:
AI Career Intelligence System
Structural Health Monitoring System
Medical Store Management System

Experience:
AI/ML Intern
Full Stack Development Intern

Certifications:
NPTEL DBMS
AI Fundamentals
Cloud / AI-ML Virtual Internship

Achievements:
Hackathon Participant
Ideathon Participant`}
            </pre>

          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your complete information here..."
            className="w-full min-h-[500px] border-2 border-gray-200 rounded-2xl p-6 text-gray-700 text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 resize-y"
          />

          {/* Character Count */}
          <div className="flex flex-col md:flex-row justify-between gap-2 items-start md:items-center mt-3">

            <p className="text-sm text-gray-500">
              {content.length} characters
            </p>

            <p className="text-sm text-gray-500">
              Include as much relevant information as possible.
            </p>

          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">

            {/* Create Resume */}
            <button
              onClick={handleCreateResume}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition duration-300"
            >

              {loading
                ? "⏳ Creating Resume..."
                : "✨ Create Resume"}

            </button>

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="md:w-48 bg-gray-600 hover:bg-gray-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition"
            >
              ← Dashboard
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResumeBuilder;