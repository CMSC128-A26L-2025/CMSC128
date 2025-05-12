

import Navbar_search from "../Navbar_Search";
// import { useState, useMemo } from "react";
import Sidebar from "../Sidebar";


import { useState, useEffect } from "react";
import Navbar_search from "../Navbar_Search"; // Import Navbar_search
import Navbar from "../header";
import Footer from "../footer";
import { useAuth } from "../../AuthContext";
import Sidebar from "../Sidebar";
export const Results_page_accounts = () => {
  const {authAxios, user} = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  // Retrieve the current user's ID from localStorage or context
  const userId = localStorage.getItem("userId"); // Assuming the user ID is stored in localStorage

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        name: searchTerm,
        degree: filters.degree || "",
        startYear: filters.startYear || "",
        endYear: filters.endYear || "",
        current_job_title: filters.jobTitle || "",
        company: filters.company || "",
        skills: filters.skills?.join(",") || "",
      };

      const response = await authAxios.get("/alumni/search", {
        params: queryParams,
      });

      console.log(response);

      setAccounts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching alumni data:", err);
      setError("Failed to fetch alumni data. Please try again.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [searchTerm, filters]);

  return (
    <>
      <Navbar_search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setFilters={setFilters}
        user_id={1}
      />
      <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
         <Sidebar/>
      </div>
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
      <div className="w-screen min-h-screen bg-gray-200 pt-13">
        <div className="w-full h-full px-6 py-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : accounts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account, index) => (
                <div
                  key={account.id || index}
                  className="bg-white rounded-3xl shadow-md p-4 flex items-center border border-transparent hover:border-blue-400 transition duration-300"
                >
                  <img
                    src={account.imageUrl || `https://i.pravatar.cc/100?img=${index + 1}`}
                    alt={account.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    {/* Name and Email of the account */}
                    <h2 className="text-md text-gray-800 font-semibold">{account.name}</h2>
                    <p className="text-sm text-gray-600">{account.email}</p>
                    
                    {/* For skills of the account */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(account.skills || [])
                        .slice(0, 4)
                        .map((skill, i) => (
                          <span
                            key={`skill-${i}`}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>


                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>
      </div>
      </div>
    </>
  );
};
