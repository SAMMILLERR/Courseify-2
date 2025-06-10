import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BACKEND_URL } from "../utils/utlis";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        // API returns { purchases: [ { courseId: {...}, ... } ] }
        const raw = response.data.purchases;
        // Map to array of course objects
        const courses = Array.isArray(raw)
          ? raw.map((item) => item.courseId)
          : [];
        setPurchases(courses);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
      setLoading(false);
    };

    fetchPurchases();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Logo and greeting */}
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <div className="text-lg text-gray-700 font-semibold">
            Hello, {user?.user?.firstName || user?.user?.email || "User"}!
          </div>
          <h2 className="text-xl font-semibold">My Purchases</h2>
        </div>
      </div>

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchases.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <img
                className="rounded-lg w-full h-48 object-cover"
                src={course.image?.url || "/logo.png"}
                alt={course.title}
              />
              <h3 className="text-lg font-bold mt-4">{course.title}</h3>
              <p className="text-gray-500 mt-2">
                {course.description?.length > 100
                  ? `${course.description.slice(0, 100)}…`
                  : course.description || "No description available."}
              </p>
              <span className="text-green-700 font-semibold text-sm mt-2 block">
                  ₹{course.price} only
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no purchases yet.</p>
      )}

      <div className="mt-8">
        <Link
          to="/courses"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Explore Courses
        </Link>
      </div>
    </div>
  );
}

export default Purchases;