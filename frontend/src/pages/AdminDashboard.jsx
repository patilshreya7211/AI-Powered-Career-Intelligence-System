import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [admin, setAdmin] = useState(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);

  const [status, setStatus] = useState("Checking...");

  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalJobSeekers, setTotalJobSeekers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // USER MANAGEMENT
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ============================================================
  // SELECTED USER
  // ============================================================

  const [selectedUser, setSelectedUser] = useState(null);

  // ============================================================
  // DELETE LOADING
  // ============================================================

  const [deletingUserId, setDeletingUserId] = useState(null);

  // ============================================================
  // STATUS UPDATE LOADING
  // ============================================================

  const [updatingStatusUserId, setUpdatingStatusUserId] = useState(null);

  // ============================================================
  // LOAD ADMIN DASHBOARD
  // ============================================================

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  // ============================================================
  // FETCH ADMIN DASHBOARD
  // ============================================================

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // ----------------------------------------------------------
      // Get logged-in user
      // ----------------------------------------------------------

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      let loggedInUser;

      try {
        loggedInUser = JSON.parse(storedUser);
      } catch (parseError) {
        console.error("Invalid user data:", parseError);

        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
        return;
      }

      // ----------------------------------------------------------
      // Check admin role
      // ----------------------------------------------------------

      if (
        !loggedInUser.role ||
        loggedInUser.role.toLowerCase() !== "admin"
      ) {
        navigate("/dashboard");
        return;
      }

      // ----------------------------------------------------------
      // Save admin information
      // ----------------------------------------------------------

      setAdmin(loggedInUser);

      const userId = loggedInUser.id;

      // ----------------------------------------------------------
      // Get admin status
      // ----------------------------------------------------------

      const statusResponse = await API.get(
        `/admin/status?user_id=${userId}`
      );

      setStatus(
        statusResponse.data.status ||
          "Running Successfully"
      );

      setTotalUsers(
        statusResponse.data.total_users || 0
      );

      // ----------------------------------------------------------
      // Get all users
      // ----------------------------------------------------------

      const usersResponse = await API.get(
        `/admin/users?user_id=${userId}`
      );

      const userList = usersResponse.data.users || [];

      setUsers(userList);

      // ----------------------------------------------------------
      // Calculate active/inactive users
      // ----------------------------------------------------------

      const activeCount = userList.filter(
        (user) => user.is_active
      ).length;

      const inactiveCount = userList.filter(
        (user) => !user.is_active
      ).length;

      setActiveUsers(activeCount);
      setInactiveUsers(inactiveCount);

      // ----------------------------------------------------------
      // Calculate role counts
      // ----------------------------------------------------------

      const students = userList.filter(
        (user) =>
          user.role?.toLowerCase() === "student"
      ).length;

      const jobSeekers = userList.filter(
        (user) =>
          user.role?.toLowerCase() === "job seeker"
      ).length;

      const admins = userList.filter(
        (user) =>
          user.role?.toLowerCase() === "admin"
      ).length;

      setTotalStudents(students);
      setTotalJobSeekers(jobSeekers);
      setTotalAdmins(admins);
    } catch (error) {
      console.error(
        "Admin Dashboard Error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.detail ||
            "Unable to load admin dashboard."
        );
      } else {
        setError(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SEARCH + ROLE + STATUS FILTER
  // ============================================================

  const filteredUsers = users.filter((user) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    const matchesSearch =
      user.full_name
        ?.toLowerCase()
        .includes(search) ||
      user.email
        ?.toLowerCase()
        .includes(search);

    const matchesRole =
      roleFilter === "all" ||
      user.role?.toLowerCase() ===
        roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        user.is_active === true) ||
      (statusFilter === "inactive" &&
        user.is_active === false);

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    );
  });

  // ============================================================
  // VIEW USER DETAILS
  // ============================================================

  const handleViewUser = async (userId) => {
    try {
      if (!admin) {
        return;
      }

      const response = await API.get(
        `/admin/users/${userId}?user_id=${admin.id}`
      );

      setSelectedUser(
        response.data.user
      );
    } catch (error) {
      console.error(
        "Unable to get user details:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to load user details."
      );
    }
  };

  // ============================================================
  // ACTIVATE / DEACTIVATE USER
  // ============================================================

  const handleToggleUserStatus = async (
    userId,
    userName,
    currentStatus
  ) => {
    // ----------------------------------------------------------
    // Check admin
    // ----------------------------------------------------------

    if (!admin) {
      return;
    }

    // ----------------------------------------------------------
    // Prevent admin from changing own status
    // ----------------------------------------------------------

    if (admin.id === userId) {
      alert(
        "You cannot change your own admin account status."
      );

      return;
    }

    // ----------------------------------------------------------
    // New status
    // ----------------------------------------------------------

    const newStatus = !currentStatus;

    // ----------------------------------------------------------
    // Confirmation
    // ----------------------------------------------------------

    const action = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingStatusUserId(userId);

      // --------------------------------------------------------
      // Call backend
      // --------------------------------------------------------

      const response = await API.put(
        `/admin/users/${userId}/status`,
        null,
        {
          params: {
            user_id: admin.id,
            is_active: newStatus,
          },
        }
      );

      // --------------------------------------------------------
      // Update user in local state
      // --------------------------------------------------------

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active: newStatus,
              }
            : user
        )
      );

      // --------------------------------------------------------
      // Update selected user if open
      // --------------------------------------------------------

      if (
        selectedUser &&
        selectedUser.id === userId
      ) {
        setSelectedUser({
          ...selectedUser,
          is_active: newStatus,
        });
      }

      // --------------------------------------------------------
      // Update active/inactive counts
      // --------------------------------------------------------

      if (newStatus) {
        setActiveUsers(
          (previous) => previous + 1
        );

        setInactiveUsers(
          (previous) =>
            Math.max(previous - 1, 0)
        );
      } else {
        setActiveUsers(
          (previous) =>
            Math.max(previous - 1, 0)
        );

        setInactiveUsers(
          (previous) => previous + 1
        );
      }

      alert(
        response.data?.message ||
          `User ${action}d successfully.`
      );
    } catch (error) {
      console.error(
        "Update User Status Error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          `Unable to ${action} user.`
      );
    } finally {
      setUpdatingStatusUserId(null);
    }
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    // ----------------------------------------------------------
    // Prevent admin from deleting themselves
    // ----------------------------------------------------------

    if (admin?.id === userId) {
      alert(
        "You cannot delete your own admin account."
      );

      return;
    }

    // ----------------------------------------------------------
    // Confirmation
    // ----------------------------------------------------------

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(userId);

      // --------------------------------------------------------
      // Delete user
      // --------------------------------------------------------

      await API.delete(
        `/admin/users/${userId}?user_id=${admin.id}`
      );

      // --------------------------------------------------------
      // Find deleted user
      // --------------------------------------------------------

      const deletedUser = users.find(
        (user) => user.id === userId
      );

      // --------------------------------------------------------
      // Remove user from list
      // --------------------------------------------------------

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      // --------------------------------------------------------
      // Update total count
      // --------------------------------------------------------

      setTotalUsers(
        (previousTotal) =>
          Math.max(previousTotal - 1, 0)
      );

      // --------------------------------------------------------
      // Update active/inactive counts
      // --------------------------------------------------------

      if (deletedUser?.is_active) {
        setActiveUsers(
          (previous) =>
            Math.max(previous - 1, 0)
        );
      } else {
        setInactiveUsers(
          (previous) =>
            Math.max(previous - 1, 0)
        );
      }

      // --------------------------------------------------------
      // Close selected user
      // --------------------------------------------------------

      if (
        selectedUser?.id === userId
      ) {
        setSelectedUser(null);
      }

      alert(
        "User deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to delete user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-xl font-semibold text-blue-600">
            Loading Admin Dashboard...
          </div>

          <p className="text-gray-500 mt-2">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Unable to Load Dashboard
          </h2>

          <p className="text-gray-700 mb-6">
            {error}
          </p>

          <button
            onClick={fetchAdminDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              AI Career Intelligence System
            </h1>

            <p className="text-blue-100 text-sm">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ====================================================
            ADMIN INFORMATION
        ==================================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome, {admin?.full_name}
              </h2>

              <p className="text-gray-500 mt-1">
                Manage users and monitor the application.
              </p>
            </div>

            <div className="mt-4 md:mt-0">

              <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Admin Active
              </span>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Admin Name
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {admin?.full_name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {admin?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Role
              </p>

              <p className="font-semibold text-blue-600 mt-1">
                {admin?.role}
              </p>
            </div>

          </div>
        </div>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Application Status */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Application Status
            </p>

            <h3 className="text-2xl font-bold text-green-600 mt-2">
              ● Running
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {status}
            </p>

          </div>

          {/* Total Users */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Total Users
            </p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {totalUsers}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Registered users
            </p>

          </div>

          {/* Active Users */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Active Users
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {activeUsers}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Currently active accounts
            </p>

          </div>

        </div>

        {/* ====================================================
            SECOND STATISTICS ROW
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Inactive Users */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Inactive Users
            </p>

            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {inactiveUsers}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Deactivated accounts
            </p>

          </div>

          {/* Students */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Students
            </p>

            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {totalStudents}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Student accounts
            </p>

          </div>

          {/* Job Seekers */}

          <div className="bg-white rounded-xl shadow p-6">

            <p className="text-gray-500">
              Job Seekers
            </p>

            <h3 className="text-3xl font-bold text-orange-600 mt-2">
              {totalJobSeekers}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Job seeker accounts
            </p>

          </div>

        </div>

        {/* ====================================================
            USER MANAGEMENT
        ==================================================== */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* Header */}

          <div className="p-6 border-b">

            <h2 className="text-xl font-bold text-gray-800">
              User Management
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Search, view, activate, deactivate and delete users.
            </p>

          </div>

          {/* ==================================================
              SEARCH AND FILTER
          ================================================== */}

          <div className="p-6 bg-gray-50 border-b">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Search */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Users
                </label>

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Role Filter */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Role
                </label>

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="all">
                    All Roles
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                  <option value="student">
                    Student
                  </option>

                  <option value="job seeker">
                    Job Seeker
                  </option>

                </select>

              </div>

              {/* Status Filter */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

            {/* Result Count */}

            <div className="flex flex-wrap gap-4 mt-4 text-sm">

              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {users.length}
                </span>{" "}
                users
              </p>

              <p className="text-green-600 font-medium">
                Active: {activeUsers}
              </p>

              <p className="text-red-600 font-medium">
                Inactive: {inactiveUsers}
              </p>

            </div>

          </div>

          {/* ==================================================
              USER TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4">
                    ID
                  </th>

                  <th className="text-left px-6 py-4">
                    Name
                  </th>

                  <th className="text-left px-6 py-4">
                    Email
                  </th>

                  <th className="text-left px-6 py-4">
                    Role
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-left px-6 py-4">
                    Created At
                  </th>

                  <th className="text-left px-6 py-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* No users */}

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500"
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map((user) => {

                    const isAdmin =
                      user.role?.toLowerCase() ===
                      "admin";

                    const isUpdating =
                      updatingStatusUserId ===
                      user.id;

                    const isDeleting =
                      deletingUserId ===
                      user.id;

                    return (

                      <tr
                        key={user.id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* ID */}

                        <td className="px-6 py-4">
                          {user.id}
                        </td>

                        {/* Name */}

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {user.full_name}
                        </td>

                        {/* Email */}

                        <td className="px-6 py-4 text-gray-700">
                          {user.email}
                        </td>

                        {/* Role */}

                        <td className="px-6 py-4">

                          <span
                            className={
                              isAdmin
                                ? "px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                                : user.role?.toLowerCase() ===
                                  "job seeker"
                                ? "px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700"
                                : "px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                            }
                          >
                            {user.role}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          {user.is_active ? (

                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
                              ● Active
                            </span>

                          ) : (

                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 font-medium">
                              ● Inactive
                            </span>

                          )}

                        </td>

                        {/* Created At */}

                        <td className="px-6 py-4 text-sm text-gray-500">

                          {user.created_at
                            ? new Date(
                                user.created_at
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4">

                          <div className="flex flex-wrap gap-2">

                            {/* View */}

                            <button
                              onClick={() =>
                                handleViewUser(
                                  user.id
                                )
                              }
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 text-sm font-medium transition"
                            >
                              View
                            </button>

                            {/* Activate / Deactivate */}

                            {!isAdmin && (

                              <button
                                onClick={() =>
                                  handleToggleUserStatus(
                                    user.id,
                                    user.full_name,
                                    user.is_active
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  isDeleting
                                }
                                className={
                                  user.is_active
                                    ? "bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-medium transition"
                                    : "bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-medium transition"
                                }
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : user.is_active
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                            )}

                            {/* Delete */}

                            {!isAdmin && (

                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user.id,
                                    user.full_name
                                  )
                                }
                                disabled={
                                  isDeleting ||
                                  isUpdating
                                }
                                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-medium transition"
                              >
                                {isDeleting
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ====================================================
            USER DETAILS MODAL
        ==================================================== */}

        {selectedUser && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              {/* Modal Header */}

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold text-gray-800">
                  User Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>

              </div>

              {/* User Information */}

              <div className="space-y-4">

                <div>

                  <p className="text-sm text-gray-500">
                    User ID
                  </p>

                  <p className="font-semibold">
                    {selectedUser.id}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {selectedUser.full_name}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold break-all">
                    {selectedUser.email}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Role
                  </p>

                  <p className="font-semibold text-blue-600">
                    {selectedUser.role}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Account Status
                  </p>

                  {selectedUser.is_active ? (

                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
                      ● Active
                    </span>

                  ) : (

                    <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 font-medium">
                      ● Inactive
                    </span>

                  )}

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Created At
                  </p>

                  <p className="font-semibold">
                    {selectedUser.created_at
                      ? new Date(
                          selectedUser.created_at
                        ).toLocaleString()
                      : "-"}

                  </p>

                </div>

              </div>

              {/* Modal Status Button */}

              {selectedUser.id !== admin?.id &&
                selectedUser.role?.toLowerCase() !==
                  "admin" && (

                <button
                  onClick={() =>
                    handleToggleUserStatus(
                      selectedUser.id,
                      selectedUser.full_name,
                      selectedUser.is_active
                    )
                  }
                  disabled={
                    updatingStatusUserId ===
                    selectedUser.id
                  }
                  className={
                    selectedUser.is_active
                      ? "w-full mt-6 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 transition font-medium"
                      : "w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                  }
                >
                  {updatingStatusUserId ===
                  selectedUser.id
                    ? "Updating..."
                    : selectedUser.is_active
                    ? "Deactivate User"
                    : "Activate User"}
                </button>

              )}

              {/* Close */}

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;