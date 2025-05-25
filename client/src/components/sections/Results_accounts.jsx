import { useState, useEffect } from "react";
import { TbMoodEmpty } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { TbZoomQuestion } from "react-icons/tb";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import Sidebar from "../Sidebar";
import eventgrad from "../../assets/eventgrad1.jpg";

export const Results_page_accounts = () => {
  const { authAxios, user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [accountCount, setAccountCount] = useState(0);

  // filter states
  const [selectedGradYearRange, setSelectedGradYearRange] = useState({ start: "", end: "" });
  const [appliedGradYearRange, setAppliedGradYearRange] = useState({ start: "", end: "" });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [appliedSkills, setAppliedSkills] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [appliedJobTitle, setAppliedJobTitle] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [appliedDegree, setAppliedDegree] = useState("");

  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]);
  const [availableDegrees, setAvailableDegrees] = useState([]);

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "name_asc", label: "Name: A-Z" },
    { value: "name_desc", label: "Name: Z-A" },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setIsSortOpen(false);
  };

  const toggleSort = () => setIsSortOpen((prev) => !prev);

  const toggleFilter = () => {
    if (!isFilterOpen) {
      setSelectedGradYearRange({ ...appliedGradYearRange });
      setSelectedSkills([...appliedSkills]);
      setSelectedLocation(appliedLocation);
      setSelectedJobTitle(appliedJobTitle);
      setSelectedDegree(appliedDegree);
    }
    setIsFilterOpen((prev) => !prev);
  };

  const clearFilters = () => {
    setSelectedGradYearRange({ start: "", end: "" });
    setSelectedSkills([]);
    setSelectedLocation("");
    setSelectedJobTitle("");
    setSelectedDegree("");
  };

  const applyFilters = () => {
    setAppliedGradYearRange({ ...selectedGradYearRange });
    setAppliedSkills([...selectedSkills]);
    setAppliedLocation(selectedLocation);
    setAppliedJobTitle(selectedJobTitle);
    setAppliedDegree(selectedDegree);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const getFilteredAccountCount = () => {
    let filteredAccounts = [...allAccounts];
    
    if (selectedGradYearRange.start || selectedGradYearRange.end) {
      filteredAccounts = filteredAccounts.filter(account => {
        const gradYear = account.graduationYear || new Date(account.endYear).getFullYear();
        const start = selectedGradYearRange.start ? parseInt(selectedGradYearRange.start) : 0;
        const end = selectedGradYearRange.end ? parseInt(selectedGradYearRange.end) : 9999;
        return gradYear >= start && gradYear <= end;
      });
    }
    
    if (selectedSkills.length > 0) {
      filteredAccounts = filteredAccounts.filter(account =>
        selectedSkills.some(skill => 
          account.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
    
    if (selectedLocation) {
      filteredAccounts = filteredAccounts.filter(account =>
        account.address?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    
    if (selectedJobTitle) {
      filteredAccounts = filteredAccounts.filter(account =>
        account.current_job_title?.toLowerCase().includes(selectedJobTitle.toLowerCase())
      );
    }
    
    if (selectedDegree) {
      filteredAccounts = filteredAccounts.filter(account =>
        account.degree?.toLowerCase().includes(selectedDegree.toLowerCase())
      );
    }
    
    return filteredAccounts.length;
  };

  const getTotalFilterCount = () => {
    let count = 0;
    if (appliedGradYearRange.start || appliedGradYearRange.end) count += 1;
    if (appliedSkills.length > 0) count += appliedSkills.length;
    if (appliedLocation) count += 1;
    if (appliedJobTitle) count += 1;
    if (appliedDegree) count += 1;
    return count;
  };

  // sorting, filtering, and searching
  const applySortingFilteringAndSearching = (accountsToProcess) => {
    let processedAccounts = [...accountsToProcess];

    // search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      processedAccounts = processedAccounts.filter(account =>
        account.name?.toLowerCase().includes(query) ||
        account.email?.toLowerCase().includes(query) ||
        account.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // graduation year range filter
    if (appliedGradYearRange.start || appliedGradYearRange.end) {
      processedAccounts = processedAccounts.filter(account => {
        const gradYear = account.graduationYear || new Date(account.endYear).getFullYear();
        const start = appliedGradYearRange.start ? parseInt(appliedGradYearRange.start) : 0;
        const end = appliedGradYearRange.end ? parseInt(appliedGradYearRange.end) : 9999;
        return gradYear >= start && gradYear <= end;
      });
    }

    // skills filter
    if (appliedSkills.length > 0) {
      processedAccounts = processedAccounts.filter(account =>
        appliedSkills.some(skill => 
          account.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // location filter
    if (appliedLocation) {
      processedAccounts = processedAccounts.filter(account =>
        account.address?.toLowerCase().includes(appliedLocation.toLowerCase())
      );
    }

    // job title filter
    if (appliedJobTitle) {
      processedAccounts = processedAccounts.filter(account =>
        account.current_job_title?.toLowerCase().includes(appliedJobTitle.toLowerCase())
      );
    }

    // degree filter
    if (appliedDegree) {
      processedAccounts = processedAccounts.filter(account =>
        account.degree?.toLowerCase().includes(appliedDegree.toLowerCase())
      );
    }

    // sorting
    if (sortBy === "name_asc") {
      processedAccounts.sort((a, b) => a.name?.localeCompare(b.name) || 0);
    } else if (sortBy === "name_desc") {
      processedAccounts.sort((a, b) => b.name?.localeCompare(a.name) || 0);
    }

    return processedAccounts;
  };

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.get("/alumni/search");
      console.log(response);

      const accountsData = Array.isArray(response.data) ? response.data : [];
      setAllAccounts(accountsData);
      
      const skills = [...new Set(accountsData.flatMap(acc => acc.skills || []))];
      const locations = [...new Set(accountsData.map(acc => acc.address).filter(Boolean))];
      const jobTitles = [...new Set(accountsData.map(acc => acc.current_job_title).filter(Boolean))];
      const degrees = [...new Set(accountsData.map(acc => acc.degree).filter(Boolean))];
      
      setAvailableSkills(skills);
      setAvailableLocations(locations);
      setAvailableJobTitles(jobTitles);
      setAvailableDegrees(degrees);

      const processedAccounts = applySortingFilteringAndSearching(accountsData);
      setAccounts(processedAccounts);
      setAccountCount(processedAccounts.length);
    } catch (err) {
      console.error("Error fetching alumni data:", err);
      setError("Failed to fetch alumni data. Please try again.");
      setAccounts([]);
      setAccountCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // handle sorting, filtering, and searching changes
  useEffect(() => {
    if (allAccounts.length > 0) {
      const processedAccounts = applySortingFilteringAndSearching(allAccounts);
      setAccounts(processedAccounts);
      setAccountCount(processedAccounts.length);
    }
  }, [sortBy, appliedGradYearRange, appliedSkills, appliedLocation, appliedJobTitle, appliedDegree, searchQuery, allAccounts]);

  const scrollbarStyle = {
    maxHeight: '24rem',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#891839 transparent'
  };

  return (
    <>
      <div className="fixed top-0 w-full z-100">
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

        {loading ? (
          <Loading />
        ) : allAccounts.length === 0 ? (
          <div className="min-w-screen min-h-screen bg-gray-100 px-10 py-20 pb-30 flex flex-col justify-center items-center text-6xl text-red-800 font-extrabold">
            <TbMoodEmpty className="w-24 h-24 text-gray-400 mb-4" />
            No accounts found.
          </div> 
        ) : (
          <div className="pt-1">
            <div
              className="relative bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 pt-15 w-full h-[35vh]"
              style={{
                backgroundImage: `url(${eventgrad})`,
                backgroundPosition: "top",
              }}
            >
              <div className="absolute inset-0 bg-gray-600 opacity-50 z-0"></div>
              <div className="relative z-10 w-full flex items-center justify-between">
                <div className="mt-12">
                  <h2 className="text-4xl lg:text-5xl text-white font-semibold pl-10">
                    Alumni
                  </h2>
                  <div className="text-lg text-white font-medium pl-10 mt-1 flex items-center space-x-2">
                    <TbUsers className="text-lg" />
                    <span>{accountCount.toLocaleString()} alumni</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full min-w-screen min-h-screen bg-gray-100 px-15 lg:px-25 pt-15 flex flex-col items-center">
              <div className="container flex flex-col items-start space-y-8 text-black text-left">
                
                {/* Search Bar */}
                <div className="w-full flex justify-center mb-6">
                  <div className="relative w-full max-w-2xl">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#891839]" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or skills..."
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
                        {accounts.length > 0 ? (
                          <span>Found {accounts.length} alumni matching "{searchQuery}"</span>
                        ) : (
                          <span>No alumni found matching "{searchQuery}"</span>
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
                              sortBy === option.value ? 'bg-red-50 text-[#891839]' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 pr-4">
                    {/* Filter */}
                    <div className="relative">
                      <button 
                        onClick={toggleFilter}
                        className="cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                      >
                        {getTotalFilterCount() > 0 || isFilterOpen ? (
                          <TbFilterFilled className="w-6 h-6 text-[#891839]" />
                        ) : (
                          <TbFilter className="w-6 h-6 text-gray-600" />
                        )}
                        <span className="text-md font-medium">
                          Filter {getTotalFilterCount() > 0 && `(${getTotalFilterCount()})`}
                        </span>
                      </button>

                      {isFilterOpen && (
                        <div className="absolute top-full right-0 mt-1 w-[20rem] sm:w-[28rem] xs:w-[20rem] bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-w-[calc(100vw-2rem)] sm:max-w-none">
                          <div className="p-4 sm:p-6 max-h-[32rem] overflow-y-auto" style={scrollbarStyle}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filters</h3>
                              <button
                                onClick={clearFilters}
                                className="text-[#891839] hover:text-red-700 font-medium text-sm cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>

                            {/* Graduation Year Range */}
                            <div className="mb-4 sm:mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Graduation Year</label>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <input
                                  type="number"
                                  placeholder="From"
                                  value={selectedGradYearRange.start}
                                  onChange={(e) => setSelectedGradYearRange({...selectedGradYearRange, start: e.target.value})}
                                  className="w-full sm:flex-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#891839] focus:border-transparent"
                                />
                                <input
                                  type="number"
                                  placeholder="To"
                                  value={selectedGradYearRange.end}
                                  onChange={(e) => setSelectedGradYearRange({...selectedGradYearRange, end: e.target.value})}
                                  className="w-full sm:flex-1 p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#891839] focus:border-transparent"
                                />
                              </div>
                            </div>

                            {/* Degree */}
                            <div className="mb-4 sm:mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Degree</label>
                              <select
                                value={selectedDegree}
                                onChange={(e) => setSelectedDegree(e.target.value)}
                                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#891839] focus:border-transparent cursor-pointer"
                              >
                                <option value="">All Degrees</option>
                                {availableDegrees.map((degree) => (
                                  <option key={degree} value={degree}>{degree}</option>
                                ))}
                              </select>
                            </div>

                            {/* Job Title */}
                            <div className="mb-4 sm:mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Current Job Title</label>
                              <select
                                value={selectedJobTitle}
                                onChange={(e) => setSelectedJobTitle(e.target.value)}
                                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#891839] focus:border-transparent cursor-pointer"
                              >
                                <option value="">All Job Titles</option>
                                {availableJobTitles.map((title) => (
                                  <option key={title} value={title}>{title}</option>
                                ))}
                              </select>
                            </div>

                            {/* Location */}
                            <div className="mb-4 sm:mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Location</label>
                              <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#891839] focus:border-transparent cursor-pointer"
                              >
                                <option value="">All Locations</option>
                                {availableLocations.map((address) => (
                                  <option key={address} value={address}>{address}</option>
                                ))}
                              </select>
                            </div>

                            {/* Skills */}
                            <div className="mb-4 sm:mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Skills</label>
                              <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 sm:p-3">
                                <div className="space-y-2">
                                  {availableSkills.map((skill) => {
                                    const isSelected = selectedSkills.includes(skill);
                                    return (
                                      <label
                                        key={skill}
                                        className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded hover:bg-gray-50 cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedSkills.includes(skill)}
                                          onChange={() => handleSkillToggle(skill)}
                                          className="peer hidden"
                                        />
                                        <div
                                          className={`w-4 h-4 flex items-center justify-center border rounded ${
                                            isSelected
                                              ? 'bg-[#891839] border-[#891839]'
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
                                        <span className="text-sm text-gray-700 flex-1 break-words">{skill}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                              {selectedSkills.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                                </div>
                              )}
                            </div>

                            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                              <button
                                onClick={applyFilters}
                                className="w-full bg-[#891839] text-white py-2 sm:py-3 px-4 rounded-md hover:bg-[#891825] transition-colors font-medium cursor-pointer text-sm sm:text-base"
                              >
                                Show {getFilteredAccountCount()} alumni
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {accounts.length === 0 ? (
                  <div className="flex justify-center w-full mt-20 mb-35">
                    <div className="text-center">
                      <TbZoomQuestion className="w-18 h-18 text-[#891839] mx-auto mb-4" />
                      
                      {searchQuery ? (
                        <>
                          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No alumni found for "{searchQuery}"</h3>
                          <p className="text-gray-500 mb-6">Try different keywords or check your spelling.</p>
                          <button
                            onClick={clearSearch}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium mr-3 cursor-pointer"
                          >
                            Clear Search
                          </button>
                        </>
                      ) : (getTotalFilterCount() > 0) ? (
                        <>
                          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No alumni match your filters</h3>
                          <p className="text-gray-500 mb-6">Try adjusting your filters or clearing them to see more results.</p>
                          <button
                            onClick={() => {
                              setAppliedGradYearRange({ start: "", end: "" });
                              setSelectedGradYearRange({ start: "", end: "" });
                              setAppliedSkills([]);
                              setSelectedSkills([]);
                              setAppliedLocation("");
                              setSelectedLocation("");
                              setAppliedJobTitle("");
                              setSelectedJobTitle("");
                              setAppliedDegree("");
                              setSelectedDegree("");
                            }}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium mr-3 cursor-pointer"
                          >
                            Clear Filters
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No alumni found</h3>
                          <p className="text-gray-500 mb-6">There are currently no alumni profiles available.</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Display accounts */
                  <div className="flex justify-center w-full overflow-x-hidden mb-25 pr-4 pl-2 pb-10">
                    <div className="w-full max-w-8xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account, index) => (
                          <div
                            key={account._id || index}
                            onClick={() => {
                              window.location.href = `/profile/${account._id}`;
                            }}
                            className="bg-white rounded-3xl shadow-md p-4 flex items-start border border-transparent hover:border-blue-400 transition duration-300 cursor-pointer h-40"
                          >
                            <img
                              src={account.imageUrl || (account?.files?.[0]?.serverFilename && `http://localhost:5050/uploads/${account?.files[0].serverFilename}`) || `https://i.pravatar.cc/100?img=${index + 1}`}
                              alt={account.name}
                              className="w-16 h-16 rounded-full object-cover mr-4 flex-shrink-0"
                            />
                            <div className="text-left flex-1 min-w-0 h-full flex flex-col justify-start">
                              <h2 className="text-md text-gray-800 font-semibold break-words line-clamp-1 mb-1">
                                {account.name || 'No Name'}
                              </h2>
                              
                              <p className="text-sm text-gray-600 break-words line-clamp-1 mb-2">
                                {account.email || 'No Email'}
                              </p>
                              
                              {account.current_job_title && (
                                <p className="text-xs text-gray-500 break-words line-clamp-1 mb-2">
                                  {account.current_job_title}
                                </p>
                              )}
                              
                              {account.address && (
                                <p className="text-xs text-gray-500 break-words flex items-center mb-2 line-clamp-1">
                                  <FaLocationDot className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{account.address}</span>
                                </p>
                              )}

                              <div className="flex flex-wrap gap-1 mt-auto">
                                {(account.skills || [])
                                  .slice(0, 2)
                                  .map((skill, i) => (
                                    <span
                                      key={`skill-${i}`}
                                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full truncate max-w-20"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {(account.skills || []).length > 2 && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                                    +{(account.skills || []).length - 2}
                                  </span>
                                )}
                              </div>
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