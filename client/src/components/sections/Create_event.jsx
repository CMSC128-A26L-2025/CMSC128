import Navbar_admin from "../header_admin";
import { useState, useRef } from "react";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import { Datepicker, ThemeProvider} from "flowbite-react";
import { useNavigate, useParams } from 'react-router-dom';
import objectId from 'bson-objectid';
import { useAuth } from '../../auth/AuthContext';
import Sidebar from "../Sidebar";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const Create_Event = () => {
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
    const [actualFiles, setActualFiles] = useState([]); // Store actual file objects
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, event_date: date }));
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
            alert(errors.join('\n')); // Or use a toast/modal/etc.
            if (fileInputRef.current) fileInputRef.current.value = "";
            setActualFiles([]);
            return;
        }
        
        setActualFiles(validFiles);
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
    
    return(
        <>  
            <Speed_Dial_Admin></Speed_Dial_Admin>
            <div className="w-screen">
                <Navbar_admin toggleSidebar={toggleSidebar}>
                    
                </Navbar_admin>
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <form className="bg-[#DDDDDD] bg-cover bg-center bg-no-repeat h-[auto] pt-17 pb-30 px-10 "
                    onSubmit={handleSubmit}
                >
                    <div className="flex p-1">
                        
                        <div className="flex flex-col w-[50vw]">
                            <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Event Title</p>

                            <textarea 
                                id="event_name" 
                                rows="2" 
                                name="event_name"
                                value={formData.event_name}
                                onChange={handleInputChange}
                                class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                                
                                placeholder="Title"
                                required
                            />
                            <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Venue</p>
                            
                            <textarea 
                                id="venue" 
                                rows="2"
                                name="venue"
                                value={formData.venue}
                                onChange={handleInputChange}
                                class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                                placeholder="Venue"
                                required
                            />
                            <div class="relative max-w-sm ">
                            
                            <label>
                            <Datepicker 
                                id="event_datepicker"
                                selected={formData.event_date}
                                onSelectedDataChanged={handleDateChange}
                                className= "py-4 pr-1"
                                labelTodayButton="Today" 
                                labelClearButton="Clear" 
                                minDate={new Date()}
                            />
                            </label> 
                            {console.log(formData)}
                            
                        </div>
                        <label class="inline-flex items-center cursor-pointer w-fit">
                        <input 
                            type="checkbox"
                            name="donatable"
                            checked={formData.donatable}
                            onChange={handleInputChange} 
                            class="sr-only peer"
                        />
                        <div class="relative w-14 h-7 peer-focus:outline-none rounded-full peer bg-[#891839] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>

                        <span class="ms-3 text-lg  text-emerald-800 font-semibold  ">Charity Event?</span>
                        </label>
                        </div>
                    </div>  
                    
                <label for="message" class="block mb-2 text-4xl text-start  text-emerald-800 py-2 font-bold">Event Description</label>
                <textarea 
                    id="message" 
                    name="event_description"
                    value={formData.event_description}
                    onChange={handleInputChange}
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[50vh]"
                    placeholder="Write your message here..."
                />
                
                
                
                <div className="p-2">
                    <label
                        className="block mb-2 text-lg font-semibold text-gray-900 dark:text-emerald-800 text-start"
                        htmlFor="file_input"
                    >
                        Choose Background Image
                    </label>
                    <input
                        multiple 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-[30vw] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white file:bg-[#891839] file:text-white file:rounded-lg file:border-0 file:px-4 file:py-2 file:cursor-pointer"
                        id="file_input"
                        type="file"
                    />
                </div>
                <div className="py-2 pl-2 flex">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="transition-transform duration-300 ease-in-out hover:scale-105 w-full sm:w-auto bg-[#891839] hover:bg-[#a1284f] text-white text-xl font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#891839] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Event
                    </button>
                </div>
                </form>
            </div>

        </>
    );
}