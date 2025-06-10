import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utlis";

function Home() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  // Check login and get user info
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || parsed);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: true, // loop the slider
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-5 bg-opacity-70 bg-black fixed top-0 left-0 z-10">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <Link to={"/"} className="text-2xl font-bold text-orange-500 tracking-wide">
            Courseify
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded-lg shadow border border-gray-700">
              <FaUserCircle className="text-2xl text-orange-400" />
              <span className="text-white font-semibold text-sm">
                {user.firstName ? user.firstName : user.email}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-transparent text-xs text-white border border-white rounded px-2 py-1 hover:bg-white hover:text-black transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to={"/login"}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Login
              </Link>
              <Link
                to={"/signup"}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center pt-32">
        {/* Hero Section */}
        <section className="text-center py-20 w-full">
          <div className="mx-auto max-w-2xl bg-gradient-to-br from-blue-900/80 via-black/70 to-blue-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-10">
            <h1 className="text-5xl font-extrabold text-orange-500 drop-shadow mb-4 tracking-wide">
              Courseify
            </h1>
            <p className="text-gray-200 text-xl mb-8 font-medium">
              Sharpen your skills with <span className="text-orange-400 font-bold">courses crafted by experts.</span>
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
              <Link
                to={"/courses"}
                className="bg-gradient-to-r from-green-500 to-green-400 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg hover:bg-white hover:text-green-700 hover:scale-105 duration-300 border-2 border-green-400"
              >
                Explore Courses
              </Link>
              <a
                href="https://harkirat.classx.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-700 py-3 px-8 rounded-xl font-bold text-lg shadow-lg hover:bg-green-500 hover:text-white hover:scale-105 duration-300 border-2 border-green-400"
              >
                Courses Videos
              </a>
            </div>
          </div>
        </section>

        {/* Courses Slider */}
        <section className="p-10 w-full max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/80 via-black/70 to-blue-950/90 rounded-2xl shadow-2xl p-6">
            <h2 className="text-3xl font-bold text-center text-orange-400 mb-8 drop-shadow">
              Featured Courses
            </h2>
            <Slider {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border-2  hover:border-blue-400 transition">
                      <img
                        className="h-40 w-full object-contain bg-gray-800"
                        src={course.image?.url}
                        alt={course.title}
                      />
                      <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">
                          {course.title}
                        </h2>
                        <Link
                          to={`/buy/${course._id}`}
                          className="mt-8 bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-blue-500 duration-300 inline-block font-semibold shadow"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="mt-auto py-12 bg-black bg-opacity-60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
              <h1 className="text-2xl text-orange-500 font-bold">Courseify</h1>
            </div>
            <div className="mt-3 ml-2 md:ml-8 text-white">
              <p className="mb-2">Follow us</p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                </a>
              </div>
            </div>
          </div>

          <div className="items-center mt-6 md:mt-0 flex flex-col">
            <h3 className="text-orange-500 font-semibold md:mb-4">Connects</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">
                YouTube - learn coding
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Telegram - learn coding
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Github - learn coding
              </li>
            </ul>
          </div>
          <div className="items-center mt-6 md:mt-0 flex flex-col">
            <h3 className="text-orange-500 font-semibold mb-4">
              Copyright &copy; {new Date().getFullYear()}
            </h3>
            <ul className="space-y-2 text-center text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">
                Terms & Conditions
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer duration-300">
                Refund & Cancellation
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;