import Navbar_admin from "../header_admin";
import { useState } from "react";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import { Datepicker, ThemeProvider} from "flowbite-react";
import { useParams } from 'react-router-dom';

export const Create_Event = () => {
    
  
    const [formData, setFormData] = useState({
        event_id: "",
        event_name:"",
        event_description:"",
        event_date:"",
        venue:"",
        created_by: "",
        attendees: [],
        donatable:false,
        image:null,

    });
    const handleSubmit=()=>{

    }
    
    
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
                      
                        selected={formData.event_date}
                        onChange={(date) => setFormData({ ...formData, event_date: date })}
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
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image:e.value})}
                    className="block w-[30vw] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white file:bg-[#891839] file:text-white file:rounded-lg file:border-0 file:px-4 file:py-2 file:cursor-pointer"
                    id="file_input"
                    type="file"
                />
                </div>
                <div className="py-2 pl-2 flex">
                <button 
                    onClick={handleSubmit}
                    className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#891839] hover:ring-2  text-white text font-bold py-2 px-6 rounded-md">
                    Submit
                </button> 

                         </div>
            </form>
            

        </>
    );
}