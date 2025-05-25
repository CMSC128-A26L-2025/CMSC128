import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { PiCalendarDotsFill } from "react-icons/pi";
import { announcementList } from "../../utils/models";    //test case
import Navbar_landing from "../header_landing";
import Footer from "../footer";
import Loading from "../loading";
import { useAuth } from "../../auth/AuthContext";

export const Landing_page = () => {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState(announcementList);
  const [isLoading, setIsLoading] = useState(true);
  const { authAxios } = useAuth();

  // Effect to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const announcementsResponse = await authAxios.get('/announcement/read-announcements');
        console.log("Announcements data from API:", announcementsResponse.data); // This will show the data received
        setAnnouncements(announcementsResponse.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        // Handle error, e.g., set an error state or show a message
      }
    };
    fetchData();
  }, [authAxios]); // Dependency array includes authAxios to refetch if it changes (though unlikely for a landing page)

  // Effect to log announcements state *after* it has been updated
  useEffect(() => {
    console.log("Announcements state after update:", announcements);
    // You could also set isLoading to false here if the loading state depends directly on data
    // if (announcements.length > 0) {
    //   setIsLoading(false);
    // }
  }, [announcements]); // This effect runs whenever 'announcements' state changes

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const sortedAnnouncements = [...announcements].sort((a, b) => 
    new Date(b.date_posted) - new Date(a.date_posted)
  );
  
  const latestAnnouncements = sortedAnnouncements.slice(0, 4);
   
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar_landing />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full min-h-screen h-175 flex flex-col justify-between">
            <div className="flex justify-between items-center h-full text-white text-left pl-8 pt-15 sm:pl-20">
              <div className="flex flex-col">
                <p className="text-5xl md:text-5xl lg:text-7xl font-bold pb-2">
                  Welcome to Artemis
                </p>
                <p className="text-xl md:text-2xl lg:text-4xl font-medium pb-3">
                  Alumni Relations, Tracking, and <br />
                  Engagement Management Integrated System
                </p>
                <p className="text-md md:text-lg lg:text-xl font-light">
                  "Guiding Alumni Connections, Every Step of the Way"
                </p>
              </div>
            </div>
            <div className="flex justify-end pb-15 pr-25">
              <div className="flex gap-4">
                <button className="text-base sm:text-lg lg:text-xl text-white h-[50px] sm:h-[60px] w-[140px] sm:w-[180px] font-bold px-4 py-2 border-2 border-white rounded-4xl hover:bg-white hover:text-[#085740] cursor-pointer"
                  onClick={()=> navigate('/login')}>
                  Log In
                </button>
                <button className="text-base sm:text-lg lg:text-xl text-white h-[50px] sm:h-[60px] w-[170px] sm:w-[190px] font-bold px-4 py-2 border-2 border-white rounded-4xl hover:bg-white hover:text-[#085740] cursor-pointer"
                  onClick={() => navigate('/guest_jobs')}>
                  View Job Listing
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-screen bg-gray-100 px-10 py-30 h-auto">
            <div className="flex flex-col justify-center text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center text-[#891839] font-bold">
              Stay Connected, Stay Involved
            </h2>
            <h2 className="text-md md:text-md lg:text-xl text-center text-black font-light py-5 sm:px-20 lg:px-30">
              The ICS Alumni Tracker and Relations Management System is your gateway
              to reconnecting with old friends, expanding your professional network,
              and giving back to the ICS community.
            </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-15 gap-y-10 pt-10 sm:px-10 lg:px-30">
                {/* Column 1 */ }
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1"style={{ fontFamily: "sans-serif" }}>1</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Build Your Profile</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                    </div>
                    
                </div>
                {/* Column 1 */ }
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1 "style={{ fontFamily: "sans-serif" }}>2</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Expand Your Network</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                    </div>
                    
                </div>

                {/* Column 3 */}
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1 "style={{ fontFamily: "sans-serif" }}>3</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Advance Your Career</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Post and discover job opportunities shared by ICS alumni.</p>
                    </div>
                    
                </div>

                {/* Column 4 */}
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1 "style={{ fontFamily: "sans-serif" }}>4</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Join Events & Reunions</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Stay updated on upcoming gatherings and RSVP with ease.</p>
                    </div>
                    
                </div>

                {/* Column 5 */}
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1 "style={{ fontFamily: "sans-serif" }}>5</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Give Back</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Support scholarships and initiatives through donations and sponsorship.</p>
                    </div>
                    
                </div>

                {/* Column 6 */}
                <div className="grid grid-cols-4 gap-2">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center col-span-1 "style={{ fontFamily: "sans-serif" }}>6</span>
                    <div className=" col-span-3">
                        <h3 className="text-xl font-bold text-[#891839] text-left">Stay Informed</h3>
                        <p className="text-md md:text-md lg:text-lg text-black text-left pt-1">Receive newsletters, announcements, and invitations exclusive events.</p>
                    </div>
                    
                </div>
              </div>
          </div>

          {latestAnnouncements.length > 0 && (
            <div className="flex flex-col bg-[#891839] w-full px-4 md:px-10 pt-20 pb-25">
              <div className="flex flex-col justify-center text-center mb-8 max-w-screen-lg mx-auto">
                <p className="text-4xl md:text-4xl lg:text-5xl text-white font-bold">News and Updates</p>
                <p className="text-md md:text-lg lg:text-xl text-white font-light mt-4 mb-8">
                  Stay updated with the current news, upcoming events, and important updates from the alumni community.
                </p>
              </div>
              
              <div className="max-w-7xl mx-auto w-full px-4 md:px-20">
                {latestAnnouncements.length === 1 && (
                  <div className="px-10 md:px-10 lg:px-30 flex justify-center">
                    <div className="w-full md:w-[85%] lg:w-[85%] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative overflow-hidden group">
                        <img
                          src={latestAnnouncements[0].image}
                          alt={latestAnnouncements[0].title}
                          className="h-50 md:h-80 lg:h-80 w-full object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105"
                        />
                        {latestAnnouncements[0].type && (
                          <span className="absolute top-4 left-4 bg-[#891839] text-white text-xs px-4 py-1 rounded-full">
                            {latestAnnouncements[0].type}
                          </span>
                        )}
                      </div>
                      <div className="p-4 md:p-6 lg:p-6 text-left">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#891839] mb-1">
                          {latestAnnouncements[0].title}
                        </h3>
                        {latestAnnouncements[0].date_posted && (
                          <div className="flex items-center text-xs md:text-sm font-medium text-gray-700">
                            <PiCalendarDotsFill className="w-4 h-4 mr-2" />
                            <p>{new Date(latestAnnouncements[0].date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {latestAnnouncements.length === 2 && (
                  <div className="px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestAnnouncements.map((a) => (
                      <div
                        key={a.announcement_id}
                        className="flex justify-center"
                      >
                        <div className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                          <div className="relative overflow-hidden group">
                            <img
                              src={a.image}
                              alt={a.title}
                              className="h-50 md:h-80 lg:h-70 w-full object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105"
                            />
                            {a.type && 
                              <span 
                                className="absolute top-4 left-4 bg-[#891839] text-white text-xs px-4 py-1 rounded-full">
                                {a.type}
                              </span>
                            }
                          </div>
                          <div className="p-4 md:p-6 lg:p-6 text-left">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#891839] mb-1">
                              {a.title}
                            </h3>
                            {a.date_posted && (
                              <div className="flex items-center text-xs md:text-sm font-medium text-gray-700">
                                <PiCalendarDotsFill className="w-4 h-4 mr-2" />
                                <p>{new Date(a.date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(latestAnnouncements.length === 3 || latestAnnouncements.length >= 4) && (
                  <>
                    <div className="xl:hidden flex flex-col gap-6 md:gap-6 lg:gap-4 px-10 md:px-4">
                      {latestAnnouncements.slice(0, latestAnnouncements.length === 3 ? 3 : 4).map((a) => (
                        <div key={a.announcement_id} className="flex justify-center">
                          <div className="w-full md:w-[85%] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="relative overflow-hidden group">
                              <img 
                                src={a.image} 
                                alt={a.title} 
                                className="h-48 sm:h-56 md:h-64 w-full object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105" 
                              />
                              {a.type && (
                                <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#891839] text-white text-xs px-3 py-1 md:px-4 md:py-1 rounded-full">
                                  {a.type}
                                </span>
                              )}
                            </div>
                            <div className="p-4 md:p-6 lg:p-6 text-left">
                              <h3 className="text-lg md:text-xl font-bold text-[#891839] mb-1">
                                {a.title}
                              </h3>
                              {a.date_posted && (
                                <div className="flex items-center text-xs md:text-sm font-medium text-gray-700">
                                  <PiCalendarDotsFill className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                  <p>{new Date(a.date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="hidden xl:grid grid-cols-3 gap-6 md:gap-6 lg:gap-4">
                      <div className="col-span-2 flex justify-start">
                        <div className="w-[85%] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                          <div className="relative overflow-hidden group">
                            <img 
                              src={latestAnnouncements[0].image} 
                              alt={latestAnnouncements[0].title} 
                              className={`${latestAnnouncements.length === 3 ? 'h-75' : 'h-96'} w-full object-cover rounded-t-lg transform transition-transform duration-300 group-hover:scale-105`}
                            />
                            {latestAnnouncements[0].type && (
                              <span className="absolute top-5 left-5 bg-[#891839] text-white text-xs px-4 py-1 rounded-full">
                                {latestAnnouncements[0].type}
                              </span>
                            )}
                          </div>
                          <div className="p-4 md:p-6 lg:p-6 text-left">
                            <h3 className="text-3xl font-bold text-[#891839] mb-1">
                              {latestAnnouncements[0].title}
                            </h3>
                            {latestAnnouncements[0].date_posted && (
                              <div className="flex items-center text-md font-medium text-gray-700">
                                <PiCalendarDotsFill className="w-4 h-4 mr-2" />
                                <p>{new Date(latestAnnouncements[0].date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex flex-col gap-4 h-full ml-[-6.7rem]">
                        {latestAnnouncements.slice(1, latestAnnouncements.length === 3 ? 3 : 4).map((a) => (
                          <div key={a.announcement_id} className="w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex-1">
                            <div className="flex h-full">
                              <div className={`w-[60%] ${announcements.length === 3 ? 'h-50' : 'h-39'} overflow-hidden group`}>
                                <img 
                                  src={a.image} 
                                  alt={a.title} 
                                  className="h-full w-full object-cover rounded-l-lg transform transition-transform duration-300 group-hover:scale-105" 
                                />
                              </div>
                              <div className="w-[40%] p-4 flex flex-col justify-center text-left">
                                <div>
                                  {a.type && (
                                    <span className="inline-block bg-[#891839] text-white text-xs px-3 py-1 rounded-full mb-2">
                                      {a.type}
                                    </span>
                                  )}
                                  <h3 className="text-md font-bold text-[#891839] mb-1 line-clamp-2">
                                    {a.title}
                                  </h3>
                                  {a.date_posted && (
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                      <PiCalendarDotsFill className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <p className="truncate">{new Date(a.date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};