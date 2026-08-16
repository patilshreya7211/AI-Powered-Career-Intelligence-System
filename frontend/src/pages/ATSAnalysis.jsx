
import { useRef, useState } from "react";
import API from "../services/api";

function ATSAnalysis() {
  // ============================================================
  // USER
  // ============================================================

  const user = JSON.parse(localStorage.getItem("user"));

  // ============================================================
  // STATES
  // ============================================================

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Used to reset the file input
  const fileInputRef = useRef(null);

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    console.log("=================================");
    console.log("JOB DESCRIPTION FILE SELECTED");
    console.log("=================================");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    console.log("File Name:", selectedFile.name);
    console.log("File Type:", selectedFile.type);
    console.log("File Size:", selectedFile.size);

    // ----------------------------------------------------------
    // Validate extension
    // ----------------------------------------------------------

    const fileName = selectedFile.name.toLowerCase();

    const isPDF = fileName.endsWith(".pdf");
    const isTXT = fileName.endsWith(".txt");

    if (!isPDF && !isTXT) {
      alert("Please select only PDF or TXT files.");

      event.target.value = "";
      setFile(null);

      return;
    }

    // ----------------------------------------------------------
    // Validate file size
    // ----------------------------------------------------------

    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (selectedFile.size > maxSize) {
      alert("File size must be less than 10 MB.");

      event.target.value = "";
      setFile(null);

      return;
    }

    // ----------------------------------------------------------
    // Set file
    // ----------------------------------------------------------

    setFile(selectedFile);

    // File and text are mutually exclusive
    setJobDescription("");

    // Clear old result
    setResult(null);

    // Clear previous error
    setErrorMessage("");

    console.log("✅ Job Description File Stored");
  };

  // ============================================================
  // JOB DESCRIPTION TEXT CHANGE
  // ============================================================

  const handleJobDescriptionChange = (event) => {
    const text = event.target.value;

    setJobDescription(text);

    // If user enters text, remove uploaded file
    if (text.trim().length > 0) {
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    // Clear previous result
    setResult(null);

    // Clear previous error
    setErrorMessage("");
  };

  // ============================================================
  // CLEAR FILE
  // ============================================================

  const handleRemoveFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setResult(null);
    setErrorMessage("");

    console.log("Job Description File Removed");
  };

  // ============================================================
  // ANALYZE ATS
  // ============================================================

  const handleUpload = async () => {
    console.log("\n=================================");
    console.log("ATS ANALYSIS BUTTON CLICKED");
    console.log("=================================");

    setErrorMessage("");

    // ==========================================================
    // 1. CHECK USER
    // ==========================================================

    if (!user || !user.id) {
      alert("User information not found. Please login again.");
      return;
    }

    console.log("User ID:", user.id);

    // ==========================================================
    // 2. CHECK INPUT
    // ==========================================================

    if (!file && !jobDescription.trim()) {
      const message =
        "Please upload a Job Description PDF/TXT or enter the Job Description as text.";

      setErrorMessage(message);
      alert(message);

      return;
    }

    // ==========================================================
    // 3. CREATE FORMDATA
    // ==========================================================

    const formData = new FormData();

    // ==========================================================
    // 4. ADD FILE
    // ==========================================================

    if (file) {
      console.log("\n========== ADDING FILE ==========");

      console.log("Field Name : file");
      console.log("File Name  :", file.name);
      console.log("File Type  :", file.type);
      console.log("File Size  :", file.size);

      /*
       * IMPORTANT:
       *
       * This "file" name MUST match:
       *
       * file: UploadFile = File(None)
       *
       * in FastAPI.
       */

      formData.append("file", file);

      console.log("✅ File added to FormData");
    }

    // ==========================================================
    // 5. ADD TEXT JOB DESCRIPTION
    // ==========================================================

    if (jobDescription.trim()) {
      console.log("\n========== ADDING TEXT JD ==========");

      formData.append(
        "job_description",
        jobDescription.trim()
      );

      console.log("✅ Job description text added");
    }

    // ==========================================================
    // 6. DEBUG FORMDATA
    // ==========================================================

    console.log("\n========== FINAL FORMDATA ==========");

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key} => FILE`,
          {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        );
      } else {
        console.log(
          `${key} => TEXT`,
          value
        );
      }
    }

    console.log("====================================");

    // ==========================================================
    // 7. API URL
    // ==========================================================

    const endpoint = `/ats/${user.id}`;

    console.log("\n========== ATS REQUEST ==========");
    console.log("Endpoint:", endpoint);
    console.log("Method: POST");
    console.log("=================================");

    // ==========================================================
    // 8. SEND REQUEST
    // ==========================================================

    try {
      setLoading(true);
      setResult(null);

      const response = await API.post(
        endpoint,
        formData,

        /*
         * DO NOT manually create the multipart boundary.
         *
         * Browser/Axios will create:
         *
         * Content-Type:
         * multipart/form-data; boundary=....
         */

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ========================================================
      // 9. SUCCESS RESPONSE
      // ========================================================

      console.log("\n========== ATS RESPONSE ==========");

      console.log("Status:", response.status);
      console.log("Data:", response.data);

      console.log("==================================");

      if (
        response.data &&
        response.data.success &&
        response.data.data
      ) {
        setResult(response.data.data);

        setErrorMessage("");

        console.log("✅ ATS ANALYSIS SUCCESSFUL");

        return;
      }

      // ========================================================
      // INVALID RESPONSE
      // ========================================================

      console.error(
        "Invalid ATS response:",
        response.data
      );

      const invalidMessage =
        "ATS analysis returned an invalid response.";

      setErrorMessage(invalidMessage);
      alert(invalidMessage);

    } catch (error) {
      // ========================================================
      // ERROR
      // ========================================================

      console.error("\n========== ATS ERROR ==========");

      console.error("Error:", error);

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Headers:",
        error.response?.headers
      );

      console.error(
        "================================");

      // ========================================================
      // GET BACKEND ERROR MESSAGE
      // ========================================================

      let message = "ATS Analysis Failed.";

      if (error.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      setErrorMessage(message);

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SCORE COLOR
  // ============================================================

  const getScoreColor = () => {
    if (!result) {
      return "bg-blue-600";
    }

    if (result.ats_score >= 80) {
      return "bg-green-500";
    }

    if (result.ats_score >= 60) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };

  // ============================================================
  // SCORE MESSAGE
  // ============================================================

  const getScoreMessage = () => {
    if (!result) {
      return null;
    }

    if (result.ats_score >= 80) {
      return (
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
          Excellent Resume
        </span>
      );
    }

    if (result.ats_score >= 60) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
          Good Resume
        </span>
      );
    }

    return (
      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
        Needs Improvement
      </span>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-8">

          <h1 className="text-3xl md:text-4xl font-bold">
            🤖 ATS Resume Analysis
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Compare your resume with a Job Description
            and discover matching and missing skills.
          </p>

        </div>


        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {errorMessage && (

          <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-5">

            <h3 className="font-bold text-red-700 mb-2">
              ⚠️ ATS Analysis Error
            </h3>

            <p className="text-red-600">
              {errorMessage}
            </p>

          </div>

        )}


        {/* ======================================================
            INPUT CARD
        ====================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          {/* ==================================================
              FILE UPLOAD
          ================================================== */}

          <div>

            <h2 className="text-xl font-bold text-blue-700 mb-3">
              📄 Upload Job Description
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded-lg p-3 bg-white"
            />

            {/* ==================================================
                SELECTED FILE
            ================================================== */}

            {file && (

              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                  <div>

                    <p className="text-green-700 font-semibold">
                      ✅ Job Description Selected
                    </p>

                    <p className="text-sm text-green-600 mt-1">
                      File: {file.name}
                    </p>

                    <p className="text-sm text-green-600">
                      Type: {file.type || "Unknown"}
                    </p>

                    <p className="text-sm text-green-600">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}

          </div>


          {/* ==================================================
              OR
          ================================================== */}

          <div className="flex items-center my-7">

            <div className="flex-grow border-t border-gray-300"></div>

            <span className="mx-4 text-gray-500 font-semibold">
              OR
            </span>

            <div className="flex-grow border-t border-gray-300"></div>

          </div>


          {/* ==================================================
              TEXT JOB DESCRIPTION
          ================================================== */}

          <div>

            <h2 className="text-xl font-bold text-blue-700 mb-3">
              📝 Enter Job Description as Text
            </h2>

            <textarea
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              placeholder="Paste the complete job description here..."
              className="w-full h-64 border border-gray-300 rounded-xl p-4 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-2 text-sm text-gray-500">

              <span>
                Paste the complete job description here.
              </span>

              <span>
                {jobDescription.length} characters
              </span>

            </div>

          </div>


          {/* ==================================================
              ANALYSIS INPUT
          ================================================== */}

          {(file || jobDescription.trim()) && (

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">

              <h3 className="font-bold text-blue-700 mb-2">
                Analysis Input
              </h3>

              {file && (

                <p className="text-blue-600">
                  📄 Job Description File:{" "}
                  <span className="font-semibold">
                    {file.name}
                  </span>
                </p>

              )}

              {!file && jobDescription.trim() && (

                <p className="text-blue-600">
                  📝 Job Description: Text entered
                </p>

              )}

            </div>

          )}


          {/* ==================================================
              ANALYZE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className={`mt-6 bg-blue-700 hover:bg-blue-800 hover:scale-105 transition-all duration-300 text-white px-8 py-3 rounded-xl font-semibold shadow-lg ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >

            {loading
              ? "🤖 Analyzing Resume..."
              : "🤖 Analyze Resume"}

          </button>

        </div>


        {/* ======================================================
            RESULT
        ====================================================== */}

        {result && (

          <>

            {/* ==================================================
                ATS SCORE
            ================================================== */}

            <div className="flex justify-center mt-8">

              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">

                <h2 className="text-center text-xl font-bold text-blue-700 mb-5">
                  ATS Score
                </h2>

                <div className="text-center">

                  <h1 className="text-6xl font-extrabold text-blue-700">
                    {result.ats_score}%
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Resume Match Score
                  </p>

                </div>


                {/* ==================================================
                    PROGRESS
                ================================================== */}

                <div className="mt-6">

                  <div className="flex justify-between text-sm font-semibold mb-2">

                    <span>
                      Progress
                    </span>

                    <span>
                      {result.match_percentage}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

                    <div
                      className={`${getScoreColor()} h-4 rounded-full transition-all duration-1000`}
                      style={{
                        width: `${result.match_percentage}%`,
                      }}
                    ></div>

                  </div>

                </div>


                {/* ==================================================
                    SCORE MESSAGE
                ================================================== */}

                <div className="mt-5 text-center">

                  {getScoreMessage()}

                </div>

              </div>

            </div>


            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid md:grid-cols-3 gap-6 mt-8">

              <div className="bg-green-100 rounded-xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-green-700">
                  {result.matching_skills?.length || 0}
                </h3>

                <p className="font-semibold mt-2">
                  Matching Skills
                </p>

              </div>


              <div className="bg-red-100 rounded-xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-red-700">
                  {result.missing_skills?.length || 0}
                </h3>

                <p className="font-semibold mt-2">
                  Missing Skills
                </p>

              </div>


              <div className="bg-blue-100 rounded-xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-blue-700">
                  {result.job_skills?.length || 0}
                </h3>

                <p className="font-semibold mt-2">
                  Required Skills
                </p>

              </div>

            </div>


            {/* ==================================================
                MATCHING + MISSING SKILLS
            ================================================== */}

            <div className="grid lg:grid-cols-2 gap-8 mt-8">

              {/* ==================================================
                  MATCHING SKILLS
              ================================================== */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-2xl font-bold text-green-700 mb-5">
                  ✅ Matching Skills
                </h3>

                {result.matching_skills?.length > 0 ? (

                  <div className="flex flex-wrap gap-3">

                    {result.matching_skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-full shadow"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-gray-500">
                    No matching skills found.
                  </p>

                )}

              </div>


              {/* ==================================================
                  MISSING SKILLS
              ================================================== */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-2xl font-bold text-red-700 mb-5">
                  ❌ Missing Skills
                </h3>

                {result.missing_skills?.length > 0 ? (

                  <div className="flex flex-wrap gap-3">

                    {result.missing_skills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-full shadow"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-green-600 font-semibold">
                    🎉 No missing skills found!
                  </p>

                )}

              </div>

            </div>


            {/* ==================================================
                REQUIRED JOB SKILLS
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

              <h3 className="text-2xl font-bold text-blue-700 mb-5">
                💼 Required Job Skills
              </h3>

              {result.job_skills?.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {result.job_skills.map(
                    (skill, index) => (

                      <span
                        key={`${skill}-${index}`}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full shadow"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-500">
                  No technical skills detected in the job description.
                </p>

              )}

            </div>


            {/* ==================================================
                RECOMMENDATIONS
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 mb-10">

              <h3 className="text-3xl font-bold text-blue-700 mb-6">
                💡 AI Recommendations
              </h3>

              {result.recommendations?.length > 0 ? (

                <div className="space-y-4">

                  {result.recommendations.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg"
                      >
                        {item}
                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-500">
                  No recommendations available.
                </p>

              )}

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default ATSAnalysis;