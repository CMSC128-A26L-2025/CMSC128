import { useState, useMemo } from "react";
import Navbar_search from "../Navbar_Search";

const dummyAccounts = [
  { id: 1, email: "alice.santos@example.com", name: "Alice Santos", type: "Admin" },
  { id: 4, email: "benji.torres@example.org", name: "Benji Torres", type: "User" },
  { id: 5, email: "camille_ruz@example.net", name: "Camille Ruz", type: "Admin" },
  { id: 3, email: "david.khoo@example.com", name: "David Khoo", type: "User" },
  { id: 2, email: "elena_matsuda@example.co", name: "Elena Matsuda", type: "User" },
];

export const Results_page_accounts = () => {
    return (
        <>
            <Navbar_search searchTerm={searchTerm} setSearchTerm={setSearchTerm} user_id={user_id} /> {/* Use Navbar_search */}

            <div className="w-screen min-h-screen bg-gray-200 pt-24"> {/* Adjusted padding */}
                {/* Header Row */}
                <div className="w-full h-16 bg-[#891839] text-white grid grid-cols-4 justify-center items-center px-6">                        
                    <p>Email</p>
                    <p>Name</p>
                    <p>Account Type</p>
                    <p>Actions</p>
                </div>
                {/* Header Row */}   
                    {/* Account Display */}
                    <div className="w-full h-full">
                    {dummyAccounts.map((Account) => (
                        <div key={Account.id} className="grid grid-cols-4 p-4 text-center text-black border-b border-gray-300">
                            <p>{Account.email}</p>
                            <p>{Account.name}</p>
                            <p>{Account.type}</p>
                            <div className="flex justify-center items-center">
                                {Account.type === "Admin" ? (
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
                    ))}
                    </div>
                    {/* Account Display */}     
            </div>
        </>
    )
}