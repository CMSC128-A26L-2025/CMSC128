import Navbar from "../header";
import { useState } from "react";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import CreatableSelect from "react-select/creatable";
import { jobRequiremets } from "../../utils/models";
import { useParams } from 'react-router-dom';
import { Button } from "flowbite-react";
export const Post_Job = () => {
    

    const [formData, setFormData] = useState({
        job_id: "",
        job_title: "",
        company:"",
        location: "",
        job_description: "",
        requirements:[],
        application_link:"",
        date_posted: new Date(),
        status: 'not approved',
        approved_by: "",
        approval_date: null,
        image:null,
    });
    const handleSubmit=()=>{

    }
    return(
        <>  
            
            <div className="w-screen">
                <Navbar></Navbar>
            </div>
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
                            value={formData.image}
                            onChange={(e)=> setFormData({...formData, image:e.target.value})}
                        />
                        <p  className="block mb-2 text-4xl text-start  text-emerald-800 font-bold">Application Link </p>
                            <textarea id="link" rows="2" class="block p-2.5 w-[30vw] text-lg text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none "
                            placeholder="Application Link"
                            value={formData.application_link}
                            onChange={(e) => setFormData({ ...formData, application_link: e.target.value })}
                            ></textarea>
                         <div className="py-2 pr-2 flex">
                            <button 
                            onClick={handleSubmit}
                            className="transition-transform duration-300 ease-in-out hover:scale-110 w-50 bg-[#891839] hover:ring-2  text-white text font-bold py-2 px-6 rounded-md">
                            Submit
                        </button> 

                         </div>
                        
                    </div>
                    
                </form>
                                    

        </>
    );
}