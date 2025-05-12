import { useState } from "react";
import Notification_View from "./notification_view";
export default function Notification({setVisible,uid}) {
  const notifs= [
    {
     
      title: "ICS Week123",
      message: "Good Morning,\nLorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.Lorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.Lorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.Lorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.Lorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.Lorem ipsum dolor sit amet. Et commodi sint est enim nemo est optio magnam et provident optio et voluptates beatae sit suscipit iure? \nEa magnam labore qui ullam deserunt in eligendi dicta aut suscipit optio nam rerum iste! Et accusantium pariatur hic neque dicta eos necessitatibus asperiores ea corrupti sapiente quo illo nisi.",
      read:1,
      date:"2025/03/14"
    },
    {
      
      title: "ICS Week",
      message: "Good Morning ,asdasdasdasdsda",
      read:1,
      date:"2025/03/14"
    },
    {
      title: "ICS Week",
      message: "Good Morning ,asdasdasdasdsda",
      read:1,
      date:"2025/03/14"
    },
    {
      title: "Maintenance at xx/xx/xxxx",
      message: "Good Morning ,asdasdasdasdsda",
      read:0,
      date:"2025/03/14"
    },
    {
      title: "Maintenance at xx/xx/xxxx",
      message: "Good Morning ,asdasdasdasdsda",
      read:0,
      date:"2025/03/14"
    },
    {
      title: "Maintenance at xx/xx/xxxx",
      message: "Good Morning ,asdasdasdasdsda",
      read:0,
      date:"2025/03/14"
    }
    
  
  ];
  
  const [notification, setNotification]=useState(notifs);
  const [notification_view, setNotification_view]=useState(false);
  const [notification_var, setNotification_var]=useState("");
  const fetchNotification=()=>{
    //Fetch the notification or mail in
  }
  const refetch=()=>{
    setNotification()
  }
  return (
    
    <div className="fixed inset-0 flex justify-end items-start z-70 p-8 bg-black/50">
      {notification_view && (
      <Notification_View notification_info={notification_var} setNotification_view={setNotification_view} ></Notification_View>
      
      )}
      
      {/* Modal content */}
     <div className="relative bg-white rounded-lg shadow-lg w-[30vw]">
         {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
          <h2 className="text-emerald-800 text-4xl font-extrabold">Notifications</h2>
          <button
            onClick={() => setVisible(false)}
            type="button"
            className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-300 dark:hover:text-black rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal body */}
          
          <div className="h-[72vh] w-auto overflow-y-auto space-y-1  py-1 bg-white rounded-lg shadow-inner 
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 px-1">
          {notification.map((notifications, index) =>{
           return(
            <div
            onClick={() => {
              
              setNotification_var(notifications);
              setNotification_view(true);
              
              
            }}
            key={index}
            className=" group p-6 text-center text-xl text-black hover:bg-neutral-400 rounded-b-lg transition-colors">
             <div className=" flex justify-between items-center bg-transparent  ">
              <div className="grid grid-cols-1">
                <span className="!text-black  font-bold">{notifications.title}</span>
                <span className="text-gray-400 !text-sm group-hover:text-white text-start "> {notifications.date}</span>
              </div>
              
              {notifications.read == 1 && (
                <div className="text-emerald-800">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                  </svg>

                </div>
              )}
             </div>
              
              
              
            </div>
           )
            

          })}
          </div>
        
      </div>
    </div>
  );
}
