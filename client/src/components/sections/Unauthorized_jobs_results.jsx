import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { LuPencil } from "react-icons/lu";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import Sidebar from "../Sidebar";

export const Unauthorized_jobs_results_page = () => {
  const navigate = useNavigate();
  const { user, authAxios } = useAuth();

  const [sortBy, setSortBy] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobButton, setjobButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobCount, setJobCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleBookmark = (id) => {
    if (!user) {
      alert("Please log in to bookmark jobs.");
      return;
    }
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bid) => bid !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching jobs...");

        // Use public API endpoint without auth
        const response = await axios.get(`http://localhost:5050/jobs/job-results?sortBy=${sortBy}`);

        setJobs(response.data);
        setJobCount(response.data.length);
        setIsLoading(false);

        if (response.data.length === 0) {
          setjobButton(true);
        }

        console.log("Job Count:", response.data.length);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
    window.scrollTo(0, 0);
  }, [sortBy, user, authAxios]);

  return (
    <>
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {isLoading ? (
          <div className="min-w-screen min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-[#145C44] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="min-w-screen min-h-screen bg-gray-200 px-10 py-20 pb-30 flex flex-col justify-center items-center text-6xl text-emerald-800 font-extrabold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-black-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.75L12 3l9 4.75M4.5 10.25v7.5l7.5 4.25 7.5-4.25v-7.5M4.5 10.25L12 14.5l7.5-4.25" />
            </svg>
            No jobs found.
          </div>
        ) : (
          <div className="min-w-screen min-h-screen bg-gray-200 px-10 py-20 pb-30 flex flex-col justify-center items-center">
            <div className="container flex flex-col items-start space-y-8 text-black text-left ">
              
              {/* Jobs Display */}
              <div className="flex justify-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <Link to={`/job-details/${job._id}`}>
                        <img
                          src={`http://localhost:5050/uploads/${job.files[0]}` || "src/assets/Building.png"}
                          alt={job.job_title}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <div className="p-4">
                        {/* Bookmark icon only clickable if logged in */}
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => toggleBookmark(job._id)}
                            className="text-white-400 hover:text-white-500 focus:outline-none"
                            title={bookmarkedIds.includes(job._id) ? "Remove Bookmark" : "Bookmark"}
                          >
                            {bookmarkedIds.includes(job._id) ? (
                              <BookmarkIcon className="w-6 h-6" />
                            ) : (
                              <BookmarkIcon className="w-6 h-6 opacity-50" />
                            )}
                          </button>
                        </div>

                        {/* Job details */}
                        <h2 className="text-xl font-semibold mb-1">{job.job_title}</h2>
                        <h3 className="text-lg text-gray-600 mb-1">{job.company}</h3>
                        <p className="text-sm text-gray-500 mb-2">{job.location}</p>
                        <p className="text-gray-700">{job.job_description}</p>
                        <p className="text-sm text-right text-gray-500 mb-2">
                          {new Date(job.date_posted).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Jobs Display */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
