import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./notification";
import { useAuth } from "../auth/AuthContext";

import uplbLogo from "/assets/uplblogo.png";
import notifications from "/assets/notifications.png";
import humanIcon from "/assets/Human Icon.png";

export default function Navbar({toggleSidebar,}) {
  const  [notification_modal, setnotification_modal] = useState(false)
  const  [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async (e) => {
    await logout();
  }

  return (
   <div>
      {notification_modal &&(
        <div>
          <Notification setVisible={setnotification_modal}></Notification>
        </div>
      )}
       <nav className="bg-white w-full py-1 fixed top-0 left-0 z-60">
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
              <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" draggable="false" />
            </Link>
          </div>

          {/* Right - Notification & Profile Icons */}
          <div className="absolute top-2 right-4 flex items-center space-x-4">
            {/* Notification Icon */}
            <div 
            onClick={()=>{
              setnotification_modal(true)
            }
            }
            className="cursor-pointer"
            >
              <img src={notifications} className="w-10 h-10" draggable="false" alt="Notifications" />
            </div>

            {/* Profile Icon inside Circle */}
            <div className="relative">
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 bg-none flex items-center justify-center rounded-full cursor-pointer"
              >
                <img src={humanIcon} className="w-10 h-10" draggable="false" alt="Profile" />
              </div>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1 bg-white !shadow-lg rounded-sm w-35 z-50 text-center text-sm border border-gray-400">
                  <Link
                    to={`/profile`}
                    className="block w-full px-4 py-2 !text-gray-700 hover:bg-blue-100 focus:!outline-none"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 !text-gray-700 hover:bg-[#891839] hover:!text-white focus:!outline-none cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
   </div>
  );
}