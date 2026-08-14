import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Resume() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("title", title);
    formData.append("file", file);

    try {
      setUploading(true);

      const response = await API.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);

      setTitle("");
      setFile(null);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Upload Failed");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8 text-center">

          <div className="text-6xl mb-3">📄</div>

          <h1 className="text-4xl font-bold">
            Upload Resume
          </h1>

          <p className="mt-3 text-blue-100">
            Upload your latest resume to unlock AI-powered career insights,
            ATS analysis, skill gap detection, and personalized job recommendations.
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleUpload}
          className="p-8 space-y-6"
        >

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Resume Title
            </label>

            <input
              type="text"
              placeholder="Example: AI Engineer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 focus:border-blue-600 focus:outline-none"
              required
            />

          </div>

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Upload PDF Resume
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border-2 border-dashed border-blue-300 rounded-xl p-4 cursor-pointer"
              required
            />

            {file && (
              <div className="mt-3 bg-blue-50 rounded-lg p-3 text-blue-700 font-medium">
                ✅ {file.name}
              </div>
            )}

          </div>

          {/* Features */}

          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl">🤖</div>
              <p className="font-semibold mt-2">AI Analysis</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl">📊</div>
              <p className="font-semibold mt-2">ATS Score</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl">💼</div>
              <p className="font-semibold mt-2">Job Matching</p>
            </div>

          </div>

          {/* Buttons */}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
          >
            {uploading ? "Uploading Resume..." : "🚀 Upload Resume"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            ← Back to Dashboard
          </button>

        </form>

      </div>

    </div>
  );
}

export default Resume;