import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../header';
import Footer from '../footer';
import CreatableSelect from "react-select/creatable";
import { jobRequiremets } from "../../utils/models";
import { ScrollToTop } from '../../utils/helper';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';
import { BsPersonFill } from "react-icons/bs";
import { FaCamera } from "react-icons/fa6";
import { HiMinusSm } from "react-icons/hi";
import './ProfilePage.css'; // Make sure this CSS exists and is correctly styled
import Sidebar from '../Sidebar';
import Loading from "../loading";
import axios from 'axios'; // Import axios for FormData (though authAxios should also work)

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ProfilePage() {
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const { id } = useParams();

    // State for fetching and displaying profile data
    const [profileData, setProfileData] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({}); // Stores data for mutable fields
    const [originalData, setOriginalData] = useState({});

    // State for profile picture upload
    const [selectedFile, setSelectedFile] = useState(null); // Holds the actual File object for upload
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // URL for displaying the image
    const fileInputRef = useRef(null); // Ref for the hidden file input

    // State for UI/loading
    const [activeTab, setActiveTab] = useState('pending');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    // Calendar/Event hover states
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [isHoveringTile, setIsHoveringTile] = useState(false);
    const [isHoveringPopup, setIsHoveringPopup] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    // Initial data fetch on component mount or user change
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        ScrollToTop();
        fetchProfileData();
    }, [authAxios, user?._id]); // Re-fetch if authAxios (token) or user ID changes

    // Effect to handle image preview updates
    useEffect(() => {
        if (selectedFile) {
            // Create a local URL for immediate preview of the newly selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else if (profileData?.files && profileData.files.length > 0) {
            // If no new file selected, but profileData has existing files, use the server URL
            setImagePreviewUrl(`http://localhost:5050/uploads/${profileData.files[0].serverFilename}`);
        } else {
            // Default avatar if no picture exists
            setImagePreviewUrl("/src/assets/default_avatar.png");
        }
    }, [selectedFile, profileData]); // Dependency on selectedFile and profileData

    const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAxios.get(`/alumni/find-alumni/${id}`);
            console.log("Profile data fetched:", response.data); // Debugging

            setProfileData(response.data);
            setUpcomingEvents(response.data.events_attended);
            setJobApplications(response.data.job_postings);

            // Fetch bookmarked jobs
            if (response.data.bookmarked_jobs && response.data.bookmarked_jobs.length > 0) {
                const jobDetails = await Promise.all(
                    response.data.bookmarked_jobs.map(async (jobRef) => {
                        const jobId = jobRef?.$oid || jobRef?._id || jobRef;
                        const jobRes = await authAxios.get(`/jobs/find-job/${jobId}`);
                        return jobRes.data;
                    })
                );
                setBookmarkedJobs(jobDetails);
            } else {
                setBookmarkedJobs([]);
            }

            // Fetch bookmarked events
            if (response.data.bookmarked_events && response.data.bookmarked_events.length > 0) {
                const eventDetails = await Promise.all(
                    response.data.bookmarked_events.map(async (eventRef) => {
                        const eventId = eventRef?.$oid || eventRef?._id || eventRef;
                        const eventRes = await authAxios.get(`/events/find-event/${eventId}`);
                        return eventRes.data;
                    })
                );
                setBookmarkedEvents(eventDetails);
            } else {
                setBookmarkedEvents([]);
            }

        const editableFields = {
            contact_number: response.data?.contact_number || '',
            address: response.data?.address || '',
            current_job_title: response.data?.current_job_title || '',
            company: response.data?.company || '',
            industry: response.data?.industry || '',
            skills: response.data?.skills || [],
        };

        setEditableData(editableFields);
        setOriginalData(editableFields);
    } catch (err) {
    console.error('Error fetching profile data:', err);
    setError('Failed to load profile information.');
    } finally {
    setIsLoading(false);
    }
};

    const handleEditToggle = () => setIsEditing(!isEditing);

    // Handler for text/number inputs (NOT for file input)
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contact_number") {
            // Allow only numbers or an empty string
            if (value === "" || /^[0-9]+$/.test(value)) {
                setEditableData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setEditableData(prev => ({ ...prev, [name]: value }));
        }
        // console.log("Editable data (after change):", editableData); // Will show old state for the current render cycle
    };

    // Dedicated handler for the file input
    const handleProfileFileChange = (e) => {
        const file = e.target.files[0]; // Get the actual File object
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        if (file) {
            const errors = [];
            if (!imageTypes.includes(file.type)) {
                errors.push(`${file.name} is not a supported image file.`);
            }
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB size limit.`);
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
                setSelectedFile(null); // Clear selected file if invalid
                if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input visually
                return;
            }

            setSelectedFile(file); // Store the valid File object
            // The useEffect for image preview will now pick this up
            console.log("Selected file for upload:", file.name); // Debugging
        } else {
            setSelectedFile(null); // No file selected
            console.log("No file selected."); // Debugging
        }
    };

    const handleSave = async () => {
        // Validation for contact number
        if (editableData.contact_number && !/^[0-9]+$/.test(editableData.contact_number)) {
            alert("Invalid phone number.");
            return;
        }

        let finalFilesData = profileData?.files || []; // Start with existing file info from profileData

        // --- Step 1: Upload new profile picture if selected ---
        if (selectedFile) {
            console.log("Attempting to upload new profile picture..."); // Debugging
            const fileFormData = new FormData();
            // The key "profilePicture" should match the field name your backend expects (e.g., multer.single('profilePicture'))
            fileFormData.append("files[]", selectedFile); 

            try {
                // IMPORTANT: This endpoint might need to be `/alumni/upload-profile-picture/${id}`
                // or similar, not `/auth/register/upload`, which is usually for registration.
                // Verify your backend API documentation.
                const file_res = await authAxios.post(`http://localhost:5050/auth/register/upload`, fileFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("File upload response:", file_res.data); // Debugging

                // Assuming backend response like: { file: { originalname: "...", serverFilename: "..." } }
                // Adjust these paths if your backend's response structure is different
                finalFilesData = file_res.data.files.map(file => ({
                    serverFilename: file.serverFilename,
                }));
                // Update local state
                // Clear selected file state and input after successful upload
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                alert("Profile picture updated successfully!");

            } catch (err) {
                console.error("Profile picture upload error:", err);
                const errorMessage = err.response?.data?.message || "Failed to upload profile picture. Please try again.";
                alert(errorMessage);
                return; // Stop the save process if file upload fails
            }
        }
        // --- End File Upload Step ---

        // --- Step 2: Update remaining profile data ---
        try {
            setProfileData(prev => ({ ...prev, files: finalFilesData }));
            const dataToSave = {
                ...editableData,
                files: finalFilesData, // Send the (potentially new) file information to the profile update
            };
            console.log("Data to save to profile:", dataToSave); // Debugging

            await authAxios.put(`/alumni/edit-profile/${id}`, dataToSave);
            setIsEditing(false);
            fetchProfileData(); // Re-fetch profile data to ensure all UI updates are in sync
            alert("Profile details saved successfully!"); // More specific alert
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.response?.data?.message || 'Failed to save profile changes.');
        }
    };

    const handleCancel = () => {
        setEditableData(originalData);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsEditing(false);
    };


    const filteredJobs = jobApplications.filter(job => job.status?.toLowerCase() === activeTab);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FDF0D5]">
                <p className="text-2xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 overflow-y-auto bg-[#891839]">
            <div className="fixed top-0 w-full z-50">
                <Navbar toggleSidebar={toggleSidebar} />
            </div>
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>

    <motion.main
        className="pt-24 px-4 md:px-6 lg:px-8 w-full max-w-5xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
    >
        <section className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="relative w-28 h-28">
            {/* Profile picture */}
            <div className="w-full h-full rounded-full border-4 border-[#891839] flex items-center justify-center bg-gray-100 overflow-hidden relative">
            {imagePreviewUrl ? ( // Check if imagePreviewUrl has a value
                    <img
                        src={imagePreviewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Fallback if imagePreviewUrl is somehow empty (shouldn't happen with the useEffect)
                    <BsPersonFill className="text-9xl text-[#891839] mt-7" />
                )}


            {isEditing && (
                <>
                <label
                    htmlFor="profilePicture"
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/40 transition duration-200"
                    title={
                    profilePicPreview || profileData?.profile_picture
                        ? "Change Profile Picture"
                        : "Add Profile Picture"
                    }
                >
                    <FaCamera className="text-white text-3xl" />
                </label>
                <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleProfileFileChange(e);
                        setNewProfilePic(file);
                    }
                    }}
                />
                </>
            )}
            </div>

            {isEditing && (profilePicPreview || profileData?.profile_picture) && (
            <button
                type="button"
                onClick={handleRemoveProfilePic}
                className="absolute bottom-0 right-0 text-white bg-[#891839] rounded-full shadow-md cursor-pointer"
                title="Remove Profile Picture"
            >
                <HiMinusSm className="text-3xl" />
            </button>
            )}
        </div>

            <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#891839]">{profileData?.name}</h2>
            <p className="text-gray-600">{profileData?.email}</p>
            <p className="text-gray-600">Batch Graduated: {profileData?.graduation_year}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <ProfileSection title="Contact Info" fields={[
                { label: "Phone", name: "contact_number" },
                { label: "Address", name: "address" }
            ]} editableData={editableData} isEditing={isEditing} handleChange={handleChange} />

            <ProfileSection title="Professional Info" fields={[
                { label: "Current Job Title", name: "current_job_title" },
                { label: "Company", name: "company" },
                { label: "Industry", name: "industry" }
            ]} editableData={editableData} isEditing={isEditing} handleChange={handleChange} />

            <div className="col-span-full md:col-span-1">
            <h4 className="text-xl font-semibold text-[#891839] mb-2">Skills</h4>
            <span className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1 mt-4 block">
                Skills
            </span>

            {isEditing ? (
                <>
                <CreatableSelect
                    isMulti
                    options={jobRequiremets}
                    onChange={(selectedOptions) =>
                    setEditableData(prev => ({
                        ...prev,
                        skills: selectedOptions.map(option => option.value)
                    }))
                    }
                    value={(editableData.skills || []).map(skill => ({ label: skill, value: skill }))}
                    className="mb-4"
                    classNamePrefix="select"
                    onCreateOption={() => {}}
                    styles={{
                    control: (base) => ({
                        ...base,
                        borderWidth: '2px', 
                        borderRadius: '0.75rem',
                        borderColor: '#1F2937',
                        padding: '0.25rem',
                        boxShadow: 'none',
                        '&:hover': {
                        borderWidth: '1px',
                        borderColor: '#1F2937',
                        },
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
                        backgroundColor: '#def7ec',
                        color: '#374151',
                        borderRadius: '9999px',
                        padding: '0 6px',
                        paddingRight: '0.25rem',
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: '#046C4E',
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        borderRadius: '1000px',
                        padding: '2px',
                        marginLeft: '8px',
                        color: '#891839 ',
                        cursor: 'pointer',
                        '&:hover': {
                        backgroundColor: '#def7ec',
                        color: '#E02424',
                        },
                    }),                      
                    }}
                />
                </>
                ) : (
                <div className="border rounded h-40 overflow-y-auto pt-2 custom-scrollbar">
                    {profileData?.skills?.length > 0 ? (
                    profileData.skills.map((skill, idx) => (
                        <div
                        key={idx}
                        className="text-gray-700 font-semibold break-words"
                        >
                        {skill}
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-400">No Data</p>
                    )}
                </div>
                )}
            </div>
        </div>
            <div className="mt-6 flex justify-center gap-4">
                {user._id === id ? (
                    <>
                        {isEditing ? (
                            <>
                                <button 
                                    className="force-button bg-gray-500 hover:bg-gray-600" 
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button className="save-button" onClick={handleSave}>Save</button>
                            </>
                        ) : (
                            <button className="force-button" onClick={handleEditToggle}>Edit Profile</button>
                        )}
                    </>
                ) : (
                    null
                )}
            </div>
        </section>

                    <section className="bg-white rounded-3xl shadow-lg p-8 relative">
                        <h3 className="text-3xl font-bold text-[#891839] mb-6">Upcoming Events</h3>
                        <div className="custom-calendar-wrapper">
                            <Calendar
                                tileContent={({ date }) => {
                                    const eventsToday = upcomingEvents.filter(e => new Date(e.event_date).toDateString() === date.toDateString());
                                    return (
                                        <div
                                            className={`relative w-full h-full flex flex-col items-center justify-center rounded-md ${
                                                eventsToday.length > 0 ? 'bg-[#0E4221] text-white' : ''
                                            }`}
                                            onMouseEnter={(e) => {
                                                if (eventsToday.length > 0) {
                                                    setHoveredEvent(eventsToday);
                                                    setHoverPosition({ x: e.clientX, y: e.clientY });
                                                    setIsHoveringTile(true);
                                                }
                                            }}
                                            onMouseLeave={() => setIsHoveringTile(false)}
                                        >
                                            {eventsToday.length > 0 && (
                                                <div className="flex justify-center items-center gap-1 mt-1">
                                                    {eventsToday.map((_, idx) => (
                                                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                                className="custom-calendar"
                            />

                            {(hoveredEvent && (isHoveringTile || isHoveringPopup)) && (
                                <div
                                    className="popup-events"
                                    onMouseEnter={() => setIsHoveringPopup(true)}
                                    onMouseLeave={() => {
                                        setIsHoveringPopup(false);
                                        setHoveredEvent(null);
                                    }}
                                    style={{
                                        position: 'fixed',
                                        top: hoverPosition.y + 10,
                                        left: hoverPosition.x + 10,
                                        background: 'white',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 10px rgba(0,0,0,0.15)',
                                        zIndex: 1000,
                                    }}
                                >
                                    {hoveredEvent.map((event) => (
                                        <div
                                            key={event.event_id}
                                            className="popup-event-item cursor-pointer"
                                            onClick={() => {
                                                navigate(`/events/${event.event_id}`);
                                                setHoveredEvent(null);
                                            }}
                                        >
                                            {event.event_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl shadow-lg p-8">
                        <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Bookmarked Jobs</h3>
                        {bookmarkedJobs.length === 0 ? (
                            <p className="text-gray-300 text-center">No bookmarked jobs.</p>
                        ) : (
                            <ul className="space-y-4">
                                {bookmarkedJobs.map((job, index) => (
                                    <Link
                                        key={index}
                                        to={`/job-details/${job._id}`}
                                        className="transform transition-transform duration-300 hover:scale-105 block"
                                    >
                                        <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-50 w-full shadow-lg hover:shadow-xl">
                                            <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                <h3 className="text-4xl font-semibold mb-3 pb-5">{job.job_title || 'No title'}</h3>
                                                <p>Company: {job.company || 'No company'}</p>
                                                <p>
                                                    Date Posted: {job.date_posted ? new Date(job.date_posted).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }) : 'Unknown date'}
                                                </p>
                                                <p>Location: {job.location || 'No location'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="bg-white rounded-3xl shadow-lg p-8">
                        <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Bookmarked Events</h3>
                        {bookmarkedEvents.length === 0 ? (
                            <p className="text-gray-300 text-center">No bookmarked events.</p>
                        ) : (
                            <ul className="space-y-4">
                                {bookmarkedEvents.map((event, index) => (
                                    <Link
                                        key={index}
                                        to={`/event-details/${event._id}`}
                                        className="transform transition-transform duration-300 hover:scale-105 block"
                                    >
                                        <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-50 w-full shadow-lg hover:shadow-xl">
                                            <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                <h3 className="text-4xl font-semibold mb-3 pb-5">{event.event_name || 'No title'}</h3>
                                                <p>Venue: {event.venue || 'No company'}</p>
                                                <p>
                                                    Date: {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }) : 'Unknown date'}
                                                </p>
                                                <p>Location: {event.location || 'No location'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="bg-white rounded-3xl shadow-lg p-8 mb-16">
                        <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Job Postings Application</h3>
                        <div className="flex justify-center space-x-4 mb-6">
                            {['pending', 'approved', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    className={`force-button ${activeTab === status ? 'active-tab' : ''}`}
                                    onClick={() => setActiveTab(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <JobList jobs={filteredJobs} /> {/* Ensure JobList is correctly implemented below */}
                    </section>
                </motion.main>
            </div>
            <Footer />
        </div>
    );
}

// ProfileSection and JobList components (kept as is, assuming they are correct)
function ProfileSection({ title, fields, editableData, isEditing, handleChange }) {
    return (
        <div>
            <h3 className="text-xl font-bold text-[#891839] mb-4 text-center">{title}</h3>
            <div className="space-y-3">
                {fields.map((field) => (
                    <div key={field.name}>
                        <span className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1 block">
                            {field.label}
                        </span>
                        {isEditing ? (
                            <input
                                type="text"
                                name={field.name}
                                value={editableData[field.name] || ''}
                                onChange={handleChange}
                                className="border-2 rounded-xl p-2 text-gray-800 focus:border-[#891839] w-full"
                            />
                        ) : (
                            (editableData[field.name] != null && editableData[field.name] != '') ? (
                                <p className="text-gray-700 font-semibold">{editableData[field.name]}</p>
                            ) : (
                                <p className="text-gray-400"> No Data </p>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function JobList({ jobs }) {
    if (jobs.length === 0) return <p className="text-gray-300 text-center">No jobs found.</p>;

    return (
        <ul className="space-y-4">
            {jobs.map((job) => (
                <li key={job.job_id} className="border-2 border-[#891839] rounded-2xl p-6 hover:bg-[#891839] hover:text-white transition">
                    <h4 className="font-bold text-2xl mb-1">{job.job_title}</h4>
                    <p className="text-md">{job.company} - {job.location}</p>
                    <p className="text-sm text-gray-400">Posted on {new Date(job.date_posted).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    );
}