import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utlis";

function Dashboard() {
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950">
      {/* Sidebar */}
      <aside className="w-72 bg-white/10 backdrop-blur-md border-r border-blue-800 p-8 flex flex-col items-center shadow-2xl">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border-2 border-orange-400 mb-4" />
        <h2 className="text-2xl font-bold text-orange-400 mb-8 drop-shadow">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-5 w-full">
          <Link to="/admin/our-courses">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 rounded-lg font-semibold shadow transition">
              My Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 text-white py-3 rounded-lg font-semibold shadow transition">
              Create Course
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white py-3 rounded-lg font-semibold shadow transition"
            >
              Logout
            </button>
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800 p-16 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-orange-400 mb-4 drop-shadow">Welcome, Admin!</h1>
          <p className="text-lg text-gray-200 mb-2 text-center">
            Manage your courses and platform from this dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;