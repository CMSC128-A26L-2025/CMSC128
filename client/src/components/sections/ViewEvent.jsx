import { useNavigate, useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { LuHandHeart } from "react-icons/lu";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import { useAuth } from "../../auth/AuthContext";
import default_eventbg from "../../assets/event_placeholder.png";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import axios from "axios";
import Sidebar from "../Sidebar";

export default function ViewEventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAttending, setIsAttending] = useState(false);
    const { authAxios, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        const fetchedEvent = async () => {
            try {
                setIsLoading(true);
                const response = await authAxios.get(`http://localhost:5050/events/find-event/${id}`);

                setEvent(response.data);
                console.log("Fetched Event:", response.data);
                setIsLoading(false);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log("Token invalid/expired. Attempting refresh...");

                    try {
                        const refreshResponse = await axios.get("http://localhost:5050/auth/refresh", { withCredentials: true });

                        if (refreshResponse.data.accessToken) {
                            const newToken = refreshResponse.data.accessToken;
                            localStorage.setItem("accessToken", newToken);

                            console.log("Retrying event fetch with new token...");
                            const retryResponse = await axios.get(`http://localhost:5050/events/find-event/${id}`, {
                                headers: { Authorization: `Bearer ${newToken}` },
                                withCredentials: true
                            });

                            setEvent(retryResponse.data);

                        } else {
                            navigate("/login");
                        }
                        setIsLoading(false);
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                        setIsLoading(false);
                    }
                } else {
                    console.error("Error fetching event:", error);
                    setIsLoading(false);
                }
            }
        }

        fetchedEvent();
        ScrollToTop();
    }, [id]);

    const handleRSVP = () => {
        const rsvpData = {
            status: "Attending",
        };

        authAxios.post(`http://localhost:5050/events/create-rsvp/${id}`, rsvpData)
            .then((response) => {
                console.log("RSVP successful:", response.data);
                setIsAttending(true);
                alert("RSVP successful");
                // Optionally, refresh event data to update attendees
                // window.location.reload();
            })
            .catch((error) => {
                console.error("Error RSVPing:", error);
                alert("Error RSVPing");
            });
    }

    const handleDonate = () => {
        navigate(`/donate/${id}`);
    }

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar toggleSidebar={toggleSidebar}/>
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>

                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="flex flex-col min-w-screen w-full min-h-screen h-full pt-12">
                        <div
                            className="bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 w-full h-[25vh]"
                            style={{
                                backgroundImage: `url(${
                                event?.files?.[0]?.serverFilename
                                    ? `http://localhost:5050/uploads/${event.files[0].serverFilename}`
                                    : default_eventbg
                                })`,
                            }}
                        >
                        
                        </div>

                        <main className="flex-grow bg-gray-100 px-20 py-15">
                            <div
                                className="flex items-center gap-2 cursor-pointer text-gray-900 hover:text-gray-800 mb-8 lg:pl-18"
                                onClick={() => navigate(-1)}
                            >
                                <IoIosArrowBack className="text-sm" />
                                <span className="text-sm font-light">Back</span>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-4xl sm:text-5xl font-bold text-left text-[#891839] lg:pl-18">
                                    {event.event_name}
                                </h2>
                               <div className="flex items-center gap-4 lg:pr-25">
                                    <LuHandHeart 
                                        className="text-4xl text-[#891839] cursor-pointer hover:scale-110 transition-transform duration-300"
                                        onClick={handleDonate}
                                        title="Donate"
                                    />

                                    {isAttending ? (
                                        <FaUserCheck 
                                            className="text-4xl text-[#891839] cursor-default"
                                            title="You are already attending this event"
                                        />
                                    ) : (
                                        <FaUserPlus  
                                            className="text-4xl text-[#891839] cursor-pointer hover:scale-110 transition-transform duration-300"
                                            onClick={handleRSVP}
                                            title="Click to RSVP"
                                        />
                                    )}
                                </div>
                            </div>
                            
                            <div className="px-1 lg:pr-30 lg:pl-18">
                                <div className="flex items-center gap-2 text-md sm:text-md text-gray-900 text-left py-2">
                                    <CiLocationOn className="text-xl sm:text-2xl" />
                                    <p>{event.venue}</p>
                                </div>

                                <div className="flex items-center gap-2 text-md sm:text-md text-gray-900 text-left pb-8">
                                    <CiCalendar className="text-xl sm:text-2xl" />
                                    <p>
                                        Date: {new Date(event.event_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div className="text-gray-900 text-left mb-10">
                                    <h3 className="text-2xl text-[#891839] font-semibold my-4">Event Description</h3>
                                    <p className="text-sm sm:text-lg whitespace-pre-line pb-10">
                                        {event.event_description}
                                    </p>
                                </div>
                            </div>
                        </main>

                        <div className="w-full z-50">
                            <Footer />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}