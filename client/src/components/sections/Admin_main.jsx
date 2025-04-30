import Navbar_admin from "../header_admin";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Request_Confirmation from "../request_confirmation";
import Speed_Dial_Admin from "../Speed_Dial_Admin";
import { useAuth } from "../../AuthContext.jsx";

export const Admin_main = () => {
    const navigate = useNavigate()
    const { authAxios, user} = useAuth();

    const request = []
    const event=[]
    const job=[]

    const fetchData = async() => {
        try {
            console.log("Fetching data...");

            const eventResponse = await authAxios.get(`events/admin-page-events`);
            const jobResponse = await authAxios.get(`jobs/admin-page-jobs`);
            const requestResponse = await authAxios.get(`jobs/admin-page-job-requests`);

            const formattedEvents = eventResponse.data.map( event => ({
                name: event.event_name,
                date: new Date(event.event_date).toISOString().split('T')[0]
            }));
            const formattedJobs = jobResponse.data.map( job => ({
                company: job.company,
                job: job.job_title
            }))
            const formattedJobRequests = requestResponse.data.map( job => ({
                id: job._id,
                type: 'Job',
                name: job.job_title,
                from: job.posted_by.email
            }))

            setEvents(formattedEvents);
            setJobs(formattedJobs);
            setRequests(formattedJobRequests);
        } catch (err) {
            console.error("Failed to fetch data: ", err);
        }
    }

    const [requests, setRequests] = useState(request);
    const [events,setEvents]= useState(event);
    const [jobs,setJobs]= useState(job);
    const [req_modalOpen, setreq_modalOpen] =useState(false); 
    const [message_modal, setmessage_modal] =useState(0);
    const [request_id, setrequestID]= useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    return(
        
        <>
        <div className="w-screen">
            <Navbar_admin>
                
            </Navbar_admin>
        </div>
        <Speed_Dial_Admin></Speed_Dial_Admin>
        {/* <div className="fixed bottom-1 right-1 ">
            <img className="h-15 w-15"src= "src/assets/Preview Button.png"></img>
        </div> */}
        
        <div className="bg-[#DDDDDD] bg-cover bg-center bg-no-repeat h-auto pt-17 pb-30 ">
            <div className="grid grid-cols-10">
                <div className=" col-span-6 px-5 flex justify-start flex-col">
                    {/*Request Board */}
                    <div className="w-[712px] h-23 text-center justify-start text-emerald-800 text-[90px] font-black leading-[64px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">Request Board</div>
                    <div class=" w-auto relative  h-[80vh] p-5  bg-white rounded-3xl shadow-[0px_23px_4px_0px_rgba(0,0,0,0.25)] col-span-3 flex flex-col pl-5">
                        <div className="absolute top-0 left-0 w-full    h-15 bg-[#891839] rounded-t-3xl ">
                            
                            <div className="grid grid-cols-4 py-4 gap-x-7 text-2xl font-bold text-center pl-12 pr-17">
                                <p className="">Request Type</p>
                                <p>Name</p>
                                <p>From</p>
                                <div className="grid grid-cols-2 pl-2.5 gap-x-12">
                                    <p>No</p>
                                    <p>Yes</p>
                                </div>
                            </div>

                        </div>
                        
                        {/*<div
                                        key={index}
                                        className="text-black p-4 bg-gray-100 shadow-md"
                                    >
                                        {msg}
                                    </div> */}
                        {/* Scroll Bar Source https://preline.co/docs/custom-scrollbar.html */}
                            <div className="h-[72vh] w-auto overflow-y-auto space-y-1  py-5 bg-white rounded-lg shadow-inner 
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-4">
                                    {/* Shows all requests */}
                                {requests.map((sample_req, index) => (
                                    <div className="py-1">
                                        <button 
                                            key={index}
                                            className="grid grid-cols-4 text-black text-lg py-5  hover:bg-[#DDDDDD] w-full ">
                                                <p className="">{sample_req.type}</p>
                                                <p className="font-bold">{sample_req.name}</p>
                                                <p>{sample_req.from}</p>
                                                <div className="grid grid-cols-2 pl-7 gap-x-7.5 ">
                                                    
                                                    <button
                                                        onClick={()=>{
                                                            setreq_modalOpen(true)
                                                            setmessage_modal(0)
                                                            setrequestID(sample_req.id)
                                                        }
                                                            
                                                        } 
                                                    className="w-10 hover:ring-3 ring-red-400 rounded-lg">
                                                        <img src="src/assets/Close_round_fill.svg" className="h-10 w-10"></img>
                                                    </button>
                                                    <button onClick={()=>{
                                                        setreq_modalOpen(true)
                                                        setmessage_modal(1)
                                                        setrequestID(sample_req.id)
                                                    }
                                                        
                                                    }
                                                    className="w-10 hover:ring-3 ring-green-400 rounded-lg">
                                                        <img src="src/assets/Check_round_fill.svg" className="h-10 w-10"></img>
                                                    </button>
                                            
                                                </div>
                                       
                                        </button>
                                        <div className="h-0.5 bg-black px-10"></div>
                                    </div>
                                    
                                ))}
                            </div>
                        </div>
                </div>
                
                <div className="bg-amber-100z col-span-4 px-1 pr-1">
                    <div className="h-10"></div>
                    <div>
                        <div className="text-left w-96 h-16 justify-center text-emerald-800 text-4xl font-black font-['Roboto'] leading-[64px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] py-0">
                        On going events
                        </div>
                        <div className="w-140 h-[33vh] bg-white rounded-[20px] shadow-[0px_23px_4px_0px_rgba(0,0,0,0.25)] py-5 px-5 ">
                            <div className="h-full  overflow-y-auto space-y-1  py-5 bg-white rounded-lg shadow-inner 
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-4">
                                    {/* Shows all Events, Change the navigation to the specific event view page*/}
                                {events.map((sample_event, index) => {
                                    
                                    return(
                                        <div className="">
                                        
                                        <button 
                                            key={index}
                                            
                                            onClick = {() => navigate('')} 
                                            
                                            className="grid grid-cols-3 text-black text-lg py-5  hover:bg-[#DDDDDD] w-full  ">
                                                <p className="col-span-1">{ 
                                                sample_event.date}</p>
                                                <p className="font-bold col-span-2">{sample_event.name}</p>
                                        </button>
                                        <div className="h-0.5 bg-black px-10"></div>
                                    </div>
                                    )
                                })}
                            </div>
                            
                        </div>
                        
                        </div>
                    <div className="h-8"></div>
                    <div>
                        <div className="text-left w-auto h-13 justify-center text-emerald-800 text-4xl font-black font-['Roboto'] leading-tight [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] py-0">
                            On going Job Applications
                            </div>
                        <div className="w-140 h-[33vh] bg-white rounded-[20px] shadow-[0px_23px_4px_0px_rgba(0,0,0,0.25)] py-5 px-5 " >  
                        <div className="h-full  overflow-y-auto space-y-1  py-5 bg-white rounded-lg shadow-inner 
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-4">
                                    {/* Shows all Jobs, Change the navigation to the specific event view page*/}
                                {jobs.map((sample_job, index) => {
                                    
                                    return(
                                        <div className="">
                                        
                                        <button 
                                            key={index}
                                            
                                            onClick={() => navigate('')}
                                            
                                            className="grid grid-cols-2 text-black text-lg py-5  hover:bg-[#DDDDDD] w-full  ">
                                                <div className="flex justify-center items-center">
                                                    <p className="text-lg text-center">{sample_job.company}</p>
                                                </div>
                                                <div className="flex justify-center items-center flex-col text-right">
                                                    <p className="font-bold text-center !text-sm">{sample_job.job}</p>
                                                </div>
                                                
                                        </button>
                                        <div className="h-0.5 bg-black px-10"></div>
                                    </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                </div>
                
            </div>
            
            </div>
            {req_modalOpen && (
                    <div>
                        <Request_Confirmation request_response={message_modal} setVisible={setreq_modalOpen} id={request_id} refetch={fetchData}></Request_Confirmation>
                    </div>
                )}
        
        </>
    );
};
