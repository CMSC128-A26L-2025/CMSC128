// import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Search icon

export default function Navbar_search({ searchTerm, setSearchTerm }) {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="bg-white w-full py-2 fixed top-0 left-0 shadow-md z-10">
      <div className="relative container mx-auto flex items-center h-16 px-4">
        <a href="/" className="mb-2">
          <img src="src/assets/uplblogo.png" className="bg-none w-40 h-auto" alt="UPLB Logo" />
        </a>

        <div className="flex-1 flex justify-center">
          <form onSubmit={handleSearch} className="relative w-[600px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="☰   Enter the name"
              className="w-full pr-10 pl-4 border border-gray-400 rounded-full px-3 py-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </form>
        </div>
      </div>
    </nav>
  );
}

// import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Search icon

export default function Navbar_search({ searchTerm, setSearchTerm }) {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="bg-white w-full py-2 fixed top-0 left-0 shadow-md z-10">
      <div className="relative container mx-auto flex items-center h-16 px-4">
        <a href="/" className="mb-2">
          <img src="src/assets/uplblogo.png" className="bg-none w-40 h-auto" alt="UPLB Logo" />
        </a>

        <div className="flex-1 flex justify-center">
          <form onSubmit={handleSearch} className="relative w-[600px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="☰   Enter the name"
              className="w-full pr-10 pl-4 border border-gray-400 rounded-full px-3 py-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </form>
        </div>
      </div>
    </nav>
  );
}
