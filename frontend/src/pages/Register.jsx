import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Register button clicked");
    console.log("Sending Data:", formData);

    try {
      const response = await API.post("/auth/register", formData);

      console.log("Success:", response.data);

      alert("Registration Successful!");

      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "Student",
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail || "Registration Failed");
      } else if (error.request) {
        alert("Cannot connect to backend.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          AI Career Intelligence System
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form
          onSubmit={(e) => {
            alert("FORM SUBMITTED");
            handleRegister(e);
          }}
          className="space-y-4"
        >

          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="Student">Student</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold"
            >
              Login
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;