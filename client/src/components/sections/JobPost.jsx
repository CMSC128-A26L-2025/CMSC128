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
import { useAuth } from "../../AuthContext";
import { LuPencil } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

export const Post_Job = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const [requirementsOptions, setRequirementsOptions] = useState(jobRequiremets.map(req => ({ value: req, label: req })));
    const [selectedRequirements, setSelectedRequirements] = useState([]);
    const [formData, setFormData] = useState({
        job_id: "",
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
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        ScrollToTop();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authAxios.post('/jobs/post-job', formData);
            console.log("Job posted successfully:", response.data);
            navigate('/jobs');
        } catch (err) {
            console.error("Error posting job:", err);
            setError(err.response?.data?.message || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>  
            <div className="w-screen">
                <Navbar />
            </div>

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
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
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
                            className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-md file:bg-[#891839] file:text-white file:border-none file:px-4 file:py-2"
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.files[0] })
                            }
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
                        onClick={() => navigate(-1)}
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

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
}