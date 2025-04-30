import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../header";
import Footer from "../footer";
import { BookmarkIcon } from '@heroicons/react/24/solid';
// import { jobList } from "../../utils/models";
// import { ScrollToTop } from "../../utils/helper";
import axios from "axios";
import { useAuth } from "../../AuthContext";

export const Results_page_jobs = () => {
  const navigate = useNavigate();
  const { authAxios, user } = useAuth();

  const [sortBy, setSortBy] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [jobs, setJobs] = useState([]);

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bid) => bid !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

useEffect(() => {
  const fetchJobs = async () => {
      try {
          console.log("Fetching jobs...");
          const response = await authAxios.get(`jobs/job-results?sortBy=${sortBy}`);

          setJobs(response.data);

          // Fetch bookmarked jobs
          const bookmarkedResponse = await authAxios.get(`jobs/job-bookmarked`);  

          setBookmarkedIds(bookmarkedResponse.data.map(job => job._id));

      } catch (error) {
          console.error("Error fetching jobs:", error);
      }
  };

  fetchJobs();
  window.scrollTo(0, 0);
}, [sortBy, navigate]);

  return (
    <>
      <div className="w-screen pb-10">
        <Navbar />
      </div>
      
      <div className="w-full h-full bg-gray-200 p-10 flex flex-col justify-center items-center">
        <div className="container flex flex-col items-start space-y-8 text-black text-left ">
          
          {/* Sort by */}
          <div className="flex flex-row space-x-4 items-center">
            <h2>Sort by:</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          {/* Sort by */}

          {/* Jobs Display */}
        <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Link to={`/job-details/${job._id}`}>
                <img src={job.image || "src/assets/Building.png" } alt={job.job_title} className="w-full h-48 object-cover" />
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
          {/* Jobs Display */}
          {/* Jobs Section */}
          
        </div>
      </div>
      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};

