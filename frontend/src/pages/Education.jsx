import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Education() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/profile/${user.id}`
      );

      setEducation(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load education details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading Education...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-blue-700 text-white p-5 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Education Details
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-5">

        {/* Degree */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎓 Degree Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold">College Name</p>
              <p>{education.college || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Degree</p>
              <p>{education.degree || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Branch</p>
              <p>{education.branch || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Current Year</p>
              <p>{education.year || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">CGPA</p>
              <p className="text-green-600 font-bold">
                {education.cgpa || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* HSC */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🏫 Higher Secondary (HSC)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold">College</p>
              <p>{education.hsc_college || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Board</p>
              <p>{education.hsc_board || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Passing Year</p>
              <p>{education.hsc_year || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Percentage</p>
              <p className="text-green-600 font-bold">
                {education.hsc_percentage || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* SSC */}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🏫 Secondary School (SSC)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="font-semibold">School</p>
              <p>{education.ssc_school || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Board</p>
              <p>{education.ssc_board || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Passing Year</p>
              <p>{education.ssc_year || "-"}</p>
            </div>

            <div>
              <p className="font-semibold">Percentage</p>
              <p className="text-green-600 font-bold">
                {education.ssc_percentage || "-"}
              </p>
            </div>

          </div>

        </div>

        <div className="flex justify-end">

          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Edit Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default Education;