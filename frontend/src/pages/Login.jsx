import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // HANDLE LOGIN
  // ============================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      console.log("=================================");
      console.log("LOGIN REQUEST");
      console.log("Email:", formData.email);
      console.log("=================================");

      // ========================================================
      // CALL FASTAPI LOGIN API
      // ========================================================

      const response = await API.post(
        "/auth/login",
        formData
      );

      console.log("Login Response:", response.data);

      // ========================================================
      // GET USER DATA
      // ========================================================

      const user = response.data?.user;

      if (!user) {
        alert("Invalid login response from server.");
        return;
      }

      // ========================================================
      // GET ROLE
      // ========================================================

      const role =
        response.data?.role ||
        user?.role ||
        "User";

      console.log("Logged-in User:", user);
      console.log("User Role:", role);

      // ========================================================
      // GET USER ID
      // ========================================================

      const userId =
        user?.id ||
        user?.user_id ||
        user?.userId ||
        response.data?.user_id ||
        response.data?.userId;

      console.log("Logged-in User ID:", userId);

      // ========================================================
      // IMPORTANT:
      // USER ID IS REQUIRED BY MANY BACKEND APIs
      // ========================================================

      if (!userId) {
        console.error(
          "User ID was not returned by the backend."
        );

        alert(
          "Login successful, but user ID was not returned by the server."
        );

        return;
      }

      // ========================================================
      // NORMALIZED USER OBJECT
      // ========================================================

      const normalizedUser = {
        ...user,
        id: userId,
        role: role,
      };

      // ========================================================
      // CLEAR OLD LOGIN DATA
      // ========================================================

      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");

      // ========================================================
      // SAVE NEW LOGIN DATA
      // ========================================================

      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      localStorage.setItem(
        "user_id",
        String(userId)
      );

      localStorage.setItem(
        "role",
        String(role)
      );

      // ========================================================
      // VERIFY LOCAL STORAGE
      // ========================================================

      console.log(
        "Saved user:",
        localStorage.getItem("user")
      );

      console.log(
        "Saved user_id:",
        localStorage.getItem("user_id")
      );

      console.log(
        "Saved role:",
        localStorage.getItem("role")
      );

      // ========================================================
      // LOGIN SUCCESS
      // ========================================================

      alert("Login Successful!");

      // ========================================================
      // ROLE-BASED REDIRECTION
      // ========================================================

      if (
        String(role).toLowerCase() === "admin"
      ) {
        console.log(
          "Admin login detected."
        );

        navigate("/admin-dashboard");

      } else {
        console.log(
          "Student / Job Seeker login detected."
        );

        navigate("/dashboard");
      }

    } catch (error) {
      // ========================================================
      // LOGIN ERROR
      // ========================================================

      console.error(
        "Login Error:",
        error
      );

      // ========================================================
      // BACKEND RESPONSE ERROR
      // ========================================================

      if (error.response) {
        console.error(
          "Backend Error:",
          error.response.data
        );

        const status =
          error.response.status;

        const detail =
          error.response.data?.detail;

        if (detail) {
          alert(detail);

        } else if (status === 400) {
          alert(
            "Invalid login request."
          );

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

      // ========================================================
      // REQUEST SENT BUT SERVER DID NOT RESPOND
      // ========================================================

      } else if (error.request) {

        alert(
          "Unable to connect to the backend. " +
          "Please check your internet connection or Render backend."
        );

      // ========================================================
      // OTHER ERROR
      // ========================================================

      } else {

        alert(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* ======================================================
          LOGIN CARD
      ====================================================== */}

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* ====================================================
            TITLE
        ==================================================== */}

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          AI Career Intelligence System
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Login
        </h2>

        {/* ====================================================
            LOGIN FORM
        ==================================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* ==================================================
              EMAIL
          ================================================== */}

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

          {/* ==================================================
              PASSWORD
          ================================================== */}

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

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* ==================================================
              REGISTER LINK
          ================================================== */}

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

        {/* ====================================================
            ADMIN INFORMATION
        ==================================================== */}

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