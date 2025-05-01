import { useNavigate, useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import { useAuth } from "../../AuthContext";
import Navbar from "../header";
import Footer from "../footer";
import axios from "axios";

export default function ViewEventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { authAxios, user } = useAuth();
    const navigate = useNavigate();
    console.log(id);

    useEffect(() => {
        const fetchedEvent = async () => {
            try {
                const response = await authAxios.get(`http://localhost:5050/events/find-event/${id}`);

                setEvent(response.data);
                console.log("Fetched Event:", response.data);

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
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                } else {
                    console.error("Error fetching event:", error);
                }
            }

        }

        console.log(fetchedEvent)
        if (fetchedEvent) {
            setEvent(fetchedEvent);
        }
        ScrollToTop();
    }, [id]);

    if (!event) return <div>Event not found</div>;

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>

            <div className="w-screen pt-12">
                <div
                    className="min-h-[85vh] bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 pb-10 w-full"
                    style={{ backgroundImage: `url(${event.image})` }}
                >
                    <div className="flex justify-center">
                        <div className="w-[30vw]">
                            <div

                                className="flex items-center gap-2 cursor-pointer text-white hover:text-gray-300 mb-10 mt-[10vh]"
                                onClick={() => navigate(-1)}
                            >
                                <IoIosArrowBack className="text-sm" />
                                <span className="text-sm font-light">Back</span>
                            </div>
                            <h1 className="text-2xl sm:text-8xl text-left font-extrabold mb-2">{event.event_name}</h1>
                            <p className="text-xl sm:text-3xl text-left font-bold flex items-center gap-3">
                                <FaLocationDot className="text-3xl sm:text-4xl" />
                                {event.venue}
                            </p>
                            <p className="text-sm text-start sm:text-lg text-white mt-6 ml-2 mb-1">
                                Date: {new Date(event.event_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <div className="mt-8 ml-2">
                                {/* event.donatable -> hardcoded to true */}
                                {true && (
                                    <div className="grid grid-cols-2 gap-x-10">
                                        <Link to="/donate">
                                            <button className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#145C44] hover:ring-2  text-white text font-bold py-2 px-6 rounded-md">
                                                Donate
                                            </button>
                                        </Link>
                                        <Link to="/donate">
                                            <button className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#891839] hover:ring-2 text-white text font-bold py-2 px-6 rounded-md">
                                                Will be Attending
                                            </button>
                                        </Link>
                                    </div>


                                )}
                            </div>
                        </div>
                        <div className="ml-[5vw] mt-[10vh] relative whitespace-pre-line bg-transparent border-2 h-[50vh] text-white rounded-2xl text-start p-4">
                            <div className=" h-full w-[50vw]
                    space-y-1
                    overflow-y-auto [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:rounded-fulsl
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500  pr-5">
                                {event.event_description}

                            </div>
                        </div>
                    </div>



                </div>
            </div>

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
}