import Navbar from "../header";
import Footer from "../footer";
import { useState, useEffect, useRef } from "react";
import { ScrollToTop } from "../../utils/helper";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import CreatableSelect from "react-select/creatable";
import { jobRequiremets } from "../../utils/models";
import { useParams } from 'react-router-dom';
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { LuPencil } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import Sidebar from "../Sidebar";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const Post_Job = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const [requirementsOptions, setRequirementsOptions] = useState(jobRequiremets.map(req => ({ value: req, label: req })));
    const [selectedRequirements, setSelectedRequirements] = useState([]);
    const [formData, setFormData] = useState({
        job_title: "",
        company: "",
        location: "",
        job_description: "",
        requirements: [],
        application_link: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actualFiles, setActualFiles] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        ScrollToTop();
    }, []);

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] })
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
            setActualFiles([])
            return;
        }
    
        setActualFiles(validFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submissionFormData = new FormData();

            submissionFormData.append('job_title', formData.job_title);
            submissionFormData.append('company', formData.company);
            submissionFormData.append('location', formData.location);
            submissionFormData.append('job_description', formData.job_description);
            formData.requirements.forEach((req, index) => {
                submissionFormData.append(`requirements[${index}]`, req);
            });
            submissionFormData.append('application_link', formData.application_link);
            submissionFormData.append('status', 'pending');
            submissionFormData.append('date_posted', Date.now)
            submissionFormData.append('start_date', formData.start_date);
            submissionFormData.append('end_date', formData.end_date);
            submissionFormData.append('posted_by', user?._id);
            
            actualFiles.forEach(fileObject => {
                submissionFormData.append("files[]", fileObject, fileObject.name);
            });
            
            const res = await authAxios.post("/jobs/create", submissionFormData, {});

            alert("Job posting submitted successfully!");
            console.log("Response:", res.data);
            navigate(`/jobs`);
        } catch (err) {
            console.error("Error creating job posting:", err);
            alert("Submission failed.");
        }
    };

    return (
        <>  
            <div className="w-screen">
                <Navbar toggleSidebar={toggleSidebar}/>
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                >
             <Sidebar />
        </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <form
                onSubmit={handleSubmit}
                className="bg-gray-100 px-4 sm:px-6 lg:px-10 py-12 flex flex-col items-center gap-8 min-h-screen"
            >
                <div className="w-full">
                    <div
                        className="flex items-center gap-2 cursor-pointer text-[#145C44] mb-2 mt-20 ml-10 sm:mt-[5vh] lg:mt-[10vh] sm:pt-10 md:pt-10 lg:pt-0"
                        onClick={() => navigate(-1)}
                    >
                        <IoIosArrowBack className="text-sm text-[#145C44]" />
                        <span className="text-sm font-light">Back</span>
                    </div>
                    <div className="flex items-center text-3xl lg:text-4xl font-bold text-[#145C44] mt-2">
                        <LuPencil className="mr-2 ml-10"/>
                        Create a job post
                    </div>
                </div>

                {/* Company Name, Job Title, Location, Link */}
                <div className="w-full flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 pt-5 pr-10 md:pr-15">
                        {[
                            { label: "Company Name", key: "company", type: "text" },
                            { label: "Job Title", key: "job_title", type: "text" },
                            { label: "Location", key: "location", type: "text" },
                            { label: "Application Link", key: "application_link", type: "text" },
                        ].map(({ label, key, type }) => (
                            <div key={key} className="flex items-center gap-4">
                                <label className="w-42 text-sm font-medium text-gray-700 text-left pl-15">{label}</label>
                                <input
                                    type={type}
                                    placeholder={`Enter ${label}`}
                                    className="flex-1 border border-gray-300 rounded-md p-2 placeholder:text-sm text-sm"
                                    value={formData[key]}
                                    onChange={(e) => {setFormData({ ...formData, [key]: e.target.value })}}
                                />
                            </div>
                        ))}

                        {/* Requirements */}
                        <div className="flex flex-row sm:flex-row items-start gap-2">
                            <label className="w-44 text-sm font-medium text-gray-700 text-left pl-15">Requirements</label>
                            <div className="flex-1 w-full">
                                <CreatableSelect
                                    isMulti
                                    options={jobRequiremets}
                                    className="text-sm"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: '#f3f4f6',
                                            borderColor: '#d1d5db',
                                            borderWidth: 1,
                                            boxShadow: 'none',
                                        }),
                                        dropdownIndicator: (base) => ({
                                            ...base,
                                            color: '#9ca3af',
                                        }),
                                        clearIndicator: (base) => ({
                                            ...base,
                                            color: '#9ca3af',
                                        }),
                                        option: (base) => ({
                                            ...base,
                                            backgroundColor: '#ffffff',
                                            color: '#374151',
                                            '&:hover': {
                                                backgroundColor: '#ebf8ff',
                                            },
                                        }),
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: '#2ad69d',
                                            color: '#374151',
                                        }),
                                    }}
                                    onChange={(newValue) => {
                                        const selected = newValue.map((item) => item.value);
                                        setFormData(prev => ({ ...prev, requirements: selected }));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block border-l border-gray-300"></div>
                    
                    {/* Background Image */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                            Choose Background Image
                        </label>
                        <div className="relative mb-2 w-[380px] h-[260px] bg-gray-200 border border-gray-300 flex items-center justify-center">
                            {formData.image ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, image: null });
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-80 cursor-pointer"
                                        title="Remove Image"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-500 text-sm">No image uploaded</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-md file:bg-[#891839] file:text-white file:border-none file:px-4 file:py-2 cursor-pointer"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-6 w-full mt-2 pr-15">
                    <div className="w-full flex flex-col sm:flex-row gap-4 mt-4 pl-12 sm:pl-0 md:pl-0 lg:pl-0">
                        <label className="sm:w-42 text-sm font-medium text-gray-700 text-left pl-3 sm:pl-15 md:pl-15 lg:pl-15">Job Description</label>
                        <textarea
                            placeholder="Enter Job Description"
                            rows={6}
                            className="flex-1 border border-gray-300 rounded-md p-2 placeholder:text-sm placeholder:text-gray-400 text-sm text-gray-800"
                            value={formData.job_description}
                            onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row justify-end w-full gap-4 mt-5 pl-15 pr-15 mb-8">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[#891839] text-white font-medium px-6 py-2 rounded-md cursor-pointer focus:!outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#145C44] text-white font-medium px-6 py-2 rounded-md cursor-pointer focus:!outline-none"
                    >
                        Submit
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
            </div>
            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
}