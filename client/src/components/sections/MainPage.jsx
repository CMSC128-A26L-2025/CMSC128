import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { eventList, announcementList, jobList } from "../../utils/models";
import { ScrollToTop } from "../../utils/helper";
import Navbar from "../header";
import Footer from "../footer";
import BookEventButton from "../buttons/BookEvent";
import SearchAlumniButton from "../buttons/SearchAlumni";
import Error_Message from "../error_message";
import { useParams } from 'react-router-dom';
import { useAuth } from "../../AuthContext";

export default function MainPage() {
    const { authAxios, user } = useAuth();
    const { user_id } = useParams();

    const [jobs, setJobs] = useState(jobList);
    const [events, setEvents] = useState(eventList);
    const [announcements, setAnnouncements] = useState(announcementList);
    const [isLoading, setIsLoading] = useState(true);

    const [currentEventIndex, setCurrentEventIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("currentEventIndex"));
        return isNaN(saved) ? 0 : saved;
    });
    const [oddNoticeIndex, setOddNoticeIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("oddNoticeIndex"));
        return isNaN(saved) ? 0 : saved;
    });
    const [evenNoticeIndex, setEvenNoticeIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("evenNoticeIndex"));
        return isNaN(saved) ? 1 : saved;
    });
    const [Error_MessageBool, setError_MessageBool] = useState(false);

    const eventIntervalRef = useRef(null);
    const noticeIntervalRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching data...");

                const jobsResponse = await authAxios.get('/jobs/job-results');
                setJobs(jobsResponse.data);

                const eventsResponse = await authAxios.get('/events/all');
                console.log("Events data:", eventsResponse.data);

                if (Array.isArray(eventsResponse.data) && eventsResponse.data.length > 0) {
                    setEvents(eventsResponse.data);

                    if (currentEventIndex >= eventsResponse.data.length) {
                        setCurrentEventIndex(0);
                        sessionStorage.setItem("currentEventIndex", "0");
                    }
                } else {
                    console.log("No events data or empty array");
                    setEvents([]);
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setIsLoading(false);
                setError_MessageBool(true);
            }
        };

        fetchData();
        ScrollToTop();
    }, [authAxios]);

    // Force light mode
    useEffect(() => {
        document.documentElement.classList.remove("dark");
    }, []);

    useEffect(() => {
        if (events.length > 0) {
            startEventInterval();
        }

        if (announcements.length > 0) {
            startNoticeInterval();
        }

        const approvedJobs = jobs.filter((job) => job.status === "approved");
        setJobs(approvedJobs);
        ScrollToTop();

        return () => {
            clearInterval(eventIntervalRef.current);
            clearInterval(noticeIntervalRef.current);
        };
    }, [events.length, announcements.length]);

    const startEventInterval = () => {
        clearInterval(eventIntervalRef.current);
        eventIntervalRef.current = setInterval(() => {
            setCurrentEventIndex((prev) => {
                const next = (prev + 1) % events.length;
                sessionStorage.setItem("currentEventIndex", next.toString());
                return next;
            });
        }, 20000);
    };

    const startNoticeInterval = () => {
        clearInterval(noticeIntervalRef.current);
        noticeIntervalRef.current = setInterval(() => {
            setOddNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                sessionStorage.setItem("oddNoticeIndex", next.toString());
                return next;
            });
            setEvenNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                sessionStorage.setItem("evenNoticeIndex", next.toString());
                return next;
            });
        }, 30000);
    };

    const handlePrevEvent = () => {
        if (events.length === 0) return;

        setCurrentEventIndex((prev) => {
            const newIndex = (prev - 1 + events.length) % events.length;
            sessionStorage.setItem("currentEventIndex", newIndex.toString());
            return newIndex;
        });
        startEventInterval();
    };

    const handleNextEvent = () => {
        if (events.length === 0) return;

        setCurrentEventIndex((prev) => {
            const newIndex = (prev + 1) % events.length;
            sessionStorage.setItem("currentEventIndex", newIndex.toString());
            return newIndex;
        });
        startEventInterval();
    };

    const currentEvent = events.length > 0 ? events[currentEventIndex] : null;

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar user_id={user_id} />
            </div>

            <div className="w-screen pt-12">
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0 min-h-[600px]">
                    {/* Events */}
                    {events.length > 0 && (
                        <div
                            className="col-span-1 sm:col-span-2 bg-cover bg-center text-white flex flex-col justify-center items-start px-8 py-16 sm:px-16 sm:py-32 w-full transition-all duration-1000 relative group"
                            style={{ backgroundImage: `url(${events[currentEventIndex].image})` }}
                        >
                            <div className="relative z-10 group/title">
                                <Link
                                    to={`/event-details/${events[currentEventIndex].event_id}`}
                                    state={{ event: events[currentEventIndex] }}
                                    className="!text-white !text-3xl sm:!text-4xl md:!text-7xl !font-bold !mb-4 !text-left cursor-pointer block w-full relative z-10 hover:!underline"
                                >
                                    {events[currentEventIndex].event_name}
                                </Link>
                            </div>
                            <p className="!text-md sm:!text-lg !max-w-2xl !text-left">
                                {events[currentEventIndex].event_description}
                            </p>
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                                <button onClick={handlePrevEvent}>
                                    <IoIosArrowBack size={15} />
                                </button>
                                <span>{`${currentEventIndex + 1} of ${events.length}`}</span>
                                <button onClick={handleNextEvent}>
                                    <IoIosArrowForward size={15} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Announcements */}
                    <div className="grid grid-rows-2 w-full">
                        {[oddNoticeIndex, evenNoticeIndex].map((index, i) => (
                            <div
                                key={i}
                                className="bg-cover bg-center !text-white flex flex-col justify-center items-end text-right px-8 sm:px-10 py-8 sm:py-10 w-full transition-all duration-1000"
                                style={{ backgroundImage: `url(${announcements[index].image})` }}
                            >
                                <h2 className="!text-white !text-2xl sm:!text-3xl md:!text-4xl !font-bold !mb-4">
                                    {announcements[index].title}
                                </h2>
                                <p className="text-sm sm:text-base max-w-md">
                                    {announcements[index].context}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Postings */}
                <div className="bg-white px-6 sm:px-12 py-15">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/3 flex flex-col justify-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-[#891839] text-left mb-6 leading-12">
                                Explore<br />Recent Job<br />Opportunities
                            </h2>
                            <div className="flex justify-end mt-4 pr-10">
                                <Link to={`/jobs`}>
                                    <button className="focus:!outline-none text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white cursor-pointer">
                                        View more &gt;
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3">
                            {jobs.length > 0 ? (
                                jobs.slice(0, 2).map((job, index) => (
                                    <Link
                                        key={index}
                                        to={`/job-details/${job.job_id}`}
                                        className="transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full shadow-lg hover:shadow-xl">
                                            <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                <h3 className="text-4xl font-semibold mb-3 pb-5">{job.job_title}</h3>
                                                <p>Company: {job.company}</p>
                                                <p>
                                                    Date Posted: {new Date(job.date_posted).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p>Location: {job.location}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>No job listings found.</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full h-0.5 mt-15 bg-[#891839]"></div>
                </div>

                <div className="w-full min-h-[440px] grid grid-cols-1 sm:grid-cols-2">
                    <Link to={`/events`}>
                        <BookEventButton />
                    </Link>
                    <Link to={`/search-alumni`}>
                        <SearchAlumniButton />
                    </Link>
                </div>
            </div>

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
};
