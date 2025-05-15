import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../header";
import Footer from "../footer";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { LuPencil } from "react-icons/lu";
import { CgWorkAlt } from "react-icons/cg";
// import { jobList } from "../../utils/models";
import { ScrollToTop } from "../../utils/helper";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import Sidebar from "../Sidebar";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";


export const Results_page_jobs = () => {
  const navigate = useNavigate();
  const { authAxios, user } = useAuth();

  const [sortBy, setSortBy] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobButton, setjobButton] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const [jobCount, setJobCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleBookmark = async (jobId) => {
    try {
      if (bookmarkedIds.includes(jobId)) {
        await authAxios.post('/jobs/unbookmark', { userId: user._id, jobId });
        setBookmarkedIds(bookmarkedIds.filter((id) => id !== jobId));
      } else {
        await authAxios.post('/jobs/bookmark', { userId: user._id, jobId });
        setBookmarkedIds([...bookmarkedIds, jobId]);
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
    }
  };


useEffect(() => {
  const fetchJobs = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching jobs...");
        const response = await authAxios.get(`jobs/job-results?sortBy=${sortBy}`);

        setJobs(response.data);
        setJobCount(response.data.length);

        console.log("Job Count:", response.data.length);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
  };

  fetchJobs();
  window.scrollTo(0, 0);
}, [sortBy, navigate]);

useEffect(() => {
  const fetchBookmarkedJobs = async () => {
    try {
      const res = await authAxios.get(`/jobs/job-bookmarked?userId=${user._id}`);
      const ids = res.data.map(job => job._id);
      setBookmarkedIds(ids);
    } catch (err) {
      console.error("Error fetching bookmarked jobs:", err);
    }
  };

  if (user?._id) fetchBookmarkedJobs();
}, [user?._id]);


  return (
    <>
      <div className="w-screen pb-10">
        <Navbar toggleSidebar={toggleSidebar}/>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
          <Sidebar/>
      </div>
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.75L12 3l9 4.75M4.5 10.25v7.5l7.5 4.25 7.5-4.25v-7.5M4.5 10.25L12 14.5l7.5-4.25"
          />
        </svg>
              No jobs found.
              <button 
              onClick={()=>navigate('/post_job')}
              className="bg-[#891839] rounded-md px-6 py-3 text-lg text-white font-light mt-5 transform transition-transform duration-300 hover:scale-105 focus:!outline-none">Post a Job</button>
              </div> 
      ) :(
        
        <div className="min-w-screen min-h-screen bg-gray-200 px-15 lg:px-25 pt-19 flex flex-col justify-center items-center">
          
            <div className="container flex flex-col items-start space-y-8 text-black text-left ">
              <div className="flex flex-col justify-between items-start w-full">
                <div className="flex items-center space-x-3 pb-8">
                    <CgWorkAlt className="text-5xl lg:text-7xl text-[#145C44]" />
                    <h2 className="text-5xl lg:text-6xl text-[#145C44] font-semibold">Job Listings</h2>
                </div>
                {/* Sort by */}
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-row space-x-4 items-center px-2">
                    <h2>Sort by:</h2>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  {/* Sort by */}

                  {jobButton && (
                    <div>
                      <button
                        onClick={() => navigate('/post_job')}
                        className="flex items-center space-x-3 bg-[#891839] text-white rounded-md mr-2 px-4 py-2 md:px-6 md:py-2.5 lg:px-6 lg:py-2.5 shadow hover:bg-[#89183aed] cursor-pointer focus:!outline-none"
                      >
                        <LuPencil />
                        <span>Post a Job</span>
                      </button>
                    </div>
                    )}
                </div>

                {/* Jobs Display */}
              <div className="flex justify-center w-full mb-35 mt-5 px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Link to={`/job-details/${job._id}`}>
                      <img src={`${apiUrl}/uploads/${job.files[0].serverFilename}` || "src/assets/Building.png" } alt={job.job_title} className="w-full h-48 object-cover" />
                    </Link>
                    <div className="p-4">
                      
                      {/* Moved bookmark icon here */}
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

                      {/* Text content */}
                      <h2 className="text-xl font-semibold mb-1">{job.job_title}</h2>
                      <h3 className="text-lg text-gray-600 mb-1">{job.company}</h3>
                      <p className="text-sm text-gray-500 mb-2">{job.location}</p>
                      <p className="text-gray-700">{job.job_description}</p>
                      <p className="text-sm text-right text-gray-500 mb-2">
                        {new Date(job.date_posted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </div>
              {/* Jobs Display */}
              {/* Jobs Section */}
              
            </div>
          </div>	
      )
          
      }
      </div>
      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};
