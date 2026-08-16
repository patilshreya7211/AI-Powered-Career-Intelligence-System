import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Education() {
  const navigate = useNavigate();

  // ============================================================
  // GET LOGGED-IN USER
  // ============================================================

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ============================================================
  // EDUCATION STATE
  // ============================================================

  const [education, setEducation] = useState({
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",

    hsc_college: "",
    hsc_board: "",
    hsc_year: "",
    hsc_percentage: "",

    ssc_school: "",
    ssc_board: "",
    ssc_year: "",
    ssc_percentage: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH EDUCATION
  // ============================================================

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------------------------------
      // Check login
      // --------------------------------------------------------

      if (!user) {
        setError(
          "User session not found. Please login again."
        );
        return;
      }

      // --------------------------------------------------------
      // Get user ID safely
      // --------------------------------------------------------

      const userId =
        user.id ||
        user.user_id ||
        user.userId;

      console.log(
        "Education User ID:",
        userId
      );

      if (!userId) {
        setError(
          "User ID not found. Please login again."
        );
        return;
      }

      // --------------------------------------------------------
      // Call deployed backend through shared API
      // --------------------------------------------------------

      const response = await API.get(
        `/profile/${userId}`
      );

      console.log(
        "Education API Response:",
        response.data
      );

      // --------------------------------------------------------
      // Save response
      // --------------------------------------------------------

      setEducation({
        college: response.data?.college || "",
        degree: response.data?.degree || "",
        branch: response.data?.branch || "",
        year: response.data?.year || "",
        cgpa: response.data?.cgpa || "",

        hsc_college:
          response.data?.hsc_college || "",

        hsc_board:
          response.data?.hsc_board || "",

        hsc_year:
          response.data?.hsc_year || "",

        hsc_percentage:
          response.data?.hsc_percentage || "",

        ssc_school:
          response.data?.ssc_school || "",

        ssc_board:
          response.data?.ssc_board || "",

        ssc_year:
          response.data?.ssc_year || "",

        ssc_percentage:
          response.data?.ssc_percentage || "",
      });

    } catch (err) {
      console.error(
        "Education Loading Error:",
        err
      );

      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Backend Response:",
          err.response.data
        );

        setError(
          err.response.data?.detail ||
          "Unable to load education details."
        );

      } else if (err.request) {

        setError(
          "Unable to connect to the backend server."
        );

      } else {

        setError(
          "Unable to load education details."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-5"></div>

          <h1 className="text-2xl font-bold text-blue-700">
            Loading Education...
          </h1>

          <p className="text-gray-500 mt-2">
            Fetching your education details
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-6">

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Education Error
          </h1>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <div className="flex justify-center gap-3">

            <button
              onClick={fetchEducation}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
            >
              Dashboard
            </button>

          </div>

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

      <div className="bg-blue-700 text-white p-5 shadow-lg flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Education Details
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Back
        </button>

      </div>

      <div className="max-w-6xl mx-auto py-10 px-5">

        {/* ====================================================
            DEGREE INFORMATION
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎓 Degree Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold text-gray-700">
                College Name
              </p>

              <p className="mt-1">
                {education.college || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Degree
              </p>

              <p className="mt-1">
                {education.degree || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Branch
              </p>

              <p className="mt-1">
                {education.branch || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Current Year
              </p>

              <p className="mt-1">
                {education.year || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                CGPA
              </p>

              <p className="text-green-600 font-bold mt-1">
                {education.cgpa || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* ====================================================
            HSC
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🏫 Higher Secondary (HSC)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold text-gray-700">
                College
              </p>

              <p className="mt-1">
                {education.hsc_college || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Board
              </p>

              <p className="mt-1">
                {education.hsc_board || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Passing Year
              </p>

              <p className="mt-1">
                {education.hsc_year || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Percentage
              </p>

              <p className="text-green-600 font-bold mt-1">
                {education.hsc_percentage || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* ====================================================
            SSC
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🏫 Secondary School (SSC)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold text-gray-700">
                School
              </p>

              <p className="mt-1">
                {education.ssc_school || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Board
              </p>

              <p className="mt-1">
                {education.ssc_board || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Passing Year
              </p>

              <p className="mt-1">
                {education.ssc_year || "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-700">
                Percentage
              </p>

              <p className="text-green-600 font-bold mt-1">
                {education.ssc_percentage || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* ====================================================
            ACTION
        ==================================================== */}

        <div className="flex justify-end">

          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Edit Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default Education;