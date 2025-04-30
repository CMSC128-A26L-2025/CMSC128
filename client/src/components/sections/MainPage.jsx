import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { eventList, announcementList, jobList } from "../../utils/models";
import { ScrollToTop } from "../../utils/helper";
import Navbar from "../header";
import Footer from "../footer";
import BookEventButton from "../buttons/BookEvent";
import SearchAlumniButton from "../buttons/SearchAlumni";
import Error_Message from "../error_message";
import { useParams } from 'react-router-dom';

export default function MainPage() {
    const {user_id} =useParams(); //Contains the User Id 
    const [jobs, setJobs] = useState(jobList);
    const [events, setEvents] = useState(eventList);
    const [announcements, setAnnouncements] = useState(announcementList);

    // for events and announcements slideshow
    const [currentEventIndex, setCurrentEventIndex] = useState(() => parseInt(localStorage.getItem("currentEventIndex")) || 0);
    const [oddNoticeIndex, setOddNoticeIndex] = useState(() => parseInt(localStorage.getItem("oddNoticeIndex")) || 0);
    const [evenNoticeIndex, setEvenNoticeIndex] = useState(() => parseInt(localStorage.getItem("evenNoticeIndex")) || 1);
    const [Error_MessageBool, setError_MessageBool]= useState(false);
    const [message, setmessage]=useState("");

    useEffect(() => {
        const eventInterval = setInterval(() => {
            setCurrentEventIndex((prev) => {
                const next = (prev + 1) % events.length;
                localStorage.setItem("currentEventIndex", next);
                return next;
            });
        }, 20000);   // 20sec interval for each event

        const noticeInterval = setInterval(() => {
            setOddNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                localStorage.setItem("oddNoticeIndex", next);
                return next;
            });
            setEvenNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                localStorage.setItem("evenNoticeIndex", next);
                return next;
            });
        }, 30000);  // 30sec interval per two announcements

        // filter and display only approved jobs
        const approvedJobs = jobs.filter((job) => job.status === "approved");
        setJobs(approvedJobs);
        setEvents(eventList);
        setAnnouncements(announcementList);
        ScrollToTop();

        return () => {
            clearInterval(eventInterval);
            clearInterval(noticeInterval);
        };
    }, [events.length, announcements.length]);
    
    return (
        <>
            {/* For testing purposes */}
            {Error_MessageBool &&(
                
                <Error_Message message={"Testing testing"} setVisible={setError_MessageBool}></Error_Message>
            )} 
            <div className="fixed top-0 w-full z-50">
                <Navbar user_id={user_id}/>
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
                                    to={`/event-details/${events[currentEventIndex].event_id}/${user_id}`}
                                    state={{ event: events[currentEventIndex] }}
                                    className="!text-white !text-3xl sm:!text-4xl md:!text-7xl !font-bold !mb-4 !text-left cursor-pointer block w-full relative z-10 hover:!underline"
                                >
                                    {events[currentEventIndex].event_name}
                                </Link>
                            </div>
                            <p className="!text-md sm:!text-lg !max-w-2xl !text-left">
                                {events[currentEventIndex].event_description}
                            </p>
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
                                <Link to={`/jobs/${user_id}`}>
                                    <button className="focus:!outline-none text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white">
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
                                        to={`/job-details/${job.job_id}/${user_id}`}
                                        className="transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full shadow-lg hover:shadow-xl">
                                            <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                <h3 className="text-4xl font-semibold mb-3 pb-5">{job.job_title}</h3>
                                                <p>Company: {job.company}</p>
                                                {/* <p>Date Posted: {new Date(job.date_posted).toLocaleDateString()}</p> */}
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

                {/* <div className="w-full h-110 grid grid-cols-2 gap-0"> */}
                <div className="w-full min-h-[440px] grid grid-cols-1 sm:grid-cols-2">
                    <Link to="/book-event">
                        <BookEventButton />
                    </Link>
                    <Link to={`/search-alumni/${events[currentEventIndex].event_id}`}>
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