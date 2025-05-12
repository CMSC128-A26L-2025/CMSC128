import { useState, useMemo } from "react";
import Navbar_search from "../Navbar_Search";


export const Results_page_accounts_admin = () => {
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

  

  return (
    <>
      <Navbar_search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="w-screen min-h-screen bg-gray-200 pt-20">
        {/* Header Row */}
        <div className="w-full h-16 bg-red-900 text-white grid grid-cols-4 justify-center items-center px-6">
          <p>Email</p>
          <p>Name</p>
          <p>Account Type</p>
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
              <p>{account.type}</p>
              <div className="flex justify-center items-center">
                <button className="w-30 bg-red-600 text-white text-sm py-1 rounded-full hover:bg-red-700 transition">Ban
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
