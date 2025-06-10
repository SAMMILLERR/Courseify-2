import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utlis";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Login successful!");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response?.data) {
        // Handle Zod errors (array)
        if (Array.isArray(error.response.data.errors)) {
          setErrorMessage(
            error.response.data.errors.map((err) => err.message).join(" ")
          );
        } else if (typeof error.response.data.errors === "string") {
          setErrorMessage(error.response.data.errors);
        } else if (typeof error.response.data.message === "string") {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Login failed!!!");
        }
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
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
          <Link
            to={"/signup"}
            className="bg-orange-500 border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md hover:bg-white hover:text-black transition"
          >
            Signup
          </Link>
          <Link
            to={"/courses"}
            className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md hover:bg-white transition"
          >
            Join now
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-lg mt-32 mb-8 border border-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-center text-orange-500 drop-shadow">
            Welcome to Courseify
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Log in to access paid content!
          </p>

          {errorMessage && (
            <div className="mb-4 text-red-700 bg-red-100 border border-red-400 rounded px-4 py-2 text-center font-semibold shadow">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-gray-400 mb-2 block">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-400 mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer select-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-400 hover:underline">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;