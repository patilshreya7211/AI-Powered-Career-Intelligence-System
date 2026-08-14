import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyResumes() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [resumes, setResumes] = useState([]);

  // ===========================
  // Fetch Resumes
  // ===========================
  const fetchResumes = async () => {
    try {
      const response = await API.get(`/resume/${user.id}`);
      setResumes(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load resumes.");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ===========================
  // Delete Resume
  // ===========================
  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await API.delete(`/resume/delete/${resumeId}`);
      alert("Resume deleted successfully!");
      fetchResumes();
    } catch (error) {
      console.error(error);
      alert("Failed to delete resume.");
    }
  };

  // ===========================
  // Replace Resume
  // ===========================
  const replaceResume = async (resumeId, title, file) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("file", file);

    try {
      await API.put(`/resume/replace/${resumeId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume replaced successfully!");

      fetchResumes();
    } catch (error) {
      console.error(error);
      alert("Failed to replace resume.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-700 text-white p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          My Uploaded Resumes
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-10">

        <div className="bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Uploaded Resumes
          </h2>

          {resumes.length === 0 ? (

            <p>No resumes uploaded yet.</p>

          ) : (

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Uploaded At</th>
                  <th className="p-3">Actions</th>

                </tr>

              </thead>

              <tbody>

                {resumes.map((resume) => (

                  <tr
                    key={resume.id}
                    className="border-b text-center hover:bg-gray-100"
                  >

                    <td className="p-3">{resume.id}</td>

                    <td className="p-3">{resume.title}</td>

                    <td className="p-3">
                      {resume.uploaded_at
                        ? new Date(resume.uploaded_at).toLocaleString()
                        : "N/A"}
                    </td>

                    <td className="p-3">

                      <div className="flex justify-center gap-2 flex-wrap">

                        {/* View */}
                        <button
                          onClick={() =>
                            window.open(
                              `http://127.0.0.1:8000/${resume.file_url}`,
                              "_blank"
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View
                        </button>

                        {/* Download */}
                        <a
                          href={`http://127.0.0.1:8000/${resume.file_url}`}
                          download
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Download
                        </a>

                        {/* Analyze */}
                        <button
                          onClick={() => navigate(`/analyze/${resume.id}`)}
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                        >
                          Analyze
                        </button>

                        {/* Replace */}
                        <label className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer">

                          Replace

                          <input
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={(e) => {
                              if (!e.target.files[0]) return;

                              replaceResume(
                                resume.id,
                                resume.title,
                                e.target.files[0]
                              );
                            }}
                          />

                        </label>

                        {/* Delete */}
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default MyResumes;