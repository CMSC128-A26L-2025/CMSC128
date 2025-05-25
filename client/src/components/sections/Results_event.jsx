import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { TbMoodEmpty } from "react-icons/tb";
import { TbCalendarStar } from "react-icons/tb";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { TbZoomQuestion } from "react-icons/tb";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../../auth/AuthContext";
import default_eventbg from "../../assets/event_placeholder.png";
import eventHeader from "../../assets/eventHeader.png";
import axios from "axios";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import Sidebar from "../Sidebar";

export const Results_page_events = () => {
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();

    const [sortBy, setSortBy] = useState("relevance");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventCount, setEventCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [appliedMonths, setAppliedMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [appliedYear, setAppliedYear] = useState("");
    const [isMonthFilterOpen, setIsMonthFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const months = [
        { value: 0, label: "January" },
        { value: 1, label: "February" },
        { value: 2, label: "March" },
        { value: 3, label: "April" },
        { value: 4, label: "May" },
        { value: 5, label: "June" },
        { value: 6, label: "July" },
        { value: 7, label: "August" },
        { value: 8, label: "September" },
        { value: 9, label: "October" },
        { value: 10, label: "November" },
        { value: 11, label: "December" }
    ];

    const getAvailableYears = () => {
        const years = [...new Set(allEvents.map(event => 
            new Date(event.event_date).getFullYear()
        ))].sort((a, b) => b - a);
        return years;
    };

    const handleMonthToggle = (monthValue) => {
        if (selectedMonths.includes(monthValue)) {
            setSelectedMonths(selectedMonths.filter(month => month !== monthValue));
        } else {
            setSelectedMonths([...selectedMonths, monthValue]);
        }
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const clearMonthFilters = () => {
        setSelectedMonths([]);
        setSelectedYear("");
    };

    const applyMonthFilters = () => {
        setAppliedMonths([...selectedMonths]);
        setAppliedYear(selectedYear);
        setIsMonthFilterOpen(false);
    };

    const getMonthCount = (monthValue) => {
        let filteredEvents = allEvents;

        if (selectedYear) {
            filteredEvents = filteredEvents.filter(event => 
                new Date(event.event_date).getFullYear() === parseInt(selectedYear)
            );
        }
        
        return filteredEvents.filter(event => 
            new Date(event.event_date).getMonth() === monthValue
        ).length;
    };

    const getFilteredEventCount = (tempSelectedMonths, tempSelectedYear) => {
        let filteredEvents = [...allEvents];
        
        if (tempSelectedYear) {
            filteredEvents = filteredEvents.filter(event =>
                new Date(event.event_date).getFullYear() === parseInt(tempSelectedYear)
            );
        }
        
        if (tempSelectedMonths.length > 0) {
            filteredEvents = filteredEvents.filter(event =>
                tempSelectedMonths.includes(new Date(event.event_date).getMonth())
            );
        }
        
        return filteredEvents.length;
    };

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const toggleMonthFilter = () => {
        if (!isMonthFilterOpen) {
            setSelectedMonths([...appliedMonths]);
            setSelectedYear(appliedYear);
        }
        setIsMonthFilterOpen((prev) => !prev);
    };
    const toggleSort = () => setIsSortOpen((prev) => !prev);

    const toggleBookmark = async (eventId) => {
        try {
            if (bookmarkedIds.includes(eventId)) {
                await authAxios.post('/events/unbookmark', { userId: user._id, eventId });
                setBookmarkedIds(bookmarkedIds.filter((id) => id !== eventId));
            } else {
                await authAxios.post('/events/bookmark', { userId: user._id, eventId });
                setBookmarkedIds([...bookmarkedIds, eventId]);
            }
        } catch (error) {
            console.error("Bookmark toggle failed:", error);
        }
    };

    const sortOptions = [
        { value: "relevance", label: "Relevance" },
        { value: "date_desc", label: "Date: Latest First" },
        { value: "date_asc", label: "Date: Earliest First" },
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
    const applySortingFilteringAndSearching = (eventsToProcess) => {
        let processedEvents = [...eventsToProcess];

        // search filter
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            processedEvents = processedEvents.filter(event =>
                event.event_name.toLowerCase().includes(query) ||
                event.venue.toLowerCase().includes(query)
            );
        }

        // year filter
        if (appliedYear) {
            processedEvents = processedEvents.filter(event =>
                new Date(event.event_date).getFullYear() === parseInt(appliedYear)
            );
        }

        // month filter
        if (appliedMonths.length > 0) {
            processedEvents = processedEvents.filter(event =>
                appliedMonths.includes(new Date(event.event_date).getMonth())
            );
        }

        // sorting
        if (sortBy === "date_desc") {
            processedEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        } else if (sortBy === "date_asc") {
            processedEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        } else if (sortBy === "title_asc") {
            processedEvents.sort((a, b) => a.event_name.localeCompare(b.event_name));
        } else if (sortBy === "title_desc") {
            processedEvents.sort((a, b) => b.event_name.localeCompare(a.event_name));
        }

        return processedEvents;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await authAxios.get(`http://localhost:5050/events/read-sort`);
                setAllEvents(response.data);
                
                const processedEvents = applySortingFilteringAndSearching(response.data);
                setEvents(processedEvents);
                setEventCount(processedEvents.length);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log("Token invalid/expired. Attempting refresh...");

                    try {
                        const refreshResponse = await axios.get("http://localhost:5050/auth/refresh", { withCredentials: true });

                        if (refreshResponse.data.accessToken) {
                            const newToken = refreshResponse.data.accessToken;
                            localStorage.setItem("accessToken", newToken);

                            console.log("Retrying event fetch with new token...");
                            const retryResponse = await axios.get(`http://localhost:5050/events`, {
                                headers: { Authorization: `Bearer ${newToken}` },
                                withCredentials: true
                            });

                            setAllEvents(retryResponse.data);
                            const processedEvents = applySortingFilteringAndSearching(retryResponse.data);
                            setEvents(processedEvents);
                            setEventCount(processedEvents.length);

                        } else {
                            navigate("/login");
                        }
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                } else {
                    console.error("Error fetching events:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
        window.scrollTo(0, 0);
    }, [navigate]);

    // handle sorting, filtering, and searching changes
    useEffect(() => {
        if (allEvents.length > 0) {
            const processedEvents = applySortingFilteringAndSearching(allEvents);
            setEvents(processedEvents);
            setEventCount(processedEvents.length);
        }
    }, [sortBy, appliedMonths, appliedYear, searchQuery, allEvents]);

    useEffect(() => {
        const fetchBookmarkedEvents = async () => {
            try {
                const res = await authAxios.get(`/events/event-bookmarked?userId=${user._id}`);
                const ids = res.data.map(event => event._id);
                setBookmarkedIds(ids);
            } catch (err) {
                console.error("Error fetching bookmarked events:", err);
            }
        };

        if (user?._id) fetchBookmarkedEvents();
    }, [user?._id]);

    const scrollbarStyle = {
        maxHeight: '16rem',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#145C44 transparent'
    };

    const getTotalFilterCount = () => {
        let count = 0;
        if (appliedMonths.length > 0) count += appliedMonths.length;
        if (appliedYear) count += 1;
        return count;
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
            ) : allEvents.length === 0 ? (
                <div className="min-w-screen min-h-screen bg-gray-100 px-10 py-20 pb-30 flex flex-col justify-center items-center text-6xl text-emerald-800 font-extrabold">
                    <TbMoodEmpty className="w-24 h-24 text-gray-400 mb-4" />
                    No events found.
                </div> 
            ) : (
                <div className="pt-1">
                    <div
                        className="relative bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 pt-15 w-full h-[35vh]"
                        style={{
                            backgroundImage: `url(${eventHeader})`,
                            backgroundPosition: "center 20%",
                        }}
                    >
                        <div className="absolute inset-0 bg-gray-900 opacity-60 z-0"></div>
                        {/* <div className="absolute inset-0 bg-gray-500 opacity-30 z-0"></div> */}
                        <div className="relative z-10 w-full flex items-center justify-between">
                            <div className="mt-12">
                                <h2 className="text-4xl lg:text-5xl text-white font-semibold pl-10">
                                    Events
                                </h2>
                                <div className="text-lg text-white font-medium pl-10 mt-1 flex items-center space-x-2">
                                    <TbCalendarStar className="text-lg" />
                                    <span>{eventCount.toLocaleString()} event{eventCount !== 1 && "s"}</span>
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
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#145C44]" />
                                        <input
                                            type="text"
                                            placeholder="Search by event name or venue..."
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
                                            {events.length > 0 ? (
                                                <span>Found {events.length} event{events.length !== 1 ? 's' : ''} matching "{searchQuery}"</span>
                                            ) : (
                                                <span>No events found matching "{searchQuery}"</span>
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
                                                        sortBy === option.value ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 pr-4">
                                    {/* Month and Year Filter */}
                                    <div className="relative">
                                        <button 
                                            onClick={toggleMonthFilter}
                                            className="cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                        >
                                            {getTotalFilterCount() > 0 || isMonthFilterOpen ? (
                                                <TbFilterFilled className="w-6 h-6 text-[#145C44]" />
                                            ) : (
                                                <TbFilter className="w-6 h-6 text-gray-600" />
                                            )}
                                            <span className="text-md font-medium">
                                                Filter {getTotalFilterCount() > 0 && `(${getTotalFilterCount()})`}
                                            </span>
                                        </button>

                                        {/* Dropdown */}
                                        {isMonthFilterOpen && (
                                            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-800">Date Filter</h3>
                                                        <button
                                                            onClick={clearMonthFilters}
                                                            className="text-[#145C44] hover:text-emerald-700 font-medium text-sm cursor-pointer"
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>

                                                    {/* Year Dropdown */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                                        <select
                                                            value={selectedYear}
                                                            onChange={(e) => handleYearChange(e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#145C44] focus:border-transparent cursor-pointer"
                                                        >
                                                            <option value="">All Years</option>
                                                            {getAvailableYears().map((year) => (
                                                                <option 
                                                                    key={year}
                                                                    value={year}
                                                                >
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Month Selection */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Months</label>
                                                        <div className="max-h-64 overflow-y-auto " style={scrollbarStyle}>
                                                            <div className="space-y-1">
                                                                {months.map((month) => {
                                                                    const isSelected = selectedMonths.includes(month.value);
                                                                    
                                                                    return (
                                                                        <label 
                                                                            key={month.value} 
                                                                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center space-x-3">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isSelected}
                                                                                    onChange={() => handleMonthToggle(month.value)}
                                                                                    className="peer hidden"
                                                                                />
                                                                                <div
                                                                                    className={`w-4 h-4 flex items-center justify-center border rounded ${
                                                                                        isSelected
                                                                                            ? 'bg-[#145C44] border-[#145C44]'
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
                                                                                <span className="text-gray-700 text-sm">{month.label}</span>
                                                                            </div>
                                                                            <span className="text-gray-500 text-sm font-medium">
                                                                                {getMonthCount(month.value)}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <button
                                                            onClick={applyMonthFilters}
                                                            className="w-full bg-[#145C44] text-white py-2 px-4 rounded-md hover:bg-[#1A6B52] transition-colors font-medium cursor-pointer"
                                                        >
                                                            Show {getFilteredEventCount(selectedMonths, selectedYear)} event{getFilteredEventCount(selectedMonths, selectedYear) !== 1 ? 's' : ''}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {events.length === 0 ? (
                                <div className="flex justify-center w-full mt-20 mb-35">
                                    <div className="text-center">
                                        <TbZoomQuestion className="w-18 h-18 text-[#145C44] mx-auto mb-4" />
                                        
                                        {searchQuery ? (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events found for "{searchQuery}"</h3>
                                                <p className="text-gray-500 mb-6">Try different keywords or check your spelling.</p>
                                                <button
                                                    onClick={clearSearch}
                                                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium mr-3 cursor-pointer"
                                                >
                                                    Clear Search
                                                </button>
                                            </>
                                        ) : (appliedMonths.length > 0 || appliedYear) ? (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events match your filters</h3>
                                                <p className="text-gray-500 mb-6">Try adjusting your filters or clearing them to see more results.</p>
                                                <button
                                                    onClick={() => {
                                                        setAppliedMonths([]);
                                                        setSelectedMonths([]);
                                                        setAppliedYear("");
                                                        setSelectedYear("");
                                                    }}
                                                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium mr-3 cursor-pointer"
                                                >
                                                    Clear Filters
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events found</h3>
                                                <p className="text-gray-500 mb-6">There are currently no event listings available.</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Display events */
                                <div className="flex justify-center w-full overflow-x-hidden mb-25 pr-4 pl-2 pb-10">
                                    <div className="w-full max-w-8xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {events.map(event => (
                                                <div key={event._id} className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
                                                    <Link to={`/event-details/${event._id}`}>
                                                        <img
                                                            src={
                                                            event?.files?.[0]?.serverFilename
                                                                ? `http://localhost:5050/uploads/${event.files[0].serverFilename}`
                                                                : default_eventbg
                                                            }
                                                            alt={event.event_name}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    </Link>

                                                    <div className="p-4 flex flex-col h-full">
                                                        {/* Bookmark button */}
                                                        <div className="flex justify-end mb-2">
                                                            <button
                                                                onClick={() => toggleBookmark(event._id)}
                                                                title={bookmarkedIds.includes(event._id) ? "Remove Bookmark" : "Bookmark"}
                                                                className="p-2 rounded-full transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 cursor-pointer"
                                                            >
                                                                <BookmarkIcon className={`w-6 h-6 ${bookmarkedIds.includes(event._id) ? "text-emerald-600" : "opacity-50"}`} /> 
                                                            </button>
                                                        </div>
                                                        <h2 className="text-xl font-semibold mb-1 line-clamp-1">{event.event_name}</h2>
                                                        <p className="text-sm text-gray-500 mb-2 flex items-center space-x-1 line-clamp-1">
                                                            <FaLocationDot className="text-gray-500" />
                                                            <span className="line-clamp-1">{event.venue}</span>
                                                        </p>
                                                        <p className="text-gray-700 flex-grow mb-3 line-clamp-2">{event.event_description}</p>
                                                        <p className="text-sm text-right text-gray-500">
                                                            {new Date(event.event_date).toLocaleDateString('en-US', {
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