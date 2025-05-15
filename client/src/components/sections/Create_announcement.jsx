import Navbar_admin from "../header_admin";
import Footer from "../footer";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { IoIosArrowBack } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const { user, authAxios } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const fileInputRef = useRef(null);

  const [actualFiles, setActualFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    created_by: user?._id || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      if (!imageTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image file.`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds the 10MB size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setActualFiles((prev) => [...prev, ...validFiles]);

    // Clear input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.body.trim()) {
      setError("Body is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5050/announcement/create", formData);
      console.log("Successfully sent to all users");
    } catch (err) {
      console.error("Error creating announcement", err);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-screen">
        <Navbar_admin toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 px-6 sm:px-10 lg:px-14 py-12 flex flex-col items-center gap-8 min-h-screen pr-20 mt-10"
        >
          <div className="w-full max-w-3xl">
            <div
              className="flex items-center gap-2 cursor-pointer text-[#145C44] mb-6"
              onClick={() => navigate("/admin_main")}
            >
              <IoIosArrowBack className="text-sm text-[#145C44]" />
              <span className="text-m font-light">Back</span>
            </div>

            <div className="flex items-center text-3xl lg:text-4xl font-bold text-[#145C44] mb-8">
              <LuPencil className="mr-2" />
              Create Announcement
            </div>

            <div className="flex flex-col gap-6">
              {/* Title */}
              <div className="flex flex-col">
                <label htmlFor="title" className="text-gray-700 font-semibold mb-1">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Announcement title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#891839]"
                />
              </div>

              {/* Body */}
              <div className="flex flex-col">
                <label htmlFor="body" className="text-gray-700 font-semibold mb-1">
                  Body
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={8}
                  required
                  placeholder="Write your announcement here..."
                  value={formData.body}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-md resize-y text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#891839]"
                />
              </div>

              {/* File Upload */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Upload Images (optional)
                </label>

                {/* Hidden input */}
                <input
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  type="file"
                />

                {/* Add More Button */}
                <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white
                          bg-[#891839]
                          transition-shadow shadow-md hover:shadow-lg"
              >
                <span className="text-lg font-bold">+</span>
                Add Images
              </button>



                {/* File count */}
                <p className="text-sm text-gray-500 mt-1">
                  {actualFiles.length} file{actualFiles.length !== 1 ? "s" : ""} selected
                </p>

                {/* Preview */}
                {actualFiles.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {actualFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-full aspect-square border rounded overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = actualFiles.filter((_, i) => i !== index);
                            setActualFiles(updated);
                          }}
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-90"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin_main")}
                  className="bg-[#891839] text-white px-6 py-2 rounded-md font-medium hover:bg-[#a1284f] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#145C44] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1e7c56] transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};
