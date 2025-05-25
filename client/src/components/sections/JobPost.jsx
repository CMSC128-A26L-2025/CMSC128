import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import { useState, useEffect, useRef } from "react";
import { ScrollToTop } from "../../utils/helper";
import CreatableSelect from "react-select/creatable";
import { jobRequiremets } from "../../utils/models";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { LuBuilding2, LuMapPin, LuLink } from "react-icons/lu";
import { CiMoneyBill } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineCloudUpload, HiOutlineX } from "react-icons/hi";
import { BsFileText } from "react-icons/bs";
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
        salary: "",
        requirements: [],
        application_link: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actualFiles, setActualFiles] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 300);
        ScrollToTop();
        return () => clearTimeout(timer);
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
            alert(errors.join('\n'));
            if (fileInputRef.current) fileInputRef.current.value = "";
            setActualFiles([])
            return;
        }
    
        setActualFiles(validFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const submissionFormData = new FormData();

            submissionFormData.append('job_title', formData.job_title);
            submissionFormData.append('company', formData.company);
            submissionFormData.append('location', formData.location);
            submissionFormData.append('job_description', formData.job_description);
            submissionFormData.append('salary', Number(formData.salary));
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
            setIsLoading(false);

            setFormData({
                job_title: "",
                company: "",
                location: "",
                job_description: "",
                salary: "",
                requirements: [],
                application_link: "",
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
            });

            setSelectedRequirements([]);
            setActualFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const addCommas = (number) => {
        if (!number) return '';
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const removeCommas = (value) => value.replace(/,/g, "");



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

            {isLoading ? (
                <Loading />
            ) : (
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="min-h-screen bg-gray-100">
                        <div className="bg-gray-100">
                            <div className="max-w-7xl mx-auto px-6 py-8 pt-30">
                                <div
                                    className="flex items-center gap-3 cursor-pointer text-[#145C44] mb-4 hover:text-[#0d4a35] transition-colors duration-200"
                                    onClick={() => navigate(-1)}
                                >
                                    <IoIosArrowBack className="text-lg" />
                                    <span className="text-sm font-medium">Back</span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-left">
                                    <div>
                                        <div className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#145C44] leading-tight">
                                            Create Job Posting
                                        </div>
                                        <p className="text-gray-600 pl-1">
                                            Fill in the details below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 pt-5 pb-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                            Basic Information
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField
                                                label="Company Name"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                icon={LuBuilding2}
                                            />
                                            
                                            <InputField
                                                label="Job Title"
                                                value={formData.job_title}
                                                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                                                icon={BsFileText}
                                            />
                                            
                                            <InputField
                                                label="Location"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                icon={LuMapPin}
                                            />
                                            
                                            <div className="group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    <CiMoneyBill className="w-5 h-5 text-gray-500" />
                                                    Salary
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 font-medium">₱</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={addCommas(formData.salary)}
                                                        onChange={(e) => {
                                                            const rawValue = removeCommas(e.target.value);
                                                            if (/^\d*$/.test(rawValue)) {
                                                                setFormData({ ...formData, salary: rawValue });
                                                            }
                                                        }}
                                                        className="w-full pl-8 pr-20 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#145C44] focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                        <span className="text-gray-400 text-sm">per month</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <InputField
                                                label="Application Link"
                                                value={formData.application_link}
                                                onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                                                icon={LuLink}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                            Requirements
                                        </h2>
                                        
                                        <CreatableSelect
                                            isMulti
                                            value={formData.requirements.map(req => ({ value: req, label: req }))}
                                            options={jobRequiremets}
                                            placeholder="Select or create requirements..."
                                            className="text-sm"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: '#ffffff',
                                                    borderColor: state.isFocused ? '#145C44' : '#e5e7eb',
                                                    borderWidth: 1,
                                                    borderRadius: '12px',
                                                    padding: '8px',
                                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(20, 92, 68, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                                    minHeight: '48px',
                                                    '&:hover': {
                                                        borderColor: '#9ca3af',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    },
                                                }),
                                                multiValue: (base) => ({
                                                    ...base,
                                                    backgroundColor: '#84E1BC',
                                                    borderRadius: '8px',
                                                    padding: '2px 8px',
                                                }),
                                                multiValueLabel: (base) => ({
                                                    ...base,
                                                    color: '#046C4E',
                                                    fontWeight: '500',
                                                }),
                                                multiValueRemove: (base) => ({
                                                    ...base,
                                                    borderRadius: '6px',
                                                    color: '#dc2626',
                                                    '&:hover': {
                                                        backgroundColor: '#fca5a5',
                                                        color: '#991b1b',
                                                    },
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isHovered ? '#f0fdf4' : '#ffffff',
                                                    color: '#374151',
                                                }),
                                            }}
                                            onChange={(newValue) => {
                                                const selected = newValue.map((item) => item.value);
                                                setFormData(prev => ({ ...prev, requirements: selected }));
                                            }}
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                            Job Description
                                        </h2>
                                        
                                        <textarea
                                            value={formData.job_description}
                                            onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                                            placeholder="Describe the job role, responsibilities, and what you're looking for in a candidate..."
                                            rows={8}
                                            className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#145C44] focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                            Background Image
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden group">
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
                                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 shadow-lg cursor-pointer"
                                                        >
                                                            <HiOutlineX className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <HiOutlineCloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                        <p className="text-gray-500 text-sm font-medium">No image uploaded</p>
                                                        <p className="text-gray-400 text-xs mt-1">Click below to add an image</p>
                                                    </div>
                                                )}
                                            </div>

                                            <label className="block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <div className="w-full px-4 py-3 bg-gradient-to-r from-[#145C44] to-[#0d4a35] text-white rounded-xl cursor-pointer hover:from-[#0d4a35] hover:to-[#145C44] transition-all duration-200 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                                                    Choose Image
                                                </div>
                                            </label>

                                            <p className="text-xs text-gray-500 text-center">
                                                Supported formats: JPEG, PNG, WebP<br />
                                                Maximum size: 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-12 mb-15 pt-8 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/jobs')}
                                    className="px-8 py-3 text-white bg-gradient-to-r from-[#891839] to-[#6d122d] hover:from-[#6d122d] hover:to-[#891839] font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-gradient-to-r from-[#145C44] to-[#0d4a35] hover:from-[#0d4a35] hover:to-[#145C44] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-sm font-medium">{error}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
}

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text" }) => (
    <div className="group">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#145C44] focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md group-hover:border-gray-300"
        />
    </div>
);