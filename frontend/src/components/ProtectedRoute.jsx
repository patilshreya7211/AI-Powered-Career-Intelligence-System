import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // Get logged-in user
  const userData = localStorage.getItem("user");

  // ==========================================
  // USER NOT LOGGED IN
  // ==========================================

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // PARSE USER DATA
  // ==========================================

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // GET USER ROLE
  // ==========================================

  const role = (
    user?.role ||
    localStorage.getItem("role") ||
    ""
  ).toLowerCase();

  // ==========================================
  // ROLE NOT AVAILABLE
  // ==========================================

  if (!role) {
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // CHECK ALLOWED ROLES
  // ==========================================

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map((allowedRole) =>
      allowedRole.toLowerCase()
    );

    // User does not have permission
    if (!normalizedAllowedRoles.includes(role)) {

      // ========================================
      // ADMIN → ADMIN DASHBOARD
      // ========================================

      if (role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }

      // ========================================
      // STUDENT / JOB SEEKER → USER DASHBOARD
      // ========================================

      return <Navigate to="/dashboard" replace />;
    }
  }

  // ==========================================
  // USER IS AUTHORIZED
  // ==========================================

  return children;
}

export default ProtectedRoute;