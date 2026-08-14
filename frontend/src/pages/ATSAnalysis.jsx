import { useState } from "react";
import axios from "axios";

function ATSAnalysis() {
  // ============================================================
  // USER
  // ============================================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ============================================================
  // STATES
  // ============================================================

  const [file, setFile] = useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);


  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files[0];

    setFile(selectedFile);

    // If a file is selected,
    // clear text JD
    if (selectedFile) {
      setJobDescription("");
    }

    // Clear previous result
    setResult(null);
  };


  // ============================================================
  // JOB DESCRIPTION TEXT CHANGE
  // ============================================================

  const handleJobDescriptionChange = (e) => {
    const text = e.target.value;

    setJobDescription(text);

    // If text is entered,
    // clear uploaded file
    if (text.trim()) {
      setFile(null);
    }

    // Clear previous result
    setResult(null);
  };


  // ============================================================
  // ANALYZE ATS
  // ============================================================

  const handleUpload = async () => {

    // ----------------------------------------------------------
    // Check user
    // ----------------------------------------------------------

    if (!user || !user.id) {
      alert(
        "User information not found. Please login again."
      );
      return;
    }


    // ----------------------------------------------------------
    // Check Job Description
    // ----------------------------------------------------------

    if (
      !file &&
      !jobDescription.trim()
    ) {
      alert(
        "Please upload a Job Description PDF/TXT or enter the Job Description as text."
      );
      return;
    }


    // ----------------------------------------------------------
    // Create FormData
    // ----------------------------------------------------------

    const formData = new FormData();


    // ----------------------------------------------------------
    // Option 1: File
    // ----------------------------------------------------------

    if (file) {
      formData.append(
        "file",
        file
      );
    }


    // ----------------------------------------------------------
    // Option 2: Text
    // ----------------------------------------------------------

    if (jobDescription.trim()) {
      formData.append(
        "job_description",
        jobDescription.trim()
      );
    }


    try {

      setLoading(true);

      setResult(null);


      // --------------------------------------------------------
      // API REQUEST
      // --------------------------------------------------------

      const response =
        await axios.post(
          `http://127.0.0.1:8000/ats/${user.id}`,
          formData
        );


      // --------------------------------------------------------
      // Save Result
      // --------------------------------------------------------

      setResult(
        response.data.data
      );


    } catch (error) {

      console.error(
        "ATS Analysis Error:",
        error
      );


      // --------------------------------------------------------
      // Get actual backend error
      // --------------------------------------------------------

      let errorMessage =
        "ATS Analysis Failed";


      if (
        error.response &&
        error.response.data
      ) {

        if (
          typeof error.response.data.detail ===
          "string"
        ) {

          errorMessage =
            error.response.data.detail;

        } else if (
          error.response.data.message
        ) {

          errorMessage =
            error.response.data.message;

        } else {

          errorMessage =
            JSON.stringify(
              error.response.data
            );
        }

      } else if (error.message) {

        errorMessage =
          error.message;

      }


      alert(errorMessage);

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

    if (
      result.ats_score >= 80
    ) {
      return "bg-green-500";
    }

    if (
      result.ats_score >= 60
    ) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-6xl mx-auto">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-8">

          <h1 className="text-4xl font-bold">
            🤖 ATS Resume Analysis
          </h1>

          <p className="mt-3 text-blue-100 text-lg">
            Compare your resume with the Job Description
            and discover missing skills.
          </p>

        </div>


        {/* ======================================================
            INPUT CARD
        ====================================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8">


          {/* ==================================================
              JOB DESCRIPTION FILE
          ================================================== */}

          <div>

            <h2 className="text-xl font-bold text-blue-700 mb-3">

              📄 Upload Job Description

            </h2>


            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="block w-full border rounded-lg p-3"
            />


            {file && (

              <p className="mt-2 text-sm text-green-600">

                Selected file:{" "}

                <span className="font-semibold">
                  {file.name}
                </span>

              </p>

            )}

          </div>


          {/* ==================================================
              OR DIVIDER
          ================================================== */}

          <div className="flex items-center my-7">

            <div className="flex-grow border-t border-gray-300"></div>

            <span className="mx-4 text-gray-500 font-semibold">
              OR
            </span>

            <div className="flex-grow border-t border-gray-300"></div>

          </div>


          {/* ==================================================
              JOB DESCRIPTION TEXT
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


            <div className="flex justify-between mt-2 text-sm text-gray-500">

              <span>
                Paste the complete job description here.
              </span>

              <span>
                {jobDescription.length} characters
              </span>

            </div>

          </div>


          {/* ==================================================
              SELECTED INPUT STATUS
          ================================================== */}

          {(file || jobDescription.trim()) && (

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">

              <h3 className="font-bold text-blue-700 mb-2">

                Analysis Input

              </h3>


              {file && (

                <p className="text-blue-600">

                  📄 Job Description:{" "}

                  <span className="font-semibold">
                    {file.name}
                  </span>

                </p>

              )}


              {!file &&
                jobDescription.trim() && (

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

              <div className="bg-white rounded-2xl shadow-xl p-6 w-80 hover:shadow-2xl transition-all duration-300">

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


                {/* Progress */}

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
                      className={`${getScoreColor()} h-4 rounded-full transition-all duration-1000 ease-in-out`}
                      style={{
                        width: `${result.match_percentage}%`,
                      }}
                    ></div>

                  </div>

                </div>


                {/* Score Message */}

                <div className="mt-5 text-center">

                  {result.ats_score >= 80 && (

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

                      Excellent Resume

                    </span>

                  )}


                  {result.ats_score >= 60 &&
                    result.ats_score < 80 && (

                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">

                      Good Resume

                    </span>

                  )}


                  {result.ats_score < 60 && (

                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">

                      Needs Improvement

                    </span>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                STATS
            ================================================== */}

            <div className="grid md:grid-cols-3 gap-6 mt-8">


              {/* Matching Skills */}

              <div className="bg-green-100 rounded-xl shadow-md p-6 text-center hover:scale-105 transition">

                <h3 className="text-4xl font-bold text-green-700">

                  {result.matching_skills?.length || 0}

                </h3>

                <p className="font-semibold mt-2">

                  Matching Skills

                </p>

              </div>


              {/* Missing Skills */}

              <div className="bg-red-100 rounded-xl shadow-md p-6 text-center hover:scale-105 transition">

                <h3 className="text-4xl font-bold text-red-700">

                  {result.missing_skills?.length || 0}

                </h3>

                <p className="font-semibold mt-2">

                  Missing Skills

                </p>

              </div>


              {/* Required Skills */}

              <div className="bg-blue-100 rounded-xl shadow-md p-6 text-center hover:scale-105 transition">

                <h3 className="text-4xl font-bold text-blue-700">

                  {result.job_skills?.length || 0}

                </h3>

                <p className="font-semibold mt-2">

                  Required Skills

                </p>

              </div>

            </div>


            {/* ==================================================
                SKILLS
            ================================================== */}

            <div className="grid lg:grid-cols-2 gap-8 mt-8">


              {/* Matching Skills */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-2xl font-bold text-green-700 mb-5">

                  ✅ Matching Skills

                </h3>


                <div className="flex flex-wrap gap-3">

                  {result.matching_skills?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full shadow hover:bg-green-600 hover:text-white hover:scale-110 transition"
                      >

                        {skill}

                      </span>

                    )
                  )}

                </div>

              </div>


              {/* Missing Skills */}

              <div className="bg-white rounded-2xl shadow-lg p-6">

                <h3 className="text-2xl font-bold text-red-700 mb-5">

                  ❌ Missing Skills

                </h3>


                <div className="flex flex-wrap gap-3">

                  {result.missing_skills?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-full shadow hover:bg-red-600 hover:text-white hover:scale-110 transition"
                      >

                        {skill}

                      </span>

                    )
                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                REQUIRED SKILLS
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

              <h3 className="text-2xl font-bold text-blue-700 mb-5">

                💼 Required Job Skills

              </h3>


              <div className="flex flex-wrap gap-3">

                {result.job_skills?.map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full shadow hover:bg-blue-600 hover:text-white hover:scale-110 transition"
                    >

                      {skill}

                    </span>

                  )
                )}

              </div>

            </div>


            {/* ==================================================
                AI RECOMMENDATIONS
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 mb-10">

              <h3 className="text-3xl font-bold text-blue-700 mb-6">

                💡 AI Recommendations

              </h3>


              <div className="space-y-4">

                {result.recommendations?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg hover:bg-blue-100 transition"
                    >

                      {item}

                    </div>

                  )
                )}

              </div>

            </div>

          </>

        )}

      </div>

    </div>

  );
}

export default ATSAnalysis;