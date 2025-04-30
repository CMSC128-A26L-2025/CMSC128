import { useState, useEffect } from "react";
import Navbar_search from "../Navbar_Search"; // Import Navbar_search
import axios from "axios"; // Import axios for API calls

export const Results_page_accounts = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filters, setFilters] = useState({}); // State for filters from Navbar_search
  const [accounts, setAccounts] = useState([]); // State for accounts data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch alumni data from the backend
  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const queryParams = {
        name: searchTerm,
        degree: filters.degree || "",
        startYear: filters.startYear || "", // Pass startYear
        endYear: filters.endYear || "", // Pass endYear
        current_job_title: filters.jobTitle || "",
        company: filters.company || "",
        skills: filters.skills?.join(",") || "",
      };
  
      console.log("Query Parameters:", queryParams); // Debug query parameters
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alumni/search`, { params: queryParams });
  
      console.log("API Response:", response.data); // Debug API response
  
      setAccounts(Array.isArray(response.data) ? response.data : []); // Ensure accounts is always an array
    } catch (err) {
      console.error("Error fetching alumni data:", err);
      setError("Failed to fetch alumni data. Please try again.");
      setAccounts([]); // Reset accounts to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever searchTerm or filters change
  useEffect(() => {
    fetchAlumni();
  }, [searchTerm, filters]);

  return (
    <>
      {/* Add Navbar_search */}
      <Navbar_search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setFilters={setFilters} // Pass setFilters to update filters
        user_id={1}
      />

      <div className="w-screen min-h-screen bg-gray-200 pt-13">
        {/* Header Row */}
        <div className="w-full h-16 bg-red-900 text-white grid grid-cols-4 justify-center items-center px-6">
          <p>Email</p>
          <p>Name</p>
          <p>Account Type</p>
          <p>Actions</p>
        </div>
        {/* Header Row */}
        {/* Account Display */}
        <div className="w-full h-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : accounts.length > 0 ? (
            accounts.map((account, index) => (
                <div
                  key={account.id || index} // This is where the key is being set
                  className="grid grid-cols-4 p-4 text-center text-black border-b border-gray-300"
                >
                  <p>{account.email}</p>
                  <p>{account.name}</p>
                  <p>{account.type || "User"}</p>
                  <div className="flex justify-center items-center">
                    {account.type === "Admin" ? (
                      <button className="w-30 bg-red-600 text-white text-sm py-1 rounded-full hover:bg-red-700 transition">
                        Report
                      </button>
                    ) : (
                      <button className="w-30 bg-red-600 text-white text-sm py-1 rounded-full hover:bg-red-700 transition">
                        Ban
                      </button>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>
        {/* Account Display */}
      </div>
    </>
  );
};