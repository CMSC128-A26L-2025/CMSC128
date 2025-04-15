import search from "../../assets/search_alumni.png";

export default function SearchAlumniButton() {
  return (
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
  );
};