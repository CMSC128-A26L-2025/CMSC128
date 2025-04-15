import Navbar from "../header";
import Footer from "../Footer";
import event1 from "../../assets/event.png";
import notice1 from "../../assets/notice1.png";
import notice2 from "../../assets/notice2.png";
import calendar from "../../assets/calendar.png";
import search from "../../assets/search_alumni.png";

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
                <button className="text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white">
                  View more &gt;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3">
              {/* Card 1 */}
              <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full">
                <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                  <h3 className="text-4xl font-semibold mb-3 pb-5">Job Title</h3>
                  <p>Company Name</p>
                  <p>Date Posted</p>
                  <p>Location</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full">
                <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                  <h3 className="text-4xl font-semibold mb-3 pb-5">Job Title</h3>
                  <p>Company Name</p>
                  <p>Date Posted</p>
                  <p>Location</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-0.5 mt-15 bg-[#891839]"></div>
        </div>

        <div className="w-full h-110 grid grid-cols-2 gap-0">
          {/* Book an Event */}
          <div className="group relative bg-[#891839] p-8 pb-30 flex justify-center items-center w-full h-full transition-colors duration-300 hover:bg-[#145C44] overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/70 to-transparent transition-colors duration-300 group-hover:from-white/70 z-0" />
            <button className="relative z-10 bg-[#891839] group-hover:bg-[#145C44] text-white rounded-3xl border-5 border-white w-full h-full flex items-center justify-center px-10 py-6 transition-colors duration-300">
              <div className="flex items-center gap-6">
                <img src={calendar} alt="Calendar Icon" className="w-60 h-60" />
                <div className="text-right">
                  <p className="text-6xl font-semibold leading-15">Book an</p>
                  <p className="text-6xl font-semibold leading-15">Event</p>
                </div>
              </div>
            </button>
          </div>

          {/* Search Alumni */}
          <div className="group relative bg-[#145C44] p-8 pb-30 flex justify-center items-center w-full h-full transition-colors duration-300 hover:bg-[#891839] overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/70 to-transparent transition-colors duration-300 group-hover:from-white/70 z-0" />
            <button className="relative z-10 bg-[#145C44] group-hover:bg-[#891839] text-white rounded-3xl border-5 border-white w-full h-full flex items-center justify-center px-10 py-6 transition-colors duration-300">
              <div className="flex items-center gap-6">
                <div className="text-left">
                  <p className="text-6xl font-semibold leading-15">Search</p>
                  <p className="text-6xl font-semibold leading-15">Alumni</p>
                </div>
                <img src={search} alt="Search Icon" className="w-60 h-60" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};