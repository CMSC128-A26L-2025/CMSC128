import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { TbMoodEmpty } from "react-icons/tb";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import Navbar from "../header";
import Footer from "../footer";

export const Results_page_events = ( ) => {
    const navigate = useNavigate();
    const {authAxios, user} = useAuth();

    const [sortBy, setSortBy] = useState("");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [events, setEvents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const toggleBookmark = (id) => {
        if (bookmarkedIds.includes(id)) {
            setBookmarkedIds(bookmarkedIds.filter((bid) => bid !== id));
        } else {
            setBookmarkedIds([...bookmarkedIds, id]);
        }
    };


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await authAxios.get(`http://localhost:5050/events/read-sort?sortBy=${sortBy}`);

                setEvents(response.data);
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
                            const retryResponse = await axios.get(`http://localhost:5050/events?sortBy=${sortBy}`, {
                                headers: { Authorization: `Bearer ${newToken}` },
                                withCredentials: true
                            });

                            setEvents(retryResponse.data);
                            setIsLoading(false); 

                        } else {
                            navigate("/login");
                        }
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                } else {
                    console.error("Error fetching events:", error);
                }
            }
        };

        fetchEvents();
        window.scrollTo(0, 0);
    }, [sortBy, navigate]);

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>

            {isLoading ? (
                <div className="min-w-screen min-h-screen bg-gray-200 flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-[#145C44] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="w-full min-w-screen min-h-screen bg-gray-200 px-10 pt-24 flex flex-col items-center">
                    <div className="container flex flex-col items-start space-y-8 text-black text-left ">

                        {/* Sort dropdown */}
                        <div className="flex flex-row space-x-4 items-center">
                            <h2>Sort by:</h2>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                                <option value="date">Date</option>
                                <option value="title">Title</option>
                            </select>
                        </div>

                        {/* Display events */}
                        <div className="flex justify-center w-full overflow-x-hidden mb-35">
                            {events.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {events.map(event => (
                                        <div key={event._id} className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
                                            <Link to={`/event-details/${event._id}`}>
                                                <img src={`http://localhost:5050/uploads/${event.files[0]}`} alt={event.event_name} className="w-full h-48 object-cover" />
                                            </Link>

                                            <div className="p-4 flex flex-col h-full">
                                                {/* Bookmark button */}
                                                <div className="flex justify-end mb-2">
                                                    <button
                                                        onClick={() => toggleBookmark(event._id)}
                                                        className="text-white-400 hover:text-white-500 focus:outline-none"
                                                        title={bookmarkedIds.includes(event._id) ? "Remove Bookmark" : "Bookmark"}
                                                    >
                                                        {bookmarkedIds.includes(event._id) ? (
                                                            <BookmarkIcon className="w-6 h-6" />
                                                        ) : (
                                                            <BookmarkIcon className="w-6 h-6 opacity-50" />
                                                        )}
                                                    </button>
                                                </div>
                                                <h2 className="text-xl font-semibold mb-1">{event.event_name}</h2>
                                                <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
                                                <p className="text-gray-700 flex-grow">{event.event_description}</p>
                                                <p className="text-sm text-right text-gray-500">
                                                    {new Date(event.event_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-full min-h-[450px] w-full min-w-screen flex-col items-center justify-center text-center pt-45 pb-80">
                                    <TbMoodEmpty className="w-40 h-40 text-[#145C44] mb-5" />
                                    <p className="text-md text-[#145C44] font-regular">No events available at the moment.</p>
                                    <p className="text-sm text-[#145C44]">Please check back later.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
};