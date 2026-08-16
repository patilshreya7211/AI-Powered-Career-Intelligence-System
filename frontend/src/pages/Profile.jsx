import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    role: user?.role || "Student",
    phone: "",
    dob: "",
    gender: "",
    location: "",
    // Degree
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    // HSC
    hsc_college: "",
    hsc_board: "",
    hsc_year: "",
    hsc_percentage: "",
    // SSC
    ssc_school: "",
    ssc_board: "",
    ssc_year: "",
    ssc_percentage: "",
    // Links
    github: "",
    linkedin: "",
    portfolio: "",
    // Other
    skills: "",
    bio: "",
    education: "",
    projects: "",
    certifications: "",
    photo: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    const res = await API.get(`/profile/${user.id}`);

    setProfile((prev) => ({
      ...prev,
      ...res.data,
    }));
  } catch (err) {
    console.log("Profile not found");
  }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoto = (e) => {
    if (e.target.files.length > 0) {
      setProfile({
        ...profile,
        photo: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // ==============================
  // Required Field Validation
  // ==============================
  const validateProfile = () => {
    const requiredFields = [
      { key: "full_name", label: "Full Name" },
      { key: "phone", label: "Phone Number" },
      { key: "dob", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
      { key: "location", label: "Location" },
      { key: "college", label: "College Name" },
      { key: "degree", label: "Degree" },
      { key: "branch", label: "Branch" },
      { key: "year", label: "Current Year" },
      { key: "cgpa", label: "CGPA" },
      { key: "hsc_college", label: "HSC College" },
      { key: "hsc_board", label: "HSC Board" },
      { key: "hsc_year", label: "HSC Passing Year" },
      { key: "hsc_percentage", label: "HSC Percentage" },
      { key: "ssc_school", label: "SSC School" },
      { key: "ssc_board", label: "SSC Board" },
      { key: "ssc_year", label: "SSC Passing Year" },
      { key: "ssc_percentage", label: "SSC Percentage" },
      { key: "skills", label: "Skills" },
      { key: "projects", label: "Projects" },
    ];

    for (const field of requiredFields) {
      if (
        !profile[field.key] ||
        profile[field.key].toString().trim() === ""
      ) {
        alert(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateProfile()) {
      return;
    }
    try {
      await API.put(
        `/profile/update/${user.id}`,
       profile
      );
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const fields = Object.values(profile);
  const completed = fields.filter(
    (field) => field !== "" && field !== null
  ).length;
  const completion = Math.round((completed / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center h-fit">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-100 flex items-center justify-center">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Photo</span>
                )}
              </div>
              <label className="mt-4 cursor-pointer text-blue-700 font-semibold text-sm hover:underline">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="text-xl font-bold mt-6">
              {profile.full_name || "Your Name"}
            </h3>
            <p className="text-gray-500 text-sm">{profile.role}</p>

            <div className="mt-6 text-left">
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
            >
              Logout
            </button>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-8">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 mt-2"
                  placeholder="Enter Full Name"
                />
              </div>
              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full border rounded-lg p-3 mt-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="font-semibold">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 mt-2"
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="font-semibold">
                  Date of Birth <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 mt-2"
                />
              </div>
              <div>
                <label className="font-semibold">
                  Gender <span className="text-red-600">*</span>
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 mt-2"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 mt-2"
                  placeholder="Kolhapur, Maharashtra"
                />
              </div>
            </div>

            {/* Higher Education */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🎓 Higher Education
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">
                    College Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Enter College Name"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Degree <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={profile.degree}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="B.Tech / B.E / BCA"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Branch <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={profile.branch}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Artificial Intelligence & Machine Learning"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Current Year <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="year"
                    value={profile.year}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold">
                    CGPA <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={profile.cgpa}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Enter CGPA"
                  />
                </div>
              </div>
            </div>

            {/* HSC Details */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🏫 Higher Secondary (HSC)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">
                    College Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="hsc_college"
                    value={profile.hsc_college}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Enter HSC College Name"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Board <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="hsc_board"
                    value={profile.hsc_board}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Maharashtra State Board / CBSE / ICSE"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Passing Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="hsc_year"
                    value={profile.hsc_year}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2100"
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="2023"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Percentage (%) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="hsc_percentage"
                    value={profile.hsc_percentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="85.50"
                  />
                </div>
              </div>
            </div>

            {/* SSC Details */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🏫 Secondary School (SSC)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">
                    School Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="ssc_school"
                    value={profile.ssc_school}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Enter School Name"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Board <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="ssc_board"
                    value={profile.ssc_board}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="Maharashtra State Board / CBSE / ICSE"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Passing Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="ssc_year"
                    value={profile.ssc_year}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2100"
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="2021"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Percentage (%) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="ssc_percentage"
                    value={profile.ssc_percentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full border rounded-lg p-3 mt-2"
                    placeholder="92.50"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🌐 Professional Links
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* GitHub */}
                <div>
                  <label className="font-semibold">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username"
                  />
                </div>
                {/* LinkedIn */}
                <div>
                  <label className="font-semibold">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                {/* Portfolio */}
                <div className="md:col-span-2">
                  <label className="font-semibold">Portfolio Website</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="mt-10">
              <label className="font-semibold text-lg">About Me</label>
              <textarea
                rows="5"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Write a short introduction about yourself..."
              />
            </div>

            {/* Skills */}
            <div className="mt-10">
              <label className="font-semibold text-lg">
                Skills <span className="text-red-600">*</span>
              </label>
              <textarea
                rows="4"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Java, Python, React, FastAPI, SQL, Machine Learning"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple skills using commas.
              </p>
            </div>

            {/* Projects */}
            <div className="mt-10">
              <label className="font-semibold text-lg">
                Projects <span className="text-red-600">*</span>
              </label>
              <textarea
                rows="5"
                name="projects"
                value={profile.projects}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Mention your important academic or personal projects."
              />
            </div>

            {/* Certifications */}
            <div className="mt-10">
              <label className="font-semibold text-lg">Certifications</label>
              <textarea
                rows="4"
                name="certifications"
                value={profile.certifications}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Example: NPTEL DBMS, AWS Cloud Practitioner, Infosys Springboard AI..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-10 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                ← Back to Dashboard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;