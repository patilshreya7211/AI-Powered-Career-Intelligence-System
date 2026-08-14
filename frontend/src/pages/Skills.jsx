import { useNavigate } from "react-router-dom";

function Skills() {
  const navigate = useNavigate();

  const skills = [
    { name: "Python", level: 90, category: "Programming" },
    { name: "Java", level: 80, category: "Programming" },
    { name: "Machine Learning", level: 75, category: "AI" },
    { name: "Deep Learning", level: 60, category: "AI" },
    { name: "React", level: 70, category: "Web Development" },
    { name: "SQL", level: 85, category: "Database" },
    { name: "Git", level: 80, category: "Tools" },
    { name: "FastAPI", level: 75, category: "Backend" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-700 text-white p-5 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold">
          My Skills
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-8">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h2 className="text-4xl font-bold text-blue-700">
              {skills.length}
            </h2>
            <p className="text-gray-500 mt-2">
              Total Skills
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h2 className="text-4xl font-bold text-green-600">
              4
            </h2>
            <p className="text-gray-500 mt-2">
              Skill Categories
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition">
            <h2 className="text-4xl font-bold text-purple-600">
              78%
            </h2>
            <p className="text-gray-500 mt-2">
              Average Skill Level
            </p>
          </div>

        </div>

        {/* Skills List */}
        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Skill Progress
          </h2>

          <div className="space-y-6">

            {skills.map((skill, index) => (

              <div
                key={index}
                className="p-5 rounded-xl border hover:shadow-xl transition"
              >

                <div className="flex justify-between mb-2">

                  <div>

                    <h3 className="font-bold text-lg">
                      {skill.name}
                    </h3>

                    <p className="text-gray-500">
                      {skill.category}
                    </p>

                  </div>

                  <span className="font-bold text-blue-700">
                    {skill.level}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Skills;