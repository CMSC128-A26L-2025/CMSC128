import Navbar_admin from "../header_admin";
import { useState, useRef } from "react";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import { Datepicker, ThemeProvider} from "flowbite-react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import objectId from 'bson-objectid';
import { useAuth } from '../../auth/AuthContext';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const Create_Event = () => {
    const fileInputRef = useRef(null);
    const { authAxios, user } = useAuth();
    const [formData, setFormData] = useState({
        event_id: objectId().toHexString(),
        event_name:"",
        event_description:"",
        event_date:new Date(),
        venue:"",
        created_by: `${user?._id}`,
        attendees: [],
        donatable:false,
        files:[],

    });
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

    const handleSubmit = async () => {
        try {
          const fileFormData = new FormData();
          actualFiles.forEach(file => fileFormData.append("files[]", file));
      
          const file_res = await axios.post(`http://localhost:5050/events/${formData.event_id}/upload`, fileFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          const uploadedFiles = file_res.data.files.map(file => file.serverFilename)
          const eventPostingData = {
              event_name: formData.event_name,
              event_description: formData.event_description,
              event_date: formData.event_date,
              venue: formData.venue,
              created_by: formData.created_by,
              attendees: formData.attendees,
              link: formData.link,
              files: uploadedFiles, 
          }
      
          const res = await axios.post("http://localhost:5050/events/create", eventPostingData); // Send as JSON
          alert("Job posting submitted successfully!");
        } catch (err) {
          console.error("Error creating job posting:", err);
          alert("Submission failed.");
        }
    };
    
    
    return(
        <>  
            <Speed_Dial_Admin></Speed_Dial_Admin>
            <div className="w-screen">
                <Navbar_admin>
                    
                </Navbar_admin>
            </div>
            <form className="bg-[#DDDDDD] bg-cover bg-center bg-no-repeat h-[auto] pt-17 pb-30 px-10 ">
                <div className="flex p-1">
                    
                    <div className="flex flex-col w-[50vw]">
                        <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Event Title</p>

                        <textarea id="title" rows="2" 
                        value={formData.event_name}
                        onChange={(e) => setFormData({...formData, event_name:e.target.value})}
                        class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                        
                        placeholder="Title"></textarea>
                         <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Venue</p>

                        <textarea 
                        id="venue" rows="2"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                        placeholder="Venue"></textarea>
                        <div class="relative max-w-sm ">
                        
                        <label>
                        <Datepicker 
                      
                        value={formData.event_date}
                        onSelectedDataChanged={(date) => setFormData({ ...formData, event_date: date })}
                        className= "py-4 pr-1"labelTodayButton="Today" labelClearButton="Clear" minDate={new Date()} ></Datepicker>
                        </label> 
                        {console.log(formData)}
                        
                    </div>
                    <label class="inline-flex items-center cursor-pointer w-fit">
                    <input 
                    type="checkbox" 
                    value={formData.donatable}
                    onChange={(e) => setFormData({ ...formData, donatable:e.target.value})} 
                    class="sr-only peer"></input>
                    <div class="relative w-14 h-7 peer-focus:outline-none rounded-full peer bg-[#891839] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>

                    <span class="ms-3 text-lg  text-emerald-800 font-semibold  ">Charity Event?</span>
                    </label>
                    </div>
                </div>  
                
            <label for="message" class="block mb-2 text-4xl text-start  text-emerald-800 py-2 font-bold">Event Description</label>
            <textarea 
            id="message" 
            value={formData.event_description}
            onChange={(e) => setFormData({ ...formData, event_description:e.target.value})}
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[50vh]"
             placeholder="Write your message here..."></textarea>
            
            
            
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
                
                    onClick={(e) => {
                        handleSubmit();
                    }}
                    className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#891839] hover:ring-2  text-white text font-bold py-2 px-6 rounded-md">
                    Submit
                </button> 

                         </div>
            </form>
            

        </>
    );
}