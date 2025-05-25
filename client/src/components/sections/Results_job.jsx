import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { LuPencil } from "react-icons/lu";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { TbFilter, TbFilterFilled, TbZoomQuestion } from "react-icons/tb";
import { FaRegCreditCard } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../../auth/AuthContext";
import job_placeholder from "../../assets/job_placeholder.png"
import motherboard from "../../assets/motherboard.jpg"
import axios from "axios";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import Sidebar from "../Sidebar";

export const Results_page_jobs = ( ) => {
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();

    const [sortBy, setSortBy] = useState("relevance");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [jobButton, setjobButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [jobCount, setJobCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [appliedSkills, setAppliedSkills] = useState([]);
    const [isSkillFilterOpen, setIsSkillFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableSkills, setAvailableSkills] = useState([]);

    const handleSkillToggle = (skillValue) => {
        if (selectedSkills.includes(skillValue)) {
            setSelectedSkills(selectedSkills.filter(skill => skill !== skillValue));
        } else {
            setSelectedSkills([...selectedSkills, skillValue]);
        }
    };

    const clearSkillFilters = () => {
        setSelectedSkills([]);
    };

    const applySkillFilters = () => {
        setAppliedSkills([...selectedSkills]);
        setIsSkillFilterOpen(false);
    };

    const getFilteredJobCount = (tempSelectedSkills) => {
        let filteredJobs = [...allJobs];
        if (tempSelectedSkills.length > 0) {
            filteredJobs = filteredJobs.filter(job =>
                tempSelectedSkills.some(skill => 
                    job.requirements?.some(req => req === skill)
                )
            );
        }
        return filteredJobs.length;
    };

    const getRequirements = (jobsData) => {
        const skillsMap = new Map();
        jobsData.forEach(job => {
            if (job.requirements && Array.isArray(job.requirements)) {
                job.requirements.forEach(requirement => {
                    if (requirement && typeof requirement === 'string') {
                        const skill = requirement.trim();
                        if (skill) {
                            if (skillsMap.has(skill)) {
                                skillsMap.set(skill, skillsMap.get(skill)+1);
                            } else {
                                skillsMap.set(skill, 1);
                            }
                        }
                    }
                });
            }
        });

        return Array.from(skillsMap.entries())
            .map(([skill, count]) => ({ label: skill, value: skill, count }))
            .sort((a, b) => {
                if (b.count !== a.count) {
                    return b.count - a.count;
                }
                return a.label.localeCompare(b.label);
            });
    };

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const toggleSkillFilter = () => {
        if (!isSkillFilterOpen) {
            setSelectedSkills([...appliedSkills]);
        }
        setIsSkillFilterOpen((prev) => !prev);
    };
    const toggleSort = () => setIsSortOpen((prev) => !prev);

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

    const sortOptions = [
        { value: "relevance", label: "Relevance" },
        { value: "date_desc", label: "Date: Newest First" },
        { value: "date_asc", label: "Date: Oldest First" },
        { value: "title_asc", label: "Title: A-Z" },
        { value: "title_desc", label: "Title: Z-A" }
    ];

    const handleSortChange = (value) => {
        setSortBy(value);
        setIsSortOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    // function to apply sorting, filtering, and searching
    const applySortingFilteringAndSearching = (jobsToProcess) => {
        let processedJobs = [...jobsToProcess];

        // search filter
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            processedJobs = processedJobs.filter(job =>
                job.job_title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query)
            );
        }

        // skill filter
        if (appliedSkills.length > 0) {
            processedJobs = processedJobs.filter(job =>
                appliedSkills.some(skill => 
                    job.requirements?.some(req => req === skill)
                )
            );
        }

        // sorting
        if (sortBy === "date_desc") {
            processedJobs.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
        } else if (sortBy === "date_asc") {
            processedJobs.sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
        } else if (sortBy === "title_asc") {
            processedJobs.sort((a, b) => a.job_title.localeCompare(b.job_title));
        } else if (sortBy === "title_desc") {
            processedJobs.sort((a, b) => b.job_title.localeCompare(a.job_title));
        }

        return processedJobs;
    };

    useEffect(() => {
        const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await authAxios.get(`jobs/job-results`);
            setAllJobs(response.data);

            const skills = getRequirements(response.data);
            setAvailableSkills(skills);
            
            const processedJobs = applySortingFilteringAndSearching(response.data);
            setJobs(processedJobs);
            setJobCount(processedJobs.length);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchJobs();
        window.scrollTo(0, 0);
    }, [navigate]);

    // handle sorting, filtering, and searching changes
    useEffect(() => {
        if (allJobs.length > 0) {
            const processedJobs = applySortingFilteringAndSearching(allJobs);
            setJobs(processedJobs);
            setJobCount(processedJobs.length);
        }
    }, [sortBy, appliedSkills, searchQuery, allJobs]);

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

    const scrollbarStyle = {
        maxHeight: '16rem',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#104C96 transparent'
    };

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar toggleSidebar={toggleSidebar} />
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            >
                <Sidebar/>
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} bg-gray-100`}>

            {isLoading ? (
                <Loading />
            ) : allJobs.length === 0 ? (
                <div className="min-w-screen min-h-screen bg-gray-100 px-10 py-20 pb-30 flex flex-col justify-center items-center text-6xl text-emerald-800 font-extrabold">
                  <svg className="w-24 h-24 text-black-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.75L12 3l9 4.75M4.5 10.25v7.5l7.5 4.25 7.5-4.25v-7.5M4.5 10.25L12 14.5l7.5-4.25" />
                  </svg>
                    No jobs found.
                  <button
                    onClick={() => navigate('/post_job')}
                    className="bg-[#891839] rounded-md px-6 py-3 text-lg text-white font-light mt-5 hover:scale-105 transition-transform"
                  >
                    Post a Job
                  </button>
                </div> 
            ) : (
                <div className="pt-1">
                    <div
                        className="relative bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 pt-15 w-full h-[35vh]"
                        style={{
                            backgroundImage: `url(${motherboard})`,
                            backgroundPosition: "top",
                        }}
                    >
                        <div className="absolute inset-0 bg-gray-800 opacity-60 z-0"></div>
                        <div className="relative z-10 w-full flex items-center justify-between">
                            <div className="mt-12">
                                <h2 className="text-4xl lg:text-5xl text-white font-semibold pl-10">
                                    Job Listings
                                </h2>
                                <div className="text-lg text-white font-medium pl-10 mt-1 flex items-center space-x-2">
                                    <MdOutlineConfirmationNumber className="text-lg" />
                                    <span>{jobCount.toLocaleString()} job{jobCount !== 1 && "s"} available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full min-w-screen min-h-screen bg-gray-100 px-15 lg:px-25 pt-15 flex flex-col items-center">
                        <div className="container flex flex-col items-start space-y-8 text-black text-left ">
                            
                            {/* Search Bar */}
                            <div className="w-full flex justify-center mb-6">
                                <div className="relative w-full max-w-2xl">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#104C96]" />
                                        <input
                                            type="text"
                                            placeholder="Search by job title or company..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:none focus:border-transparent outline-none text-gray-700 bg-white shadow-sm"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={clearSearch}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                                            >
                                                <RxCross2 className="cursor-pointer"/>
                                            </button>
                                        )}
                                    </div>
                                    {searchQuery && (
                                        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-600 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
                                            {jobs.length > 0 ? (
                                                <span>Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching "{searchQuery}"</span>
                                            ) : (
                                                <span>No jobs found matching "{searchQuery}"</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sort and Filters */}
                            <div className="w-full flex justify-between items-center py-4">
                                {/* Sort Dropdown */}
                                <div className="relative pl-2">
                                    <button
                                        onClick={toggleSort}
                                        className="flex items-center space-x-2 text-md text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
                                    >
                                        <span className="font-semibold">Sort:</span>
                                        <span className="text-gray-600">
                                            {sortOptions.find(option => option.value === sortBy)?.label}
                                        </span>
                                        <IoIosArrowDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isSortOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleSortChange(option.value)}
                                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                                                        sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 pr-4">
                                    {/* Skills Filter */}
                                    <div className="relative">
                                        <button 
                                            onClick={toggleSkillFilter}
                                            className="cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                        >
                                            {appliedSkills.length > 0 || isSkillFilterOpen ? (
                                                <TbFilterFilled className="w-6 h-6 text-[#104C96]" />
                                            ) : (
                                                <TbFilter className="w-6 h-6 text-gray-600" />
                                            )}
                                            <span className="text-md font-medium">
                                                Filter {appliedSkills.length > 0 && `(${appliedSkills.length})`}
                                            </span>
                                        </button>

                                        {/* Dropdown */}
                                        {isSkillFilterOpen && (
                                            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-800">Skills Filter</h3>
                                                        <button
                                                            onClick={toggleSkillFilter}
                                                            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                                        >
                                                            {/* <RxCross2 className="cursor-pointer"/> */}
                                                        </button>
                                                        <button
                                                            onClick={clearSkillFilters}
                                                            className="text-[#104C96] hover:text-blue-700 font-medium text-sm cursor-pointer"
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>

                                                    {availableSkills.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <p>No skills found in job requirements</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="max-h-64 overflow-y-auto " style={scrollbarStyle}>
                                                                <div className="space-y-1">
                                                                    {availableSkills.map((skill) => {
                                                                        const isSelected = selectedSkills.includes(skill.value);
                                                                        
                                                                        return (
                                                                            <label 
                                                                                key={skill.value} 
                                                                                className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer`}
                                                                            >
                                                                                <div className="flex items-center space-x-3">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={isSelected}
                                                                                        onChange={() => handleSkillToggle(skill.value)}
                                                                                       className="peer hidden"
                                                                                    />
                                                                                    <div
                                                                                        className={`w-4 h-4 flex items-center justify-center border rounded ${
                                                                                            isSelected
                                                                                                ? 'bg-[#104C96] border-[#104C96]'
                                                                                                : 'bg-gray-100 border-gray-300'
                                                                                        }`}
                                                                                    >
                                                                                        {isSelected && (
                                                                                            <svg
                                                                                                className="w-3 h-3 text-white"
                                                                                                fill="none"
                                                                                                stroke="currentColor"
                                                                                                strokeWidth="2"
                                                                                                viewBox="0 0 24 24"
                                                                                            >
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                            </svg>
                                                                                        )}
                                                                                    </div>
                                                                                    <span className="text-gray-700 text-sm">{skill.label}</span>
                                                                                </div>
                                                                                <span className="text-gray-500 text-sm font-medium">
                                                                                    {skill.count}
                                                                                </span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                                <button
                                                                    onClick={applySkillFilters}
                                                                    className="w-full bg-[#104C96] text-white py-2 px-4 rounded-md hover:bg-[#105596] transition-colors font-medium cursor-pointer"
                                                                >
                                                                    Show {getFilteredJobCount(selectedSkills)} job{getFilteredJobCount(selectedSkills) !== 1 ? 's' : ''}
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-7 w-px bg-gray-300"></div>

                                    {/* Post Job */}
                                    {jobButton && (
                                        <button
                                            onClick={() => navigate('/post_job')}
                                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
                                        >
                                            <LuPencil className="w-5 h-5" />
                                            <span className="text-md font-medium">Post</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {jobs.length === 0 ? (
                                <div className="flex justify-center w-full mt-20 mb-35">
                                    <div className="text-center">
                                        <TbZoomQuestion className="w-18 h-18 text-[#104C96] mx-auto mb-4" />
                                        
                                        {searchQuery ? (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No jobs found for "{searchQuery}"</h3>
                                                <p className="text-gray-500 mb-6">Try different keywords or check your spelling.</p>
                                                <button
                                                    onClick={clearSearch}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium mr-3 cursor-pointer"
                                                >
                                                    Clear Search
                                                </button>
                                            </>
                                        ) : appliedSkills.length > 0 ? (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No jobs match your filters</h3>
                                                <p className="text-gray-500 mb-6">Try adjusting your filters or clearing them to see more results.</p>
                                                <button
                                                    onClick={() => {
                                                        setAppliedSkills([]);
                                                        setSelectedSkills([]);
                                                    }}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium mr-3 cursor-pointer"
                                                >
                                                    Clear Filters
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                                                <p className="text-gray-500 mb-6">There are currently no job listings available.</p>
                                            </>
                                        )}
                                        
                                        {(searchQuery || appliedSkills.length > 0) && (
                                            <button
                                                onClick={() => navigate('/post_job')}
                                                className="bg-[#891839] text-white px-6 py-2 rounded-md hover:bg-[#7a1532] transition-colors font-medium cursor-pointer"
                                            >
                                                Post a Job
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Display jobs */
                                <div className="flex justify-center w-full overflow-x-hidden mb-25 pr-4 pl-2 pb-10">
                                    <div className="w-full max-w-8xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {jobs.map(job => (
                                                <div key={job._id} className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
                                                    <Link to={`/job-details/${job._id}`}>
                                                        <img
                                                            src={job?.files?.[0]?.serverFilename
                                                                ? `http://localhost:5050/uploads/${job.files[0].serverFilename}`
                                                                : job_placeholder}
                                                            alt={job.job_title}
                                                            className="w-full h-48 object-cover" />
                                                    </Link>

                                                    <div className="p-4 flex flex-col h-full">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h2 className="text-xl font-semibold line-clamp-1">{job.job_title}</h2>
                                                            <button
                                                                onClick={() => toggleBookmark(job._id)}
                                                                title={bookmarkedIds.includes(job._id) ? "Remove Bookmark" : "Bookmark"}
                                                                className="p-2 rounded-full transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 cursor-pointer"
                                                            >
                                                                <BookmarkIcon className={`w-6 h-6 ${bookmarkedIds.includes(job._id) ? "text-emerald-600" : "opacity-50"}`} />
                                                            </button>
                                                        </div>
                                                        <p className="text-lg text-gray-500 line-clamp-1">{job.company}</p>
                                                        <p className="text-sm text-gray-500 mb-2 flex items-center space-x-1 line-clamp-1">
                                                            <FaLocationDot className="text-grays-500" />
                                                            <span className="line-clamp-1">{job.location}</span>
                                                        </p>
                                                        {job.salary && (
                                                            <p className="text-md font-semibold mb-2 flex items-center space-x-2">
                                                                <FaRegCreditCard className="text-gray-700" />
                                                                <span className="text-gray-700">
                                                                    ₱{Number(job.salary).toLocaleString()} a month
                                                                </span>
                                                            </p>
                                                        )}
                                                        {job.requirements && job.requirements.length > 0 && (
                                                            <div className="flex space-x-2 mb-4">
                                                                {job.requirements.slice(0, 3).map((req, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="text-xs text-left bg-blue-100 text-blue-700 px-4 py-1 rounded-full"
                                                                    >
                                                                        {req}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-gray-700 flex-grow mb-3 line-clamp-2">{job.job_description}</p>
                                                        <p className="text-sm text-right text-gray-500">
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
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
            {sidebarOpen ? (
                <div className="ml-64 w-full z-10">
                    <Footer />
                </div> 
            ) : (
                <div className="w-full z-50">
                    <Footer />
                </div>
            )}
        </>
    );
};