import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utlis";

function UpdateCourse() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${id}`, {
          withCredentials: true,
        });
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImage(data.course.image.url);
        setImagePreview(data.course.image.url);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("imageUrl", image);
    }
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      return;
    }
    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Failed to update course");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-950 py-10 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800 p-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border-2 border-orange-400 mb-2" />
          <h3 className="text-3xl font-bold text-orange-400 mb-2 drop-shadow">Update Course</h3>
          <p className="text-gray-200 text-lg">Edit the details and update your course on Courseify!</p>
        </div>
        <form onSubmit={handleUpdateCourse} className="space-y-7">
          <div>
            <label className="block text-lg text-gray-200 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-blue-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-lg text-gray-200 mb-1">Description</label>
            <textarea
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-blue-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-lg text-gray-200 mb-1">Price (₹)</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-blue-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
                min={0}
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="block text-lg text-gray-200 mb-1">Course Image</label>
              <div className="w-full flex items-center justify-center mb-2">
                <img
                  src={imagePreview ? imagePreview : "/imgPL.webp"}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border-4 border-blue-900 bg-white/20 shadow-lg"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-blue-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-blue-900 hover:to-blue-800 hover:text-orange-300 text-white rounded-lg font-bold text-lg shadow-lg transition duration-300"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;