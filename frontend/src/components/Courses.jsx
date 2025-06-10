import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utlis";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [user, setUser] = useState(null);

  // Modal state for full description
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title, description) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalDescription("");
    setModalTitle("");
  };

  // Check token and user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search) {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, courses]);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = "/";
      setUser(null);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Calculate discount price (20% off as an example)
  const getDiscountPrice = (price) => {
    if (!price) return "";
    const discount = Math.round(price * 1.2);
    return discount;
  };

  return (
    <div className="flex font-sans bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white/90 shadow-lg w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-orange-400" />
          <span className="ml-3 text-2xl font-bold text-orange-500 tracking-wide">Courseify</span>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center hover:text-orange-500 transition">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-600 font-semibold">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center hover:text-orange-500 transition">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center hover:text-orange-500 transition">
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <Link
                  to={"/"}
                  className="flex items-center hover:text-orange-500 transition"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center hover:text-orange-500 transition">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full bg-gradient-to-br from-white via-blue-50 to-orange-50 p-10 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 tracking-wide">All Courses</h1>
            {user && (
              <div className="mt-2 flex items-center space-x-2">
                <FaCircleUser className="text-2xl text-blue-600" />
                <span className="text-base text-gray-700 font-semibold">
                  {user.user?.firstName || user.user?.email || "User"}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type here to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10 focus:outline-none bg-white"
              />
              <button
                className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center bg-white"
                onClick={(e) => e.preventDefault()}
                tabIndex={-1}
              >
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col group relative"
                >
                  <img
                    src={course.image?.url || "/logo.png"}
                    alt={course.title}
                    className="rounded-xl mb-4 w-full h-48 object-cover border-2 border-blue-100"
                  />
                  <h2 className="font-bold text-xl mb-2 text-blue-900">{course.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2 relative">
                    {course.description.length > 100 ? (
                      <>
                        {course.description.slice(0, 100)}...
                        <button
                          className="ml-2 text-blue-600 underline text-xs"
                          onClick={() => openModal(course.title, course.description)}
                          type="button"
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      course.description
                    )}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-2xl text-orange-600">
                      ₹{course.price}
                      <span className="text-gray-400 text-base line-through ml-2">
                        ₹{getDiscountPrice(course.price)}
                      </span>
                    </span>
                    <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                      {course.price && getDiscountPrice(course.price)
                        ? `${Math.round(100 - (course.price / getDiscountPrice(course.price)) * 100)}% off`
                        : "20% off"}
                    </span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-gradient-to-r from-orange-500 to-orange-400 w-full text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-900 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 transition duration-300 mt-auto"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for full description */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
              <button
                className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-orange-500"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-900">{modalTitle}</h2>
              <p className="text-gray-800 mb-4 whitespace-pre-line">{modalDescription}</p>
              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 text-white rounded-lg font-bold text-lg shadow-lg transition duration-300"
                onClick={closeModal}
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

export default Courses;