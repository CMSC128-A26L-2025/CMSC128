import Navbar from "../components/common/Header";

export const LandingPage = () => {
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full h-150 flex flex-col justify-between">
        <div className="flex justify-between items-start h-full text-white text-left pl-16 pt-24">
          <div className="flex flex-col">
            <p className="text-7xl font-bold">Welcome to Artemis</p>
            <p className="text-4xl font-medium">
              Alumni Relations, Tracking,<br></br> and Engagement Management
              Integrated System
            </p>
            <p className="text-xl font-light pt-5">
              "Guiding Alumni Connections, Every Step of the Way"
            </p>
          </div>
        </div>
        <div className="flex justify-end pb-10 pr-16">
          <div className="flex gap-4">
            <button className="!bg-transparent !hover:bg-white !text-3xl !text-white !hover:text-[#085740] !h-15 !font-light !px-6 !py-2 !border-2 !border-white !rounded-full">
              Log In
            </button>
            <button className="!bg-transparent !hover:bg-[#FFFFFF] !text-3xl !text-white !hover:text-[#085740] !h-15 !font-light !px-6 !py-2 !border-2 !border-white !rounded-full">
              View Job Listing
            </button>
          </div>
        </div>
      </div>

      {/* 2nd Part of the Page */}

      <div className="w-full bg-gray-200 p-10">
        <div className="flex flex-col justify-center text-center">
        <h2 className="text-6xl text-center text-[#891839] font-bold">
          Stay Connected, Stay Involved
        </h2>
        <h2 className="text-xl text-center text-black font-light py-5">
            The ICS Alumni Tracker and Relations Management System is your gateway
          to reconnecting with old friends, expanding your professional network,
          and giving back to the ICS community.
        </h2>
        {/* <p className="text-xl text-centerfont-light text-black w-150">
          
        </p> */}
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-10 p-16"> 
            {/* Column 1 */ }
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">1</span>
                
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Build Your Profile</h3>
                    <p className="text-xl text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                </div>
                
            </div>
            {/* Column 1 */ }
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">2</span>
                
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Expand Your Network</h3>
                    <p className="text-xl text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                </div>
                
            </div>

            {/* Column 3 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">3</span>
                
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Advance Your Career</h3>
                    <p className="text-xl text-black text-left pt-1">Post and discover job opportunities shared by ICS alumni.</p>
                </div>
                
            </div>

            {/* Column 4 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">4</span>
                
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Join Events & Reunions</h3>
                    <p className="text-xl text-black text-left pt-1">Stay updated on upcoming gatherings and RSVP with ease.</p>
                </div>
                
            </div>

            {/* Column 5 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">5</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Give Back</h3>
                    <p className="text-xl text-black text-left pt-1">Support scholarships and initiatives through donations and sponsorship.</p>
                </div>
                
            </div>

            {/* Column 6 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">6</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Stay Informed</h3>
                    <p className="text-xl text-black text-left pt-1">Receive newsletters, announcements, and invitations exclusive events.</p>
                </div>
                
            </div>
            </div>
      </div>
    </>
  );
};