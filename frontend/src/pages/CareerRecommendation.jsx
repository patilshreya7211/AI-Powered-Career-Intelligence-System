import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Brain,
  Briefcase,
  IndianRupee,
  TrendingUp,
  Building2,
  BookOpen,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

function CareerRecommendation() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    try {
      const response = await API.get(`/career/${user.id}`);
      setCareer(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load Career Recommendation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-2xl font-bold text-blue-700">
          AI is preparing your Career Report...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-8 py-5 shadow-xl flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            AI Career Intelligence
          </h1>

          <p className="text-blue-100 text-sm mt-1">
            Personalized Career Recommendation Report
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Hero Section */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-xl text-white p-8 mb-8">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-4xl font-bold">
                {career.career}
              </h2>

              <p className="text-blue-100 mt-3 text-lg">
                Based on your profile, resume and technical skills
              </p>

            </div>

            <Brain size={70} />

          </div>

        </div>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Career */}

          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-2 transition duration-300">

            <Briefcase
              size={36}
              className="text-blue-600 mb-3"
            />

            <h3 className="text-lg font-semibold text-gray-500">
              Recommended Career
            </h3>

            <h2 className="text-2xl font-bold text-blue-700 mt-2">
              {career.career}
            </h2>

          </div>

          {/* Salary */}

          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-2 transition duration-300">

            <IndianRupee
              size={36}
              className="text-green-600 mb-3"
            />

            <h3 className="text-lg font-semibold text-gray-500">
              Expected Salary
            </h3>

            <h2 className="text-2xl font-bold text-green-700 mt-2">
              {career.salary}
            </h2>

          </div>

          {/* Match Score */}

          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-2 transition duration-300">

            <Sparkles
              size={36}
              className="text-yellow-500 mb-3"
            />

            <h3 className="text-lg font-semibold text-gray-500">
              AI Match Score
            </h3>

            <h2 className="text-4xl font-bold text-yellow-600 mt-2">
              92%
            </h2>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-5">

              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>

            </div>

          </div>

        </div>

        {/* ================= Career Overview ================= */}

        <div className="bg-white rounded-2xl p-7 shadow-lg mt-8 hover:shadow-xl transition duration-300">

          <div className="flex items-center gap-3 mb-5">

            <TrendingUp
              size={34}
              className="text-blue-700"
            />

            <h2 className="text-2xl font-bold text-blue-700">
              Career Overview
            </h2>

          </div>

          <p className="text-gray-700 leading-8 text-[17px]">

            Based on your profile, education, technical skills and resume,
            our AI recommends pursuing a career as a

            <span className="font-bold text-blue-700">
              {" "}{career.career}
            </span>.

            This role matches your current profile and provides excellent
            opportunities in today's job market. Continue improving your
            technical skills, build real-world projects, earn industry
            certifications, and practice coding regularly to become placement
            ready.

          </p>

        </div>

        {/* ================= Roadmap + Companies ================= */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Career Roadmap */}

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">

            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Career Roadmap
            </h2>

            <div className="space-y-4">

              {career.roadmap.map((step, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition"
                >

                  <div
                    className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold"
                  >
                    {index + 1}
                  </div>

                  <p className="font-semibold text-gray-700">
                    {step}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Top Companies */}

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">

            <div className="flex items-center gap-3 mb-6">

              <Building2
                size={34}
                className="text-green-700"
              />

              <h2 className="text-2xl font-bold text-green-700">
                Top Hiring Companies
              </h2>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {career.companies.map((company, index) => (

                <div
                  key={index}
                  className="bg-green-50 rounded-xl py-4 px-3 text-center font-semibold hover:bg-green-100 hover:scale-105 transition"
                >
                  {company}
                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ================= Recommended Courses ================= */}

        <div className="bg-white rounded-2xl p-6 shadow-lg mt-8 hover:shadow-xl transition duration-300">

          <div className="flex items-center gap-3 mb-6">

            <BookOpen
              size={34}
              className="text-orange-600"
            />

            <h2 className="text-2xl font-bold text-orange-600">
              Recommended Courses
            </h2>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {career.courses.map((course, index) => (

              <div
                key={index}
                className="bg-orange-50 rounded-xl p-4 text-center font-semibold hover:bg-orange-100 hover:scale-105 transition duration-300"
              >
                {course}
              </div>

            ))}

          </div>

        </div>

        {/* ================= AI Career Tips ================= */}

        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl text-white p-8 mt-8 shadow-xl">

          <h2 className="text-3xl font-bold mb-6">
            AI Career Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-white/10 rounded-xl p-5">
              ✅ Build at least <b>5-10 real-world projects</b>.
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              🚀 Practice <b>DSA daily</b> for placements.
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              📜 Complete industry-recognized certifications.
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              💼 Maintain an updated GitHub portfolio.
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              🤖 Learn AI tools and current industry trends.
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              🎯 Solve interview questions regularly.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CareerRecommendation;