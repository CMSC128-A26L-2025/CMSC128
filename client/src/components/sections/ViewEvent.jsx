import { useNavigate, useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import { useAuth } from "../../auth/AuthContext";
import default_eventbg from "../../assets/event_placeholder.png";
import Navbar from "../header";
import Footer from "../footer";
import axios from "axios";

export default function ViewEventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { authAxios, user } = useAuth();
    const navigate = useNavigate();
    console.log(id);

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
                        const refreshResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, { withCredentials: true });

                        if (refreshResponse.data.accessToken) {
                            const newToken = refreshResponse.data.accessToken;
                            localStorage.setItem("accessToken", newToken);

                            console.log("Retrying event fetch with new token...");
                            const retryResponse = await axios.get(`${import.meta.env.VITE_API_URL}/events/find-event/${id}`, {
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

        console.log(fetchedEvent)
        if (fetchedEvent) {
            setEvent(fetchedEvent);
        }
        ScrollToTop();
    }, [id]);
    const  handleRSVP=()=>{

    }
    if (!event) return <div>Event not found</div>;

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>

            <div className="w-screen pt-12">

            {isLoading ? (
                <div className="min-w-screen min-h-screen bg-gray-200 flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-[#145C44] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="min-h-[85vh] bg-cover bg-center text-white flex justify-center items-center px-4 sm:px-8 md:px-16 pb-10 w-full"
                    style={{
                        backgroundImage: `url(${
                        typeof event?.files?.[0] === 'string' && event.files[0].trim()
                            ? `http://localhost:5050/uploads/${event.files[0].trim()}`
                            : default_eventbg
                        })`
                    }}
                    >
                    <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center w-full h-full">
                        <div className="w-full lg:w-[40%]">
                            <div
                                className="flex items-center gap-2 cursor-pointer text-white hover:text-gray-200 mb-6 mt-10 sm:mt-[5vh] lg:mt-[8vh]"
                                onClick={() => navigate(-1)}
                            >
                                <IoIosArrowBack className="text-sm" />
                                <span className="text-sm font-light">Back</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl lg:text-left font-extrabold mb-4">
                                {event.event_name}
                            </h1>
                            <p className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center text-left gap-3 mb-5">
                                <FaLocationDot className="text-2xl sm:text-3xl lg:text-4xl" />
                                {event.venue}
                            </p>
                            <p className="text-sm sm:text-base lg:text-lg text-left ml-2">
                                Date:{" "}
                                {new Date(event.event_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>

                            {true && (
                            <div className="mt-10 flex justify-center lg:justify-start">
                                <div className="grid grid-cols-2 gap-4 sm:gap-x-10">
                                <Link to={`/donate/${event.id}`}>
                                    <button className="transition-transform duration-300 ease-in-out hover:scale-110 bg-[#145C44] hover:ring-2 text-white font-bold h-[45px] sm:h-[55px] w-[180px] px-4 py-2 rounded-md">
                                    Donate
                                    </button>
                                </Link>
                                <Link onClick={handleRSVP}>
                                    <button className="transition-transform duration-300 ease-in-out hover:scale-110 bg-[#891839] hover:ring-2 text-white font-bold h-[45px] sm:h-[55px] w-[200px] px-4 py-2 rounded-md">
                                    Will be Attending
                                    </button>
                                </Link>
                                </div>
                            </div>
                            )}
                        </div>

                        <div className="w-full lg:w-[50%] mt-8 mb-10 lg:mt-[10vh] lg:ml-[5vw] px-5 pt-7 ">
                            <div className="text-left relative whitespace-pre-line border-2 rounded-2xl p-5 h-[20vh] sm:h-[20vh] md:h-[20vh] lg:h-[50vh] overflow-y-auto pr-5 bg-transparent text-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-neutral-500 dark:scrollbar-track-neutral-700">
                                {event.event_description}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
}