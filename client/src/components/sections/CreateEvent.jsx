import Navbar_admin from "../header_admin";
import Footer from "../footer";
import { useState, useEffect, useRef } from "react";
import { Datepicker, ThemeProvider } from "flowbite-react";
import { ScrollToTop } from "../../utils/helper";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import axios from "axios";
import objectId from 'bson-objectid';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "flowbite-react";
import { useAuth } from "../../auth/AuthContext";
import { LuPencil } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import Sidebar from "../Sidebar";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const CreateEvent = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const [formData, setFormData] = useState({
        event_name: "",
        event_description: "",
        event_date: new Date(),
        venue: "",
        created_by: `${user?._id}` || "",
        donatable: false,
        link: "",
    });

    const [actualFiles, setActualFiles] = useState([]);      // Store actual file objects
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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
            alert(errors.join('\n'));    // Or use a toast/modal/etc.
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setActualFiles(validFiles);

        if (validFiles.length > 0) {
            setFormData((prev) => ({
                ...prev,
                image: validFiles[0],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting...");

        if (!formData.event_name.trim()) {
            alert("Event Name is required.");
            setIsSubmitting(false);
            return;
        }
        if (!formData.venue.trim()) {
            alert("Venue is required.");
            setIsSubmitting(false);
            return;
        }

        try {
            const submissionFormData = new FormData();

            submissionFormData.append('event_name', formData.event_name.trim());
            submissionFormData.append('event_description', formData.event_description.trim());
            submissionFormData.append('event_date', new Date(formData.event_date).toISOString());
            submissionFormData.append('venue', formData.venue.trim());
            submissionFormData.append('created_by', formData.created_by);
            submissionFormData.append('donatable', formData.donatable.toString());
            submissionFormData.append('link', formData.link.trim());

            actualFiles.forEach(fileObject => {
                submissionFormData.append("files[]", fileObject, fileObject.name);
            });
            console.log("Submitting event data with files...");
            const response = await authAxios.post("/events/create", submissionFormData, {});

            alert(`Event created successfully!`);
            navigate('/admin_main');
        } catch (err) {
            console.error("Error creating event:", err.response?.data || err.message || err);
            alert("Event submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>  
            <Speed_Dial_Admin />
            <div className="w-screen">
                <Navbar_admin toggleSidebar={toggleSidebar}/>
            </div>

            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <form className="bg-gray-100 px-4 sm:px-6 lg:px-10 py-12 flex flex-col items-center gap-8 min-h-screen pr-20 sm:pr-20 md:pr-20"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full">
                        <div className="flex items-center gap-2 cursor-pointer text-[#145C44] mb-2 mt-20 ml-10 sm:mt-[5vh] lg:mt-[10vh] sm:pt-10 md:pt-10 lg:pt-0"
                            onClick={() => navigate('/Admin_main')}
                        >
                            <IoIosArrowBack className="text-sm text-[#145C44]" />
                            <span className="text-sm font-light">Back</span>
                        </div>
                        <div className="flex items-center text-3xl lg:text-4xl font-bold text-[#145C44] mt-2">
                            <LuPencil className="mr-2 ml-10"/>
                            Create an event
                        </div>
                    </div>

                    {/* Event name, Venue */}
                    <div className="w-full flex flex-col lg:flex-row gap-8 pl-15">
                        <div className="w-full lg:w-1/2 flex flex-col gap-4 pt-5">
                            {[
                                { label: "Event Name", key: "event_name", type: "text" },
                                { label: "Venue", key: "venue", type: "text" },
                            ].map(({ label, key, type }) => (
                            <div key={key} className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-gray-700 text-left">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    placeholder={`Enter ${label}`}
                                    className="flex-1 border border-gray-300 rounded-md p-2 placeholder:text-sm text-sm"
                                    value={formData[key]}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                />
                            </div>
                            ))}

                        {/* Event Date and Charity Toggle */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2">
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-gray-700 text-left">Event Date</label>
                                <Datepicker
                                    value={formData.event_date}
                                    onChange={(date) => setFormData({ ...formData, event_date: date })}
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        color: '#374151',
                                    }}
                                />
                            </div>

                            {/* Charity Event Toggle */}
                            <div className="flex items-center gap-4 pl-37 sm:pl-0 md:pl-0 lg:pl-0">
                                <label className="inline-flex items-center w-fit">
                                    <input
                                        name="donatable"
                                        type="checkbox" 
                                        value={formData.donatable}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div class="relative w-14 h-7 peer-focus:outline-none rounded-full peer bg-[#891839] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>
                                    <span class="ms-3 text-lg  text-emerald-800 font-semibold">Charity Event?</span>
                                </label>
                            </div>
                        </div>
                            {/* Description */}
                            <div className="flex items-start gap-4 mt-4">
                            <label className="w-32 text-sm font-medium text-gray-700 text-left pt-2">Event Description</label>
                            <textarea
                                name="event_description"
                                placeholder="Enter Event Description"
                                rows={6}
                                className="flex-1 border border-gray-300 rounded-md p-2 placeholder:text-sm text-sm text-gray-800"
                                value={formData.event_description}
                                onChange={handleInputChange}
                            />
                            </div>
                        </div>

                        <div className="hidden lg:block border-l border-gray-300 ml-20"></div>

                        {/* File upload */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center">
                            <label className="text-sm font-medium text-gray-700 mb-2">Choose Background Image</label>
                            <div className="relative mb-2 w-[380px] h-[260px] bg-gray-200 border border-gray-300 flex items-center justify-center">
                                {formData.image ? (
                                    <>
                                        <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, image: null });
                                                if (fileInputRef.current) fileInputRef.current.value = '';
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
                                multiple
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-md file:bg-[#891839] file:text-white file:border-none file:px-4 file:py-2 cursor-pointer"
                                id="file_input"
                                type="file"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row justify-end w-full gap-4 mt-20 pl-25 md:pl-15 lg:pl-15 pr-7 md:pr-15 lg:pr-15 mb-8">
                        <button
                            type="button"
                            onClick={() => navigate('/Admin_main')}
                            className="bg-[#891839] text-white font-medium px-6 py-2 rounded-md cursor-pointer focus:!outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#145C44] text-white font-medium px-6 py-2 rounded-md cursor-pointer focus:!outline-none"
                        >
                            Create Event
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
};