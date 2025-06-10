import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BACKEND_URL } from "../utils/utlis";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch course details for display
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCourse(res.data.course);
      } catch (err) {
        setError("Failed to load course details.");
      }
    };
    fetchCourse();
  }, [courseId, token, navigate]);

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Purchase successful!");
      navigate("/purchases");
    } catch (err) {
      if (err?.response?.status === 400) {
        setError("You have already purchased this course");
        navigate("/purchases");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.errors ||
            "Something went wrong"
        );
      }
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">{error}</p>
          <Link
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
            to={"/purchases"}
          >
            Purchases
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950">
        <div className="text-lg text-gray-200">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row my-24 container mx-auto bg-gradient-to-br from-blue-900 via-black to-blue-950 rounded-2xl shadow-2xl p-8">
      {/* Left Side: User Info & Order Details */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center mb-8 md:mb-0">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-blue-800">
          {/* Logo and User Name */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 rounded-full mb-2 shadow-lg border-2 border-orange-400" />
            <span className="block text-lg text-gray-200 mb-1">Welcome,</span>
            <span className="text-2xl font-bold text-orange-400 drop-shadow">
              {user?.user?.firstName
                ? user.user.firstName
                : user?.user?.email || "User"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold underline text-white mb-4 tracking-wide">Order Details</h1>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300 text-sm">Course name:</span>
              <span className="text-orange-300 font-bold">{course.title ? course.title : "N/A"}</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300 text-sm">Total Price:</span>
              <span className="text-green-400 font-bold">
                ₹{course.price ? course.price : "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <img
              src={course.image?.url || "/logo.png"}
              alt={course.title}
              className="w-40 h-40 object-cover rounded-lg mx-auto shadow-lg border-4 border-blue-900 bg-white/20"
            />
          </div>
        </div>
      </div>
      {/* Right Side: Payment */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-md border border-blue-800">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center tracking-wide">
            Process your Payment!
          </h2>
          <form onSubmit={handleBuy}>
            <div className="mb-6">
              <label className="block text-gray-200 text-sm mb-2">
                Payment Method
              </label>
              <select
                className="w-full p-2 border rounded bg-gray-900 text-gray-200"
                defaultValue="upi"
                disabled
              >
                <option value="upi">UPI (Simulated)</option>
                <option value="cod" disabled>
                  Cash on Delivery (Not available)
                </option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-white hover:text-orange-700 hover:scale-105 transition duration-300"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link
              to="/courses"
              className="text-blue-300 hover:underline hover:text-orange-400 transition"
            >
              &larr; Back to Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buy;