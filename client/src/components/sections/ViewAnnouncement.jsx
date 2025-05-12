import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import { announcementList } from "../../utils/models";
import Navbar from "../header";
import Footer from "../footer";

export default function ViewAnnouncementDetails() {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchedAnnouncement = announcementList.find((announcement) => announcement.announcement_id === parseInt(id));
        if (fetchedAnnouncement) {
            setAnnouncement(fetchedAnnouncement);
        }
        ScrollToTop();
    }, [id]);

    if (!announcement) return <div>Announcement not found</div>;
        
    return (
        <>
        <div className="fixed top-0 w-full z-50">
            <Navbar />
        </div>
        <div className="flex flex-col min-w-screen w-full min-h-screen h-full pt-12">
            <div
                className="bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 w-full h-[30vh]"
                style={{ backgroundImage: `url(${announcement.image})` }}
            >
            
            </div>

            <main className="flex-grow bg-gray-100 px-20 py-15">
                <div
                    className="flex items-center gap-2 cursor-pointer text-gray-900 hover:text-gray-800 mb-8"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="text-sm" />
                    <span className="text-sm font-light">Back</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-left text-[#891839] mb-2">
                    {announcement.title}
                </h2>
                <div className="px-1 pr-30">
                    <div className="flex items-center gap-2 text-md sm:text-md text-gray-900 text-left pb-12">
                        <CiCalendar className="text-xl sm:text-2xl" />
                        <p>
                            Posted on: {new Date(announcement.date_posted).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            })}
                        </p>
                    </div>
                    <p className="text-sm sm:text-lg text-gray-900 text-left pb-10">
                        {announcement.context}
                    </p>
                </div>
            </main>

            <div className="w-full z-50">
                <Footer />
            </div>
        </div>
        </>
    );
}
