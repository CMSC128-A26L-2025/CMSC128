import { Link } from "react-router-dom";
import Navbar from "../components/common/Header";
import Footer from "../components/common/Footer";
import event1 from "../assets/event.png";
import notice1 from "../assets/notice1.png";
import notice2 from "../assets/notice2.png";
import BookEventButton from "../components/buttons/BookEvent";
import SearchAlumniButton from "../components/buttons/SearchAlumni";

//test case for jobs
const jobListings = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    datePosted: "April 10, 2025",
    location: "Remote",
  },
  {
    title: "Data Analyst",
    company: "Global Analytics Co.",
    datePosted: "April 12, 2025",
    location: "Manila, PH",
  },
];

export const MainPage = () => {
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="pt-12">
        <div className="w-full grid grid-cols-3 gap-0 min-h-[600px]">
          {/* Event 1 */}
          <div
            className="col-span-2 bg-cover bg-center text-white flex flex-col justify-center items-start px-16 py-32 w-full"
            style={{ backgroundImage: `url(${event1})` }}
          >
            <h1 className="!text-8xl !font-bold !mb-4 !text-left">Event 1</h1>
            <p className="!text-md !max-w-xl !text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Notices */}
          <div className="grid grid-rows-2 w-full">
            <div
              className="bg-cover bg-center text-white flex flex-col justify-center items-end text-right px-10 py-10 w-full"
              style={{ backgroundImage: `url(${notice1})` }}
            >
              <h2 className="text-5xl font-bold mb-4">Notice 2</h2>
              <p className="text-xs max-w-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div
              className="bg-cover bg-center text-white flex flex-col justify-center items-end text-right px-10 py-10 w-full"
              style={{ backgroundImage: `url(${notice2})` }}
            >
              <h2 className="text-5xl font-bold mb-4">Notice 3</h2>
              <p className="text-xs max-w-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>

        {/* Job Postings */}
        <div className="bg-white px-15 py-15">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 flex flex-col justify-center">
              <h2 className="text-5xl font-bold text-[#891839] text-left mb-6 leading-12">
                Explore<br />Recent Job<br />Opportunities
              </h2>
              <div className="flex justify-end mt-4 pr-10">
                <Link to="/jobs">
                  <button className="text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white">
                    View more &gt;
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3">
              {jobListings.length > 0 ? (
                jobListings.map((job, index) => (
                  <Link
                    key={index}
                    to={`/job-details/${index}`}
                    state={{ job }}
                    className="transform transition-transform duration-300 hover:scale-105"
                  >
                    <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full shadow-lg hover:shadow-xl">
                      <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                        <h3 className="text-4xl font-semibold mb-3 pb-5">{job.title}</h3>
                        <p>Company: {job.company}</p>
                        <p>Date Posted: {job.datePosted}</p>
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

        <div className="w-full h-110 grid grid-cols-2 gap-0">
          <Link to="/book-event">
            <BookEventButton />
          </Link>
          <Link to="/search-alumni">
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