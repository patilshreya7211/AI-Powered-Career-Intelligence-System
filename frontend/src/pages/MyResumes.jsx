import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { BACKEND_URL } from "../services/api";

function MyResumes() {
  const navigate = useNavigate();

  // ============================================================
  // GET LOGGED-IN USER
  // ============================================================

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ============================================================
  // STATES
  // ============================================================

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // ============================================================
  // FETCH RESUMES
  // ============================================================

  const fetchResumes = async () => {
    try {
      setLoading(true);

      if (!user) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const userId =
        user.id ||
        user.user_id ||
        user.userId;

      if (!userId) {
        alert("User ID not found. Please login again.");
        navigate("/login");
        return;
      }

      console.log(
        "Fetching resumes for user:",
        userId
      );

      const response = await API.get(
        `/resume/${userId}`
      );

      console.log(
        "Resume API Response:",
        response.data
      );

      setResumes(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "Fetch Resumes Error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to load resumes."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD ON PAGE OPEN
  // ============================================================

  useEffect(() => {
    fetchResumes();
  }, []);

  // ============================================================
  // BUILD FILE URL
  // ============================================================

  const getFileUrl = (resume) => {
    if (!resume?.file_url) {
      return null;
    }

    const fileUrl = resume.file_url;

    // Already a complete URL
    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    // Example:
    // /uploads/myresume.pdf
    return `${BACKEND_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  // ============================================================
  // VIEW RESUME
  // ============================================================

  const viewResume = (resume) => {
    const fileUrl = getFileUrl(resume);

    console.log(
      "View Resume URL:",
      fileUrl
    );

    if (!fileUrl) {
      alert("Resume file URL not found.");
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // DOWNLOAD RESUME
  // ============================================================

  const downloadResume = async (resume) => {
    const fileUrl = getFileUrl(resume);

    console.log(
      "Download Resume URL:",
      fileUrl
    );

    if (!fileUrl) {
      alert("Resume file URL not found.");
      return;
    }

    try {
      setDownloadingId(resume.id);

      const response = await fetch(
        fileUrl
      );

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob =
        await response.blob();

      const blobUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = blobUrl;

      const originalName =
        resume.file_url
          ?.split("/")
          .pop() ||
        "resume.pdf";

      link.download =
        originalName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(
        blobUrl
      );

    } catch (error) {
      console.error(
        "Download Error:",
        error
      );

      alert(
        "Unable to download the resume."
      );

    } finally {
      setDownloadingId(null);
    }
  };

  // ============================================================
  // ANALYZE RESUME
  // ============================================================

  const analyzeResume = (resumeId) => {
    console.log(
      "Opening analysis for resume:",
      resumeId
    );

    navigate(
      `/analyze/${resumeId}`
    );
  };

  // ============================================================
  // DELETE RESUME
  // ============================================================

  const deleteResume = async (resumeId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this resume?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(
        `/resume/delete/${resumeId}`
      );

      alert(
        "Resume deleted successfully!"
      );

      fetchResumes();

    } catch (error) {
      console.error(
        "Delete Resume Error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete resume."
      );
    }
  };

  // ============================================================
  // REPLACE RESUME
  // ============================================================

  const replaceResume = async (
    resumeId,
    title,
    file
  ) => {
    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Only PDF files are allowed."
      );
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "title",
      title
    );

    formData.append(
      "file",
      file
    );

    try {
      await API.put(
        `/resume/replace/${resumeId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Resume replaced successfully!"
      );

      fetchResumes();

    } catch (error) {
      console.error(
        "Replace Resume Error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Failed to replace resume."
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-5"></div>

          <h1 className="text-2xl font-bold text-blue-700">
            Loading Your Resumes...
          </h1>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-blue-700 text-white p-5 flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          My Uploaded Resumes
        </h1>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Back to Dashboard
        </button>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="max-w-7xl mx-auto mt-10 px-5 pb-10">

        <div className="bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Uploaded Resumes
          </h2>

          {resumes.length === 0 ? (

            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                📄
              </div>

              <h3 className="text-xl font-bold text-gray-700">
                No Resumes Uploaded
              </h3>

              <p className="text-gray-500 mt-2">
                Upload your resume to start
                analyzing your career profile.
              </p>

              <button
                onClick={() =>
                  navigate("/resume")
                }
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Upload Resume
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-blue-600 text-white">

                    <th className="p-3">
                      ID
                    </th>

                    <th className="p-3">
                      Title
                    </th>

                    <th className="p-3">
                      Uploaded At
                    </th>

                    <th className="p-3">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {resumes.map(
                    (resume) => (

                      <tr
                        key={resume.id}
                        className="border-b text-center hover:bg-gray-50"
                      >

                        {/* ID */}

                        <td className="p-3 font-semibold">
                          {resume.id}
                        </td>

                        {/* TITLE */}

                        <td className="p-3">
                          {resume.title}
                        </td>

                        {/* DATE */}

                        <td className="p-3">

                          {resume.uploaded_at
                            ? new Date(
                                resume.uploaded_at
                              ).toLocaleString()
                            : "N/A"}

                        </td>

                        {/* ACTIONS */}

                        <td className="p-3">

                          <div className="flex justify-center gap-2 flex-wrap">

                            {/* ==========================
                                VIEW
                            ========================== */}

                            <button
                              type="button"
                              onClick={() =>
                                viewResume(
                                  resume
                                )
                              }
                              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                            >
                              View
                            </button>

                            {/* ==========================
                                DOWNLOAD
                            ========================== */}

                            <button
                              type="button"
                              onClick={() =>
                                downloadResume(
                                  resume
                                )
                              }
                              disabled={
                                downloadingId ===
                                resume.id
                              }
                              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
                            >
                              {downloadingId ===
                              resume.id
                                ? "Downloading..."
                                : "Download"}
                            </button>

                            {/* ==========================
                                ANALYZE
                            ========================== */}

                            <button
                              type="button"
                              onClick={() =>
                                analyzeResume(
                                  resume.id
                                )
                              }
                              className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition"
                            >
                              Analyze
                            </button>

                            {/* ==========================
                                REPLACE
                            ========================== */}

                            <label className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 cursor-pointer transition">

                              Replace

                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                hidden
                                onChange={(
                                  e
                                ) => {

                                  const selectedFile =
                                    e.target.files?.[0];

                                  if (
                                    !selectedFile
                                  ) {
                                    return;
                                  }

                                  replaceResume(
                                    resume.id,
                                    resume.title,
                                    selectedFile
                                  );

                                  e.target.value =
                                    "";
                                }}
                              />

                            </label>

                            {/* ==========================
                                DELETE
                            ========================== */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteResume(
                                  resume.id
                                )
                              }
                              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MyResumes;