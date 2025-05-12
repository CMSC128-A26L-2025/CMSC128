
import Navbar_search from "../Navbar_Search";
import { useState, useMemo } from "react";
import Sidebar from "../Sidebar";

export const Results_page_accounts = () => {
    const dummyAccounts = [
        { id: 1, email: "alice.santos@example.com", name: "Alice Santos", type: "Admin" },
        { id: 4, email: "benji.torres@example.org", name: "Benji Torres", type: "User" },
        { id: 5, email: "camille_ruz@example.net", name: "Camille Ruz", type: "Admin" },
        { id: 3, email: "david.khoo@example.com", name: "David Khoo", type: "User" },
        { id: 2, email: "elena_matsuda@example.co", name: "Elena Matsuda", type: "User" },
      ];
      const [searchTerm, setSearchTerm] = useState("");
      const filteredAccounts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return dummyAccounts.filter(
          (acc) =>
            acc.name.toLowerCase().includes(term) ||
            acc.email.toLowerCase().includes(term)
        );
      }, [searchTerm]);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    return (
    <>
        <Navbar_search searchTerm={searchTerm} setSearchTerm={setSearchTerm} toggleSidebar={toggleSidebar} />
        <div
            className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <Sidebar/>
        </div>
        
        <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
            <div className="w-screen h-screen bg-gray-200 pt-20">
            
            {/* Header Row */}
            <div className="w-full h-16 bg-red-900 text-white grid grid-cols-4 justify-center items-center px-6">
            <p>Email</p>
            <p>Name</p>
            <p>Actions</p>
            </div>
            {/* Account Display */}
                <div className="w-full h-full">
                {filteredAccounts.map((account) => (
                    <div
                    key={account.id}
                    className="grid grid-cols-4 p-4 text-center text-black border-b border-gray-300"
                    >
                    <p>{account.email}</p>
                    <p>{account.name}</p>
                    </div>
                ))}
                </div>
            </div>
      </div>
    </>
    )
}