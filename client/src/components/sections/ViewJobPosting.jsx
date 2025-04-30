import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import { jobList } from "../../utils/models";
import Navbar from "../header";
import Footer from "../footer";

export default function ViewJobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchedJob = jobList.find((job) => job.job_id === parseInt(id));
        if (fetchedJob) {
            setJob(fetchedJob);
        }
        ScrollToTop();
    }, [id]);

    if (!job) return <div>Job not found</div>;
        
    return (
        <>
        <div className="fixed top-0 w-full z-50">
            <Navbar />
        </div>
        <div className="w-screen pt-12">
            <div
                className="bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 w-full h-[50vh]"
                style={{ backgroundImage: `url('/assets/${job.image}')` }}
            >
            <div
                className="flex items-center gap-2 cursor-pointer text-white hover:text-gray-300 mb-10"
                onClick={() => navigate(-1)}
            >
                <IoIosArrowBack className="text-sm" />
                <span className="text-sm font-light">Back</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-extrabold mb-2">{job.company}</h1>
            <p className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <FaLocationDot className="text-3xl sm:text-4xl" />
                {job.location}
            </p>
            <p className="text-sm sm:text-lg text-white mt-6 ml-2 mb-1">
                Posted on: {new Date(job.date_posted).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                })}
            </p>
            </div>

            <div className="bg-white px-10 py-14 space-y-6">
            <h2 className="text-4xl sm:text-7xl font-bold text-left ml-5 text-[#891839] mb-2">
                {job.job_title}
            </h2>
            <div className="h-1 bg-[#891839] mb-6 mt-10"></div>

            <p className="text-[#891839] text-lg sm:text-xl text-left mx-7">
                {job.job_description}
            </p>

            {job.requirements?.length > 0 && (
                <div>
                <h3 className="text-3xl sm:text-4xl font-semibold text-[#891839] text-left mb-4 mt-15 mx-7">Requirements:</h3>
                <ul className="list-disc list-inside text-[#891839] text-md sm:text-xl text-left mr-7 ml-15">
                    {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                    ))}
                </ul>
                </div>
            )}

            {job.application_link?.trim() && (
                <div className="mt-15 mx-7">
                <a
                    href={job.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="w-[200px] block focus:!outline-none text-[#891839] border-2 border-[#891839] px-6 py-2 rounded-lg font-light hover:bg-[#891839] hover:text-white cursor-pointer">
                        Apply Now
                    </button>
                </a>
                </div>
            )}
            </div>
        </div>

        <div className="w-full z-50">
            <Footer />
        </div>
        </>
    );
}
