import { useState } from "react";
import { Link } from "react-router-dom";
import speakerIcon from '../assets/Speaker_Icon.svg';
import Notification from "./notification";

import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";
export default function Navbar_admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title:"",
    read:false,
    description:"",
  })

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const handleSend=(e)=>{
    
    // await send= NULL;
    const send=0; //temporary var
    if (send.success){ // Successful sending
      console.log("Successfully sent to all users");
      setIsOpen(false);
    }else{ //Sending Failed

    }
    // setIsOpen(false); Remove after implementing the proper backend stuff
  }
  return (
    <nav className="bg-white w-full py-1 fixed top-0 left-0 z-50">
      {/* Flexbox for proper alignment */}
      <div className="container flex justify-between items-center py-1 px-4">
        {/* Left - Logo */}
        <a href="/">
          <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
        </a>
        {/* Modal for Sending An Announcement */}
        {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className=" relative bg-white rounded-xl p-6 w-[60vw] h-[80vh]  shadow-lg flex flex-col">
            <h2 className="text-7xl font-bold text-emerald-800 text-start  ">Announcement</h2>
            <p className="text-black text-start">Send announcement to everybody</p>
            {/* https://flowbite.com/docs/forms/textarea/ Text Area */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-emerald-800 text-start">Title</h2>
             
              <textarea 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}

              rows="1" id="message" class="block p-2.5 mb-5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none"
              placeholder="Title"></textarea>
            
              <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              id="message" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[40vh]"
              placeholder="Write your message here..."></textarea>
            </div>
            {console.log(formData)}
            <div className="grid grid-cols-2 absolute bottom-4 right-4 gap-x-4">
              {/* Cancel */}
              <button 
              onClick={()=>setIsOpen(false)}
              className=" bg-[#891839] text-white px-4 py-2 rounded w-[150px] hover:bg-red-700">
              Cancel
              </button>
              {/* Submit */}
              <button 
              onClick={handleSend}
              className=" bg-emerald-800 text-white px-4 py-2 rounded hover:bg-green-700">
              Send
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Right - Make an Announcement, Notification & Profile Icons */}
        <div className="absolute top-1 right-4 flex items-center space-x-5">
            <button onClick={()=>setIsOpen(true)}
            className="bg-[#891839] rounded-lg pr-5 pl-2 py-1 font-semibold text-left text-sm flex justify-center h-12">
                <img src={speakerIcon} className="w-10 h-10 py-1"></img>
                <div className="pl-5">
                Make an <br></br> Announcement
                </div>
            </button>
            {/* Notification Icon */}   
            <a href="/">
                <img src={notifications} className="w-10 h-10" alt="Notifications" />
            </a>

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
                    to={`/`}
                    className="block w-full px-4 py-2 !text-gray-700 hover:bg-blue-100 focus:!outline-none"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    // onClick={}
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
  );
}
