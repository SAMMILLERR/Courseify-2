import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utlis";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch only courses created by this admin using /admin/my-courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const admin = JSON.parse(localStorage.getItem("admin"));
        const token = admin?.token;
        if (!token) return;

        const response = await axios.get(
          `${BACKEND_URL}/admin/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to fetch your courses");
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-black to-blue-950">
        <span className="text-white text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950 py-10 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
          <h1 className="text-4xl font-bold text-orange-400 drop-shadow mb-6 md:mb-0 text-center md:text-left">
            My Courses
          </h1>
          <Link
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 text-white py-3 px-6 rounded-lg font-bold shadow-lg transition duration-300"
            to={"/admin/dashboard"}
          >
            Go to Dashboard
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/10 backdrop-blur-md border border-blue-800 rounded-2xl shadow-xl p-6 flex flex-col hover:scale-105 transition-transform duration-300"
            >
              {/* Course Image */}
              <img
                src={course?.image?.url || "/imgPL.webp"}
                alt={course.title}
                className="h-48 w-full object-cover rounded-xl border-2 border-blue-900 bg-white/20 shadow mb-4"
              />
              {/* Course Title */}
              <h2 className="text-2xl font-bold text-blue-200 mb-2">{course.title}</h2>
              {/* Course Description */}
              <p className="text-gray-200 mb-4 text-sm">
                {course.description.length > 200
                  ? `${course.description.slice(0, 200)}...`
                  : course.description}
              </p>
              {/* Course Price */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-xl text-orange-400">
                  ₹{course.price}
                  <span className="text-gray-400 text-base line-through ml-2">
                    ₹{Math.round(course.price * 1.2)}
                  </span>
                </span>
                <span className="text-green-400 font-semibold bg-green-900/30 px-2 py-1 rounded">
                  {course.price
                    ? `${Math.round(100 - (course.price / (course.price * 1.2)) * 100)}% off`
                    : "20% off"}
                </span>
              </div>
              <div className="flex justify-between gap-2 mt-auto">
                <Link
                  to={`/admin/update-course/${course._id}`}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 text-white py-2 px-5 rounded-lg font-semibold shadow transition duration-300"
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-gradient-to-r from-red-600 to-red-400 hover:from-red-800 hover:to-red-600 text-white py-2 px-5 rounded-lg font-semibold shadow transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {courses.length === 0 && (
          <div className="text-center text-gray-200 text-xl mt-20">
            No courses found.
          </div>
        )}
      </div>
    </div>
  );
}

export default OurCourses;