import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./notification";

import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Search icon
import { Range } from "react-range"; // Import react-range

const GRADUATION_YEAR_MIN = 1900;
const GRADUATION_YEAR_MAX = 2025;

export default function Navbar_search({ searchTerm, setSearchTerm,toggleSidebar }) {
  const [notification_modal, setnotification_modal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    startYear: GRADUATION_YEAR_MIN,
    endYear: GRADUATION_YEAR_MAX,
    degree: "",
    jobTitle: "",
    location: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  
  const handleRangeChange = (values) => {
    setFilters({ ...filters, startYear: values[0], endYear: values[1] });
  };


  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      startYear: GRADUATION_YEAR_MIN,
      endYear: GRADUATION_YEAR_MAX,
      degree: "",
      jobTitle: "",
      location: "",
      skills: [],
    });
  };

  return (
    <div>
      {notification_modal && (
        <div>
          <Notification setVisible={setnotification_modal}></Notification>
        </div>
      )}
      <nav className="bg-white w-full py-1 fixed top-0 left-0 z-60 shadow-md">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <div className="flex">
              <a
              href="#"
                onClick={toggleSidebar}
                className="flex justify-center items-center  !text-black pr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                
              </a>
                {/* Left - Logo */}
              <Link to={`/home`}>
                <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
              </Link>
            </div>
          
          {/* Middle - Search Bar */}
          <div className="flex-1 flex justify-center" style={{ marginLeft: '200px' }}>
          <form onSubmit={handleSearch} className="relative w-[600px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter the name"
              className="w-full pr-10 pl-10 border border-gray-400 rounded-full px-3 py-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            {/* Hamburger Icon or Up Arrow */}
            <span
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-xl"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              {filterMenuOpen ? "▲" : "☰"} {/* Change icon based on filterMenuOpen */}
            </span>
          </form>
          </div>

          {/* Right - Notification & Profile Icons */}
          <div className="absolute top-2 right-4 flex items-center space-x-4">
            {/* Notification Icon */}
            <div
              onClick={() => {
                setnotification_modal(true);
              }}
              className="cursor-pointer"
            >
              <img src={notifications} className="w-10 h-10" alt="Notifications" />
            </div>

            {/* Profile Icon inside Circle */}
            <div className="relative">
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 bg-none flex items-center justify-center rounded-full cursor-pointer"
              >
                <img src={humanIcon} className="w-10 h-10" alt="Profile" />
              </div>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-sm w-35 z-50 text-center text-sm border border-gray-400">
                  <Link
                    to={`/`}
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-blue-100 focus:outline-none"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-[#891839] hover:text-white focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Popup */}
      {filterMenuOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-6 z-30 w-[700px]">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 text-left">Filter</h3>

          {/* Graduation Year and Skills in one row */}
          <div className="flex gap-6 mb-6 text-left">
            {/* Graduation Year */}
            <div className="w-1/2">
              <label className="block text-lg font-medium mb-2 text-gray-700">Graduation Year</label>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.startYear}</span>
                  <span>{filters.endYear}</span>
                </div>
                <Range
                  step={1}
                  min={GRADUATION_YEAR_MIN}
                  max={GRADUATION_YEAR_MAX}
                  values={[filters.startYear, filters.endYear]}
                  onChange={handleRangeChange}
                  renderTrack={({ props, children }) => {
                    const { key, ...restProps } = props; // Extract the key
                    return (
                      <div
                        key={key} // Pass the key explicitly
                        {...restProps}
                        className="h-2 bg-gray-300 rounded-md"
                        style={{
                          ...restProps.style,
                          width: "100%",
                        }}
                      >
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props }) => {
                    const { key, ...restProps } = props; // Extract the key
                    return (
                      <div
                        key={key} // Pass the key explicitly
                        {...restProps}
                        className="h-4 w-4 bg-[#891839] rounded-full shadow-md"
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Skills Input and Tags */}
            <div className="w-1/2">
              <label className="block text-lg font-medium mb-2 text-gray-700">Skills</label>
              <input
                type="text"
                name="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && skillInput.trim()) {
                    e.preventDefault();
                    if (!filters.skills.includes(skillInput.trim())) {
                      setFilters({
                        ...filters,
                        skills: [...filters.skills, skillInput.trim()],
                      });
                    }
                    setSkillInput("");
                  }
                }}
                placeholder="Add more skills"
                className="w-full border border-gray-400 rounded-md px-2 py-1"
              />
              {filters.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            skills: filters.skills.filter((_, i) => i !== index),
                          })
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dropdowns in one row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700 text-left">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border border-gray-400 rounded-md px-2 py-1 text-gray-800"
              >
                <option value="">Select Location</option>
                <option value="Laguna">Laguna</option>
                <option value="Metro Manila">Metro Manila</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700 text-left">Current Job Title</label>
              <select
                name="jobTitle"
                value={filters.jobTitle}
                onChange={handleFilterChange}
                className="w-full border border-gray-400 rounded-md px-2 py-1 text-gray-800"
              >
                <option value="">Select Job Title</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700 text-left">Degree</label>
              <select
                name="degree"
                value={filters.degree}
                onChange={handleFilterChange}
                className="w-full border border-gray-400 rounded-md px-2 py-1 text-gray-800"
              >
                <option value="">Select Degree</option>
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Information Technology">BS Information Technology</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-gray-600 hover:text-black"
            >
              CLEAR SELECTION
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#00573F] text-white rounded-full hover:bg-green-700 font-semibold"
            >
              APPLY FILTER
            </button>
          </div>
        </div>
      )}

    </div>
  );
}