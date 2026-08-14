import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prevent multiple requests
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      console.log("=================================");
      console.log("LOGIN REQUEST");
      console.log("Email:", formData.email);
      console.log("=================================");

      // ==========================================
      // CALL FASTAPI LOGIN API
      // ==========================================

      const response = await API.post(
        "/auth/login",
        formData
      );

      console.log("Login Response:", response.data);

      // ==========================================
      // GET USER FROM RESPONSE
      // ==========================================

      const user = response.data?.user;

      // Your backend may return role in either:
      // response.data.role
      // OR
      // response.data.user.role

      const role =
        response.data?.role ||
        user?.role ||
        "User";

      // ==========================================
      // CHECK USER
      // ==========================================

      if (!user) {
        alert(
          "Invalid login response from server."
        );

        return;
      }

      console.log("Logged-in User:", user);
      console.log("User Role:", role);

      // ==========================================
      // SAVE USER INFORMATION
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Save role separately
      localStorage.setItem(
        "role",
        role
      );

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      alert("Login Successful!");

      // ==========================================
      // ROLE-BASED REDIRECTION
      // ==========================================

      if (
        role.toLowerCase() === "admin"
      ) {
        // ========================================
        // ADMIN
        // ========================================

        console.log(
          "Admin login detected."
        );

        navigate("/admin-dashboard");

      } else {

        // ========================================
        // NORMAL USER
        // ========================================

        console.log(
          "Normal user login detected."
        );

        navigate("/dashboard");
      }

    } catch (error) {

      // ==========================================
      // LOGIN ERROR
      // ==========================================

      console.error(
        "Login Error:",
        error
      );

      // ==========================================
      // BACKEND RESPONSE ERROR
      // ==========================================

      if (error.response) {

        console.error(
          "Backend Error:",
          error.response.data
        );

        const status =
          error.response.status;

        const detail =
          error.response.data?.detail;

        // ----------------------------------------
        // Error message from backend
        // ----------------------------------------

        if (detail) {

          alert(detail);

        } else if (status === 401) {

          alert(
            "Invalid email or password."
          );

        } else if (status === 404) {

          alert(
            "User not found."
          );

        } else if (status === 422) {

          alert(
            "Please enter a valid email and password."
          );

        } else if (status >= 500) {

          alert(
            "Server error. Please try again later."
          );

        } else {

          alert(
            "Login failed. Please try again."
          );
        }

      // ==========================================
      // REQUEST WAS SENT BUT NO RESPONSE
      // ==========================================

      } else if (error.request) {

        alert(
          "Unable to connect to backend. " +
          "Please make sure FastAPI is running on port 8000."
        );

      // ==========================================
      // OTHER ERROR
      // ==========================================

      } else {

        alert(
          "Something went wrong. Please try again."
        );
      }

    } finally {

      // Always stop loading
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* ========================================
          LOGIN CARD
      ======================================== */}

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* ======================================
            TITLE
        ====================================== */}

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          AI Career Intelligence System
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Login
        </h2>

        {/* ======================================
            LOGIN FORM
        ====================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* ====================================
              EMAIL
          ==================================== */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />

          </div>

          {/* ====================================
              PASSWORD
          ==================================== */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />

          </div>

          {/* ====================================
              LOGIN BUTTON
          ==================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

          {/* ====================================
              REGISTER LINK
          ==================================== */}

          <p className="text-center text-gray-600">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>

          </p>

        </form>

        {/* ======================================
            ADMIN INFORMATION
        ====================================== */}

        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">

          <p className="text-sm text-blue-700 text-center">
            Admin users are automatically redirected
            to the Admin Dashboard.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;