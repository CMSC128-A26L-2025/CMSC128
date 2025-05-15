import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import speakerIcon from '/assets/Speaker_Icon.svg';
import Notification from "./notification";
import { useNavigate } from 'react-router-dom'
import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";
import { useAuth } from "../auth/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";

import axios from "axios";
export default function Navbar_admin({toggleSidebar}) {
  const { authAxios, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const  [notification_modal, setnotification_modal] = useState(false)
  const [announcementModal, setAnnouncementModal] = useState(false);
  const [formData, setFormData] = useState({
    type:"announcement",
    title:"",
    read:false,
    content:"",
    posted_by:user?._id
  })

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const handleSend=async (e)=>{
    try{
      const res = await axios.post(`${apiUrl}/announcement/create`, formData);
      console.log("Successfully sent to all users");
      setIsOpen(false);
    }
    catch(err){
      console.error("Error creating announcement", err);
      alert("Submission failed.");
    }
    

    // setIsOpen(false); Remove after implementing the proper backend stuff
  }
  const handleLogout=()=>{
    //Logout
    const logout=0;
    //if (logout.success){
    //}
    navigate('/')
  }

  useEffect(()=>{
    console.log(formData)
  },[formData]);

  return (
    <>
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
          <Link to="/admin_main">
            <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
          </Link>
        </div>
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
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              id="message" 
              maxLength={500}
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[40vh]"
              placeholder="Write your message here..."></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
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
                <img src={speakerIcon} draggable="false" className="w-10 h-10 py-1"></img>
                <div className="pl-5">
                Make an <br></br> Announcement
                </div>
            </button>
            {/* Notification Icon */}   
            <div 
                onClick={()=>{
                  setnotification_modal(true);
                }}
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
                    to={"/profile"}
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
    </>
  );
}
