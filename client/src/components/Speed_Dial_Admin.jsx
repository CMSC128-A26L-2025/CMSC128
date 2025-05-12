import preview_button from "../assets/Preview Button.png"
import { useNavigate } from 'react-router-dom'
export default function Speed_Dial_Admin({user_id}){

    const navigate = useNavigate();
    return(
      
<div data-dial-init class="fixed end-6 bottom-6 group z-20">
    <div id="speed-dial-menu-default" class="flex-col items-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mb-4 space-y-2">
     
        <button 
            onClick={() => navigate("/create_event")}
        type="button" data-tooltip-target="tooltip-preview" data-tooltip-placement="left" class="flex justify-center items-center w-[52px] h-[52px] text-white hover:text-white bg-[#891839] rounded-full border border-[#891839] shadow-xs hover:bg-[#a41c4d] focus:ring-4 focus:ring-[#891839] focus:outline-none group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
            <span class="sr-only">Preview</span>
        </button>
        <button 
            onClick={() => navigate("/home")}
            type="button" data-tooltip-target="tooltip-share" data-tooltip-placement="left" class="flex justify-center items-center w-[52px] h-[52px] text-white hover:text-white bg-[#891839] rounded-full border border-[#891839] shadow-xs hover:bg-[#a41c4d] focus:ring-4 focus:ring-[#891839] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span class="sr-only">Share</span>
        </button>
        <button 
        onClick={() => navigate("/admin_main")}
        type="button" data-tooltip-target="tooltip-share" data-tooltip-placement="left" class="flex justify-center items-center w-[52px] h-[52px] text-white hover:text-white bg-[#891839] rounded-full border border-[#891839] shadow-xs hover:bg-[#a41c4d] focus:ring-4 focus:ring-[#891839] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span class="sr-only">Home</span>
        </button>

        

        
    </div>

    <button type="button" data-dial-toggle="speed-dial-menu-default" aria-controls="speed-dial-menu-default" aria-expanded="false" class="flex items-center justify-center text-emerald-800 bg-emerald-100 rounded-full w-14 h-14 hover:bg-emerald-200 dark:bg-emerald-700 dark:hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 focus:outline-none dark:focus:ring-emerald-800">
        <svg class="w-5 h-5 transition-transform group-hover:rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
        </svg>
        <span class="sr-only">Open actions menu</span>
    </button>
</div>




  
    );
}