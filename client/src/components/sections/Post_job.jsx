
import Navbar from "../header";
import { useState, useEffect, useRef } from "react";
import { ScrollToTop } from "../../utils/helper";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import CreatableSelect from "react-select/creatable";
import { jobRequiremets } from "../../utils/models";
import { useLocation } from 'react-router-dom';
import { Button } from "flowbite-react";
import Sidebar from "../Sidebar";


export const Post_Job = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const fileInputRef = useRef(null);
    const jobCount = useLocation().state.jobCount;
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const [requirementsOptions, setRequirementsOptions] = useState(jobRequiremets.map(req => ({ value: req, label: req })));
    const [formData, setFormData] = useState({
        job_id: 0,
        job_title: "",
        company: "",
        location: "",
        job_description: "",
        requirements: [],
        application_link: "",
        date_posted: new Date(),
        start_date: new Date(),
        end_date: new Date(), 
        status: user?.user_type === 'Admin' ? 'approved' : 'pending',
        approved_by: user?.user_type === 'Admin' ? user?._id : "",
        approval_date: user?.user_type === 'Admin' ? new Date() : null,
        posted_by: user?._id,
        files:[]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [actualFiles, setActualFiles] = useState([]); // Store actual file objects
    
    
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      
        const validFiles = [];
        const errors = [];
      
        selectedFiles.forEach(file => {
          if (!imageTypes.includes(file.type)) {
            errors.push(`${file.name} is not a supported image file.`);
          } else if (file.size > MAX_FILE_SIZE) {
            errors.push(`${file.name} exceeds the 10MB size limit.`);
          } else {
            validFiles.push(file);
          }
        });
      
        if (errors.length > 0) {
          alert(errors.join('\n')); // Or use a toast/modal/etc.
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      
        setActualFiles(validFiles);
    };


    useEffect(() => {
        ScrollToTop();
    }, []);

    const handleSubmit = async () => {
        try {
          const fileFormData = new FormData();
          actualFiles.forEach(file => fileFormData.append("files[]", file));
      
          const file_res = await axios.post(`http://localhost:5050/jobs/${formData.job_id}/upload`, fileFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const uploadedFiles = file_res.data.files.map(file => file.serverFilename)
          const jobcnt_res = await axios.get(`http://localhost:5050/jobs/job-count`);
          const jobPostingData = {
            job_id: (jobcnt_res.data)+1,
            posted_by: `${user?._id}`,
            job_title: formData.job_title,
            company: formData.company,
            location: formData.location,
            job_description: formData.job_description,
            requirements: formData.requirements,
            application_link: formData.application_link,
            start_date: formData.start_date,
            end_date: formData.end_date,
            date_posted: new Date(),
            status: "pending",
            files: uploadedFiles, // Remove this line
          };
          console.log(jobPostingData);
          const res = await axios.post("http://localhost:5050/jobs/create", jobPostingData); // Send as JSON
          alert("Job posting submitted successfully!");
          console.log("Response:", res.data);
        } catch (err) {
          console.error("Error creating job posting:", err);
          alert("Submission failed.");
        }
      };
      
    return(
        <>  
        
            <div className="w-screen">
                <Navbar toggleSidebar={toggleSidebar}></Navbar>
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <form className="bg-[#DDDDDD] bg-cover bg-center bg-no-repeat h-[auto] pt-17 pb-30 px-10 ">
                    <div className="flex p-1">
                        
                        <div className="flex flex-col w-[50vw]">
                            <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Company Name</p>
                        
                            <textarea id="company" rows="1" class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            ></textarea>
                            
                            <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Job Title </p>
                            <textarea id="title" rows="2" class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                            placeholder="Job Title"
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            ></textarea>
                            <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Location </p>
                            <textarea id="Title" rows="2" class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            >
                               
                            </textarea>
                            
                        </div>
                            <div >
                                <label className="block  pl-[10vw] py-6 text-lg font-semibold text-gray-900 dark:text-emerald-800 text-start">
                                    Requirements
                                    {/* https://react-select.com/creatable Select source */}
                                    <CreatableSelect
                                    className="w-[30vw] min-w-1.5 "
                                    isMulti
                                    options={jobRequiremets}
                                    onChange={(newValue) => {
                                        const selectedStrings = newValue.map((option) => option.value);
                                        setFormData(prev => ({
                                        ...prev,
                                        requirements: selectedStrings
                                        }));
                                    }}
                                    />
                                     
                                    </label>
                            </div>
                        
                    </div>  
                    
                <label for="message" class="block mb-2 text-4xl text-start  text-emerald-800 py-2 font-bold">Job Description</label>
                <textarea id="message" 
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[50vh]"
                value={formData.job_description}
                onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                placeholder="Write your message here..."></textarea>
                
                
                
                    <div className="p-2 flex flex-col">
                        <label
                            className="block mb-2 text-lg font-semibold text-gray-900 dark:text-emerald-800 text-start"
                            htmlFor="file_input"
                        >
                            Choose Background Image
                        </label>
                        <input
                            className="block w-[30vw] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white file:bg-[#891839] file:text-white file:rounded-lg file:border-0 file:px-4 file:py-2 file:cursor-pointer"
                            id="file_input"
                            type="file"
                            multiple 
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Application Link </p>
                            <textarea id="link" rows="2" class="block p-2.5 w-[30vw] text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                            placeholder="Application Link"
                            value={formData.application_link}
                            onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                            ></textarea>
                         <div className="py-2 pr-2 flex">
                            <button 
                            onClick={(e) => {
                                handleSubmit();
                            }}
                            className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#891839] hover:ring-2  text-white text font-bold py-2 px-6 rounded-md">
                            Submit
                        </button> 

                         </div>
                        
                    </div>
                    
                </form>
                                    
            </div>
        </>
    );
}