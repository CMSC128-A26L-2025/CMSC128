import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./notification";
import { useAuth } from "../AuthContext";

import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";

export default function Navbar({user_id}) {
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
       <nav className="bg-white w-full py-1 fixed top-0 left-0 z-20">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <Link to={`/home`}>
            <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
          </Link>

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
                    className="block w-full px-4 py-2 !text-gray-700 hover:bg-[#891839] hover:!text-white focus:!outline-none"
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